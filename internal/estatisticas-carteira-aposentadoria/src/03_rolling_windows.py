"""Calcula todos os indicadores de 02_indicators.py em janelas moveis de
12 a 180 meses (passo 12) e agrega os resultados por tamanho de janela.
Ver docs/plan.md secao 3-5.
"""

import importlib.util

import numpy as np
import pandas as pd

BASE_DIR = "internal/estatisticas-carteira-aposentadoria"
TAMANHOS_JANELA = list(range(12, 217, 12))  # 12, 24, ..., 216 (1 a 18 anos)
PERCENTIS = [10, 25, 75, 90]


def carregar_modulo(nome, caminho):
    spec = importlib.util.spec_from_file_location(nome, caminho)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


ind = carregar_modulo("indicators", f"{BASE_DIR}/src/02_indicators.py")


def calcular_indicadores_janela(retornos_nom, retornos_real, rf_nom, rf_real,
                                 serie_nom_completa, serie_real_completa, idx_inicio):
    resultado = {}

    for base, r, rf, serie_completa in [
        ("nominal", retornos_nom, rf_nom, serie_nom_completa),
        ("real", retornos_real, rf_real, serie_real_completa),
    ]:
        resultado[f"cagr_{base}"] = ind.cagr(r)
        resultado[f"volatilidade_{base}"] = ind.volatilidade_anualizada(r)
        resultado[f"drawdown_maximo_{base}"] = ind.drawdown_maximo(r)
        resultado[f"tempo_recuperacao_{base}"] = ind.tempo_recuperacao(r, serie_completa, idx_inicio)
        resultado[f"ulcer_index_{base}"] = ind.ulcer_index(r)
        resultado[f"sharpe_{base}"] = ind.sharpe(r, rf)
        resultado[f"sortino_{base}"] = ind.sortino(r, rf)
        resultado[f"calmar_{base}"] = ind.calmar(r)
        resultado[f"pior_mes_{base}"] = ind.pior_mes(r)
        resultado[f"melhor_mes_{base}"] = ind.melhor_mes(r)
        resultado[f"var5_{base}"] = ind.var_historico(r)
        resultado[f"cvar5_{base}"] = ind.cvar_historico(r)
        resultado[f"skewness_{base}"] = ind.skewness(r)
        resultado[f"curtose_{base}"] = ind.curtose(r)

    # % meses positivos/negativos: conceito unico, calculado sobre a serie
    # nominal (decisao registrada em decisions.md)
    resultado["pct_meses_positivos"] = ind.pct_meses_positivos(retornos_nom)
    resultado["pct_meses_negativos"] = ind.pct_meses_negativos(retornos_nom)

    return resultado


def gerar_janelas(base_df):
    r_nom = base_df["ret_carteira_nominal"].values
    r_real = base_df["ret_carteira_real"].values
    rf_nom = base_df["cdi_nominal"].values
    rf_real = base_df["cdi_real"].values
    n = len(base_df)

    linhas = []
    for w in TAMANHOS_JANELA:
        n_janelas = n - w + 1
        if n_janelas < 1:
            continue
        for inicio in range(n_janelas):
            fim = inicio + w
            resultado = calcular_indicadores_janela(
                r_nom[inicio:fim], r_real[inicio:fim],
                rf_nom[inicio:fim], rf_real[inicio:fim],
                r_nom, r_real, inicio,
            )
            resultado["tamanho_janela_meses"] = w
            resultado["data_inicio"] = base_df["Data"].iloc[inicio]
            resultado["data_fim"] = base_df["Data"].iloc[fim - 1]
            linhas.append(resultado)

    return pd.DataFrame(linhas)


def agregar_por_tamanho(janelas_df):
    """Uma linha por (tamanho_janela, indicador, estatistica-resumo)."""
    colunas_indicador = [
        c for c in janelas_df.columns
        if c not in ("tamanho_janela_meses", "data_inicio", "data_fim")
    ]

    linhas_agregadas = []
    for w, grupo in janelas_df.groupby("tamanho_janela_meses"):
        n_janelas = len(grupo)
        for coluna in colunas_indicador:
            valores = grupo[coluna]

            if coluna.startswith("tempo_recuperacao"):
                numericos = pd.to_numeric(valores, errors="coerce").dropna()
                n_nao_recuperado = int((valores == "nao recuperado").sum())
                linha = {
                    "tamanho_janela_meses": w,
                    "indicador": coluna,
                    "n_janelas": n_janelas,
                    "n_nao_recuperado": n_nao_recuperado,
                    "mediana": numericos.median() if len(numericos) else np.nan,
                    "min": numericos.min() if len(numericos) else np.nan,
                    "max": numericos.max() if len(numericos) else np.nan,
                }
                for p in PERCENTIS:
                    linha[f"p{p}"] = numericos.quantile(p / 100) if len(numericos) else np.nan
            else:
                linha = {
                    "tamanho_janela_meses": w,
                    "indicador": coluna,
                    "n_janelas": n_janelas,
                    "n_nao_recuperado": np.nan,
                    "mediana": valores.median(),
                    "min": valores.min(),
                    "max": valores.max(),
                }
                for p in PERCENTIS:
                    linha[f"p{p}"] = valores.quantile(p / 100)

            linhas_agregadas.append(linha)

    return pd.DataFrame(linhas_agregadas)


def main():
    base_df = pd.read_csv(f"{BASE_DIR}/output/base_consolidada.csv", parse_dates=["Data"])

    janelas_df = gerar_janelas(base_df)
    print(f"Total de janelas calculadas: {len(janelas_df)}")

    janelas_df.to_csv(f"{BASE_DIR}/output/janelas_detalhado.csv", index=False)
    print(f"OK: {len(janelas_df)} linhas em janelas_detalhado.csv (uma por janela individual)")

    agregado_df = agregar_por_tamanho(janelas_df)
    agregado_df.to_csv(f"{BASE_DIR}/output/estatisticas_por_janela.csv", index=False)
    print(f"OK: {len(agregado_df)} linhas em estatisticas_por_janela.csv")

    # sanity check: CAGR mediano cai conforme a janela fica maior/menor? dispersao cai com janela maior?
    cagr_nom = agregado_df[agregado_df["indicador"] == "cagr_nominal"]
    print(cagr_nom[["tamanho_janela_meses", "n_janelas", "mediana", "min", "max"]].to_string(index=False))


if __name__ == "__main__":
    main()
