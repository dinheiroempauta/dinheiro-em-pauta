"""Matriz de correlacao de Pearson entre os 5 ativos, periodo completo.
Ver docs/plan.md secao 2 (ultimo item) e secao 5.
"""

import pandas as pd

BASE_DIR = "internal/estatisticas-carteira-aposentadoria"
ATIVOS = ["ret_vwra11", "ret_divo11", "ret_b5p211", "ret_cdib11", "ret_gold11"]


def main():
    base_df = pd.read_csv(f"{BASE_DIR}/output/base_consolidada.csv")
    matriz = base_df[ATIVOS].corr(method="pearson")
    matriz.to_csv(f"{BASE_DIR}/output/matriz_correlacao_ativos.csv")
    print(matriz.round(3))


if __name__ == "__main__":
    main()
