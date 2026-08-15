"""
Fase 3.1 — Preparação dos retornos mensais reais da carteira.

Aplica as decisões já registradas em docs/decisions.md:
- Decisão 0: proxies de índice para cada ETF, com desconto de taxa de adm
  e ajuste cambial (VWRA11 e GOLD11).
- Decisão 1: convenção de data — linha rotulada com dia 1 do mês M
  representa o fechamento do próprio mês M.
- Decisão 2: remoção de linhas duplicadas do IDIV (2016).
- Decisão 3: início da amostra em dez/2005 (base do IDIV).
- Decisão 4: janela final de retornos mensais = jan/2006 a jun/2026
  (246 observações), limitada pela cobertura do IPCA.

Saída: output/portfolio_monthly_returns.csv
Colunas: Data, ret_vwra11, ret_divo11, ret_b5p211, ret_cdib11, ret_gold11,
         ret_carteira_nominal, ret_ipca, ret_carteira_real
"""
import pandas as pd
import numpy as np

XLS_PATH = "/home/claude/pwr-project/data/BD_Carteira_Claude_corrigida.xlsx"
OUT_PATH = "/home/claude/pwr-project/output/portfolio_monthly_returns.csv"

# Pesos da carteira (Decisão registrada no spec.md / conversa inicial)
WEIGHTS = {
    "vwra11": 0.30,
    "divo11": 0.20,
    "b5p211": 0.40,
    "cdib11": 0.05,
    "gold11": 0.05,
}

# Taxas de administração anuais de cada ETF (Decisão 0)
FEES_AA = {
    "vwra11": 0.0049,
    "divo11": 0.0050,
    "b5p211": 0.0020,
    "cdib11": 0.0015,
    "gold11": 0.0057,
}


def fee_monthly(fee_aa: float) -> float:
    """Converte taxa de adm anual em taxa mensal composta (Decisão 0)."""
    return (1 + fee_aa) ** (1 / 12) - 1


def load_level_series(xls, sheet, datecol, valcol, date_from_ano_mes=False):
    df = pd.read_excel(xls, sheet)
    if date_from_ano_mes:
        df["Data"] = pd.to_datetime(dict(year=df["Ano"], month=df["Mês"], day=1))
        df = df.drop_duplicates(subset="Data", keep="first")  # Decisão 2
    else:
        df["Data"] = pd.to_datetime(df[datecol])
    df = df.sort_values("Data").reset_index(drop=True)
    df["retorno"] = df[valcol].pct_change()
    return df[["Data", "retorno"]]


def load_daily_to_monthly(xls, sheet, datecol, valcol):
    """Agrega série diária para fechamento mensal (Decisão 1)."""
    df = pd.read_excel(xls, sheet)
    df["Data"] = pd.to_datetime(df[datecol])
    df = df.sort_values("Data")
    df["ano_mes"] = df["Data"].dt.to_period("M")
    monthly = df.groupby("ano_mes")[valcol].last().reset_index()
    monthly["Data"] = monthly["ano_mes"].dt.to_timestamp()
    monthly["retorno"] = monthly[valcol].pct_change()
    return monthly[["Data", "retorno"]]


def main():
    xls = pd.ExcelFile(XLS_PATH)

    idiv = load_level_series(xls, "IDIV", None, "Valor", date_from_ano_mes=True)
    ftse = load_level_series(xls, "FTSE All-World", "Data", "FTSE All-World")
    gold = load_level_series(xls, "Gold", "date", "gold_price_usd")
    ipca = load_level_series(xls, "IPCA", "Data", "Indice")

    imab5 = load_daily_to_monthly(xls, "IMA-B5", "Data de Referência", "Número Índice")
    camb = load_daily_to_monthly(xls, "Câmbio", "Data", "Cotação")

    cdi_raw = pd.read_excel(xls, "CDI")
    cdi_raw["Data"] = pd.to_datetime(cdi_raw["Data"])
    cdi = cdi_raw.sort_values("Data")[["Data", "CDI"]].rename(columns={"CDI": "retorno"})

    # Renomeia para evitar colisão no merge
    idiv = idiv.rename(columns={"retorno": "r_idiv"})
    ftse = ftse.rename(columns={"retorno": "r_ftse_usd"})
    gold = gold.rename(columns={"retorno": "r_gold_usd"})
    ipca = ipca.rename(columns={"retorno": "r_ipca"})
    imab5 = imab5.rename(columns={"retorno": "r_imab5"})
    camb = camb.rename(columns={"retorno": "r_cambio"})
    cdi = cdi.rename(columns={"retorno": "r_cdi"})

    df = idiv.merge(ftse, on="Data", how="inner") \
             .merge(gold, on="Data", how="inner") \
             .merge(ipca, on="Data", how="inner") \
             .merge(imab5, on="Data", how="inner") \
             .merge(camb, on="Data", how="inner") \
             .merge(cdi, on="Data", how="inner")

    # Janela final: jan/2006 a jun/2026 (Decisão 4)
    df = df[(df["Data"] >= "2006-01-01") & (df["Data"] <= "2026-06-01")].reset_index(drop=True)

    # --- Retornos nominais de cada "ETF sintético" em BRL ---
    df["ret_divo11"] = df["r_idiv"] - fee_monthly(FEES_AA["divo11"])
    df["ret_b5p211"] = df["r_imab5"] - fee_monthly(FEES_AA["b5p211"])
    df["ret_cdib11"] = df["r_cdi"] - fee_monthly(FEES_AA["cdib11"])

    # VWRA11 e GOLD11: compõe retorno USD com variação cambial (Decisão 0)
    df["ret_vwra11"] = (1 + df["r_ftse_usd"]) * (1 + df["r_cambio"]) - 1 - fee_monthly(FEES_AA["vwra11"])
    df["ret_gold11"] = (1 + df["r_gold_usd"]) * (1 + df["r_cambio"]) - 1 - fee_monthly(FEES_AA["gold11"])

    # --- Combinação pela alocação-alvo, com rebalanceamento mensal ---
    df["ret_carteira_nominal"] = (
        WEIGHTS["vwra11"] * df["ret_vwra11"]
        + WEIGHTS["divo11"] * df["ret_divo11"]
        + WEIGHTS["b5p211"] * df["ret_b5p211"]
        + WEIGHTS["cdib11"] * df["ret_cdib11"]
        + WEIGHTS["gold11"] * df["ret_gold11"]
    )

    # --- Deflação pelo IPCA (só na carteira já combinada) ---
    df["ret_carteira_real"] = (1 + df["ret_carteira_nominal"]) / (1 + df["r_ipca"]) - 1

    out_cols = [
        "Data", "ret_vwra11", "ret_divo11", "ret_b5p211", "ret_cdib11",
        "ret_gold11", "ret_carteira_nominal", "r_ipca", "ret_carteira_real",
    ]
    result = df[out_cols].rename(columns={"r_ipca": "ret_ipca"})
    result.to_csv(OUT_PATH, index=False)

    print(f"Linhas geradas: {len(result)}")
    print(f"Período: {result['Data'].min().date()} a {result['Data'].max().date()}")
    print(result.head())
    print("...")
    print(result.tail())
    print("\nEstatísticas do retorno real da carteira:")
    print(result["ret_carteira_real"].describe())

    n_years = len(result) / 12
    cagr_real = (1 + result["ret_carteira_real"]).prod() ** (1 / n_years) - 1
    print(f"\nCAGR real da carteira ({n_years:.1f} anos): {cagr_real*100:.2f}% a.a.")


if __name__ == "__main__":
    main()
