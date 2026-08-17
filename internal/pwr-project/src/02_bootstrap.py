"""
Fase 3.2 — Bootstrap estacionário (Politis-Romano, 1994).

Aplica a Decisão 6 (docs/decisions.md): bootstrap estacionário com
comprimento médio de bloco de 12 meses.

Gera trajetórias sintéticas de retornos mensais reais, reamostrando blocos
de comprimento aleatório (distribuição geométrica) com reposição, a partir
dos 246 retornos mensais reais da carteira (jan/2006-jun/2026).
"""
import numpy as np


def stationary_bootstrap_paths(
    returns: np.ndarray,
    n_paths: int,
    n_months: int,
    mean_block_length: float = 12.0,
    rng: np.random.Generator = None,
) -> np.ndarray:
    """
    Gera `n_paths` trajetórias de `n_months` retornos cada, via bootstrap
    estacionário de Politis-Romano (1994) sobre a série `returns` (1D).

    Mecânica: a cada passo de tempo, com probabilidade p = 1/mean_block_length
    "pula" para um novo índice aleatório na série original; caso contrário,
    continua a partir do próximo índice (com wrap-around circular, como no
    bootstrap circular de Politis & Romano, 1992/1994).

    Retorna array (n_paths, n_months) de retornos reais mensais.
    """
    if rng is None:
        rng = np.random.default_rng()

    n = len(returns)
    p = 1.0 / mean_block_length

    idx = rng.integers(0, n, size=n_paths)  # índice inicial de cada path
    out = np.empty((n_paths, n_months), dtype=np.float64)
    out[:, 0] = returns[idx]

    for t in range(1, n_months):
        jump = rng.random(n_paths) < p
        new_idx = rng.integers(0, n, size=n_paths)
        idx = np.where(jump, new_idx, (idx + 1) % n)
        out[:, t] = returns[idx]

    return out


if __name__ == "__main__":
    from pathlib import Path

    import pandas as pd

    OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"
    df = pd.read_csv(OUTPUT_DIR / "portfolio_monthly_returns.csv")
    r = df["ret_carteira_real"].values

    rng = np.random.default_rng(42)
    paths = stationary_bootstrap_paths(r, n_paths=1000, n_months=720, mean_block_length=12.0, rng=rng)

    print("Shape das trajetórias geradas:", paths.shape)
    print("Média mensal (amostra original):", r.mean(), "| Média mensal (bootstrap):", paths.mean())
    print("Desvio-padrão mensal (original):", r.std(), "| (bootstrap):", paths.std())

    # Checagem: CAGR real médio das trajetórias simuladas vs. CAGR real da amostra original
    cagr_orig = (1 + r).prod() ** (12 / len(r)) - 1
    cagr_boot = ((1 + paths).prod(axis=1) ** (12 / paths.shape[1]) - 1).mean()
    print(f"CAGR real (amostra original): {cagr_orig*100:.2f}% a.a.")
    print(f"CAGR real médio (trajetórias bootstrap): {cagr_boot*100:.2f}% a.a.")
