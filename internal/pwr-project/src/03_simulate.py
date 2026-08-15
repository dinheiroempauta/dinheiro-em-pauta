"""
Fase 3.3 — Simulador de retirada.

Aplica a Decisão 12 (retirada real fixa, mensal) e a Decisão 7 (critério de
sucesso: valor real final >= valor real inicial) sobre as trajetórias
geradas pelo bootstrap estacionário.
"""
import numpy as np


def simulate_withdrawal(
    return_paths: np.ndarray,
    annual_withdrawal_rate: float,
    initial_value: float = 100.0,
) -> dict:
    """
    Simula a evolução do patrimônio real para cada trajetória em
    `return_paths` (shape n_paths x n_months), retirando um valor real fixo
    mensal = (annual_withdrawal_rate / 12) * initial_value.

    Critério de sucesso (Decisão 7): valor real final >= valor real inicial.
    Métrica complementar: fração de trajetórias que NUNCA caem abaixo do
    valor inicial em nenhum ponto intermediário (mais estrita).

    Retorna dict com: success_rate, never_drawdown_rate, final_values,
    min_values (mínimo ao longo de cada trajetória).
    """
    n_paths, n_months = return_paths.shape
    monthly_withdrawal = (annual_withdrawal_rate / 12.0) * initial_value

    v = np.full(n_paths, initial_value, dtype=np.float64)
    min_v = v.copy()

    for t in range(n_months):
        v = v * (1.0 + return_paths[:, t]) - monthly_withdrawal
        v = np.maximum(v, 0.0)  # patrimônio não fica negativo (ruína)
        min_v = np.minimum(min_v, v)

    success = v >= initial_value
    never_drawdown = min_v >= initial_value

    return {
        "success_rate": success.mean(),
        "never_drawdown_rate": never_drawdown.mean(),
        "final_values": v,
        "min_values": min_v,
    }


def find_pwr(
    return_paths: np.ndarray,
    target_success_rate: float,
    initial_value: float = 100.0,
    w_low: float = 0.0,
    w_high: float = 0.15,
    tol: float = 1e-5,
    max_iter: int = 60,
) -> dict:
    """
    Busca binária pela maior taxa de retirada anual real `w` tal que a taxa
    de sucesso simulada seja >= target_success_rate.

    success_rate(w) é monotonicamente decrescente em w, então busca binária
    é válida.
    """
    lo, hi = w_low, w_high

    # Checagem de sanidade dos limites
    res_lo = simulate_withdrawal(return_paths, lo, initial_value)
    res_hi = simulate_withdrawal(return_paths, hi, initial_value)
    if res_lo["success_rate"] < target_success_rate:
        raise ValueError(
            f"Mesmo w=0 não atinge {target_success_rate:.0%} de sucesso "
            f"(taxa obtida: {res_lo['success_rate']:.2%}). Verifique os dados."
        )

    for _ in range(max_iter):
        mid = (lo + hi) / 2
        res_mid = simulate_withdrawal(return_paths, mid, initial_value)
        if res_mid["success_rate"] >= target_success_rate:
            lo = mid
        else:
            hi = mid
        if (hi - lo) < tol:
            break

    final = simulate_withdrawal(return_paths, lo, initial_value)
    return {
        "pwr": lo,
        "achieved_success_rate": final["success_rate"],
        "never_drawdown_rate": final["never_drawdown_rate"],
    }


if __name__ == "__main__":
    import pandas as pd
    import sys
    sys.path.insert(0, "/home/claude/pwr-project/src")
    from importlib import import_module
    bootstrap_mod = import_module("02_bootstrap")

    df = pd.read_csv("/home/claude/pwr-project/output/portfolio_monthly_returns.csv")
    r = df["ret_carteira_real"].values

    rng = np.random.default_rng(42)
    paths = bootstrap_mod.stationary_bootstrap_paths(
        r, n_paths=10_000, n_months=720, mean_block_length=12.0, rng=rng
    )

    for target in [0.75, 0.90, 0.95, 0.99]:
        result = find_pwr(paths, target_success_rate=target)
        print(
            f"PWR@{target:.0%}: {result['pwr']*100:.3f}% a.a. real "
            f"(sucesso alcançado: {result['achieved_success_rate']:.2%}, "
            f"nunca-drawdown: {result['never_drawdown_rate']:.2%})"
        )
