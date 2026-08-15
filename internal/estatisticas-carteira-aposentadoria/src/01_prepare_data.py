"""Mescla a base de retornos da carteira com o CDI oficial e gera a base
consolidada usada pelas etapas seguintes. Ver docs/plan.md secao 1."""

import pandas as pd

BASE_DIR = "internal/estatisticas-carteira-aposentadoria"


def carregar_carteira():
    df = pd.read_csv(f"{BASE_DIR}/retornos_mensais_carteira.csv", parse_dates=["Data"])
    return df


def carregar_cdi():
    df = pd.read_csv(f"{BASE_DIR}/cdi_mensal.csv")
    df["Data"] = pd.to_datetime(df["Data"], format="%m/%Y")
    df["cdi_nominal"] = (
        df["CDI"].str.replace("%", "", regex=False).str.replace(",", ".", regex=False).astype(float) / 100
    )
    return df[["Data", "cdi_nominal"]]


def main():
    carteira = carregar_carteira()
    cdi = carregar_cdi()

    base = carteira.merge(cdi, on="Data", how="inner")
    assert len(base) == len(carteira), (
        f"Merge perdeu linhas: carteira tem {len(carteira)}, resultado tem {len(base)}"
    )

    base["cdi_real"] = (1 + base["cdi_nominal"]) / (1 + base["ret_ipca"]) - 1

    base.to_csv(f"{BASE_DIR}/output/base_consolidada.csv", index=False)
    print(f"OK: {len(base)} linhas, {base['Data'].min().date()} a {base['Data'].max().date()}")
    print(base[["Data", "ret_carteira_nominal", "ret_carteira_real", "cdi_nominal", "cdi_real"]].head(3))
    print(base[["Data", "ret_carteira_nominal", "ret_carteira_real", "cdi_nominal", "cdi_real"]].tail(3))


if __name__ == "__main__":
    main()
