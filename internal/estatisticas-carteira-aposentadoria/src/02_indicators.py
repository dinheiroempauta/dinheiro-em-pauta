"""Funcoes puras de calculo de indicadores sobre uma janela de retornos
mensais. Ver docs/plan.md secao 2 para a formula/racional de cada uma.

Nenhuma funcao aqui le arquivo ou tem side effect - recebem arrays/series
numericas e devolvem numero (ou string, no caso de "nao recuperado").
"""

import numpy as np
from scipy import stats

MESES_POR_ANO = 12


def cagr(retornos):
    n = len(retornos)
    capital_final = np.prod(1 + retornos)
    return capital_final ** (MESES_POR_ANO / n) - 1


def volatilidade_anualizada(retornos):
    return np.std(retornos, ddof=1) * np.sqrt(MESES_POR_ANO)


def curva_capital(retornos):
    """Capital acumulado comecando em 1, uma entrada por mes da serie."""
    return np.cumprod(1 + retornos)


def drawdown_serie(capital):
    running_max = np.maximum.accumulate(capital)
    return (capital - running_max) / running_max


def drawdown_maximo(retornos):
    capital = curva_capital(retornos)
    return drawdown_serie(capital).min()


def tempo_recuperacao(retornos_janela, retornos_completos, idx_inicio_janela):
    """Meses do fundo do maior drawdown da janela ate a capital voltar a
    igualar o pico anterior, estendendo a busca na serie completa se
    necessario (decisions.md). Retorna int (meses) ou a string
    'nao recuperado'.
    """
    capital_janela = curva_capital(retornos_janela)
    dd_janela = drawdown_serie(capital_janela)
    t_min = int(np.argmin(dd_janela))

    # capital acumulado da serie completa alinhado ao mesmo ponto de partida
    capital_completo = curva_capital(retornos_completos)
    idx_fundo_global = idx_inicio_janela + t_min
    pico_ate_fundo = capital_completo[: idx_fundo_global + 1].max()

    capital_apos_fundo = capital_completo[idx_fundo_global:]
    recuperado = np.where(capital_apos_fundo >= pico_ate_fundo)[0]
    if len(recuperado) == 0:
        return "nao recuperado"
    return int(recuperado[0])  # meses desde o fundo (0 = recupera no mesmo mes)


def ulcer_index(retornos):
    capital = curva_capital(retornos)
    dd_pct = drawdown_serie(capital) * 100
    return np.sqrt(np.mean(dd_pct ** 2))


def sharpe(retornos, retornos_livre_risco):
    cagr_carteira = cagr(retornos)
    cagr_rf = cagr(retornos_livre_risco)
    vol = volatilidade_anualizada(retornos)
    return (cagr_carteira - cagr_rf) / vol


def sortino(retornos, retornos_livre_risco):
    cagr_carteira = cagr(retornos)
    cagr_rf = cagr(retornos_livre_risco)
    negativos = retornos[retornos < 0]
    if len(negativos) < 2:
        return np.nan
    downside_dev = np.std(negativos, ddof=1) * np.sqrt(MESES_POR_ANO)
    return (cagr_carteira - cagr_rf) / downside_dev


def calmar(retornos):
    dd = drawdown_maximo(retornos)
    if dd == 0:
        return np.nan
    return cagr(retornos) / abs(dd)


def pior_mes(retornos):
    return retornos.min()


def melhor_mes(retornos):
    return retornos.max()


def pct_meses_positivos(retornos):
    return float(np.mean(retornos > 0))


def pct_meses_negativos(retornos):
    return float(np.mean(retornos < 0))


def var_historico(retornos, corte=0.05):
    return np.percentile(retornos, corte * 100)


def cvar_historico(retornos, corte=0.05):
    var = var_historico(retornos, corte)
    cauda = retornos[retornos <= var]
    return cauda.mean()


def skewness(retornos):
    return stats.skew(retornos)


def curtose(retornos):
    return stats.kurtosis(retornos)  # excesso de curtose (normal = 0)
