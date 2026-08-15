"""
Fase 4 — Resultados finais.

Roda a configuração final (Decisões 6, 7, 8, 9, 12): bootstrap estacionário,
bloco médio 12 meses, horizonte 60 anos, 10.000 trajetórias, critério de
sucesso = valor final real >= inicial, retirada real fixa mensal.
"""
import sys
sys.path.insert(0, "/home/claude/pwr-project/src")
import numpy as np
import pandas as pd
from importlib import import_module

bootstrap_mod = import_module("02_bootstrap")
simulate_mod = import_module("03_simulate")

df = pd.read_csv("/home/claude/pwr-project/output/portfolio_monthly_returns.csv")
r = df["ret_carteira_real"].values

rng = np.random.default_rng(2026)
paths = bootstrap_mod.stationary_bootstrap_paths(
    r, n_paths=10_000, n_months=720, mean_block_length=12.0, rng=rng
)

targets = [0.75, 0.80, 0.85, 0.90, 0.95, 0.99]
rows = []
for t in targets:
    res = simulate_mod.find_pwr(paths, target_success_rate=t)
    rows.append({
        "percentil_sucesso": t,
        "PWR_real_aa": res["pwr"],
        "sucesso_alcancado": res["achieved_success_rate"],
        "nunca_drawdown_rate": res["never_drawdown_rate"],
    })

result_df = pd.DataFrame(rows)
result_df.to_csv("/home/claude/pwr-project/output/pwr_final_results.csv", index=False)
print(result_df.to_string(index=False, formatters={
    "percentil_sucesso": "{:.0%}".format,
    "PWR_real_aa": "{:.3%}".format,
    "sucesso_alcancado": "{:.3%}".format,
    "nunca_drawdown_rate": "{:.2%}".format,
}))
