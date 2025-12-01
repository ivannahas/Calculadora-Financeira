import pandas as pd
import re

# --- 1. CONFIGURAÇÕES DE MERCADO (Variáveis Editáveis) ---
SELIC = 0.1125  # 11.25% a.a.
CDI = 0.1115  # 11.15% a.a.
IPCA = 0.0450  # 4.50% a.a.

# --- 2. BASE DE DADOS DAS APLICAÇÕES (Embutida) ---
base_dados = [
    {"Aplicacao": "CDB", "Tipo": "Pós-fixado (CDI)", "Taxa_Min": "100% do CDI", "Taxa_Max": "130% do CDI",
     "Isento_IR": False},
    {"Aplicacao": "CDB", "Tipo": "Prefixado", "Taxa_Min": "13.0% a.a.", "Taxa_Max": "17.0% a.a.", "Isento_IR": False},
    {"Aplicacao": "Tesouro", "Tipo": "Selic", "Taxa_Min": "Selic + 0.05% a.a.", "Taxa_Max": "Selic + 0.15% a.a.",
     "Isento_IR": False},
    {"Aplicacao": "Tesouro", "Tipo": "IPCA+", "Taxa_Min": "IPCA + 5.0% a.a.", "Taxa_Max": "IPCA + 7.0% a.a.",
     "Isento_IR": False},
    {"Aplicacao": "Tesouro", "Tipo": "Prefixado", "Taxa_Min": "12.0% a.a.", "Taxa_Max": "16.0% a.a.",
     "Isento_IR": False},
    {"Aplicacao": "LCI/LCA", "Tipo": "Pós-fixado (CDI)", "Taxa_Min": "90% do CDI", "Taxa_Max": "105% do CDI",
     "Isento_IR": True},
    {"Aplicacao": "LCI/LCA", "Tipo": "Prefixado", "Taxa_Min": "11.0% a.a.", "Taxa_Max": "14.0% a.a.",
     "Isento_IR": True},
    {"Aplicacao": "Debêntures", "Tipo": "Híbrida (IPCA+)", "Taxa_Min": "IPCA + 6.0% a.a.",
     "Taxa_Max": "IPCA + 9.0% a.a.", "Isento_IR": True},
    {"Aplicacao": "Fundo RF", "Tipo": "Pós-fixado", "Taxa_Min": "CDI - 0.5% a.a.", "Taxa_Max": "CDI - 0.0% a.a.",
     "Isento_IR": False}
]


# --- 3. LÓGICA DE CÁLCULO ---
def calcular_taxa_anual(texto_taxa):
    texto = str(texto_taxa).replace(',', '.')
    if 'CDI' in texto:
        match_cdi = re.search(r'([\d\.]+)%\s*do\s*CDI', texto, re.IGNORECASE)
        if match_cdi: return (float(match_cdi.group(1)) / 100) * CDI
        match_cdi_spread = re.search(r'CDI\s*([\-\+])\s*([\d\.]+)%', texto, re.IGNORECASE)
        if match_cdi_spread:
            val = float(match_cdi_spread.group(2)) / 100
            return (CDI - val) if match_cdi_spread.group(1) == '-' else (CDI + val)
        return CDI  # Fallback

    match_pre = re.search(r'^([\d\.]+)%\s*a\.a\.', texto, re.IGNORECASE)
    if match_pre: return float(match_pre.group(1)) / 100

    match_selic = re.search(r'Selic\s*\+\s*([\d\.]+)%', texto, re.IGNORECASE)
    if match_selic: return SELIC + (float(match_selic.group(1)) / 100)

    match_ipca = re.search(r'IPCA\s*\+\s*([\d\.]+)%', texto, re.IGNORECASE)
    if match_ipca: return IPCA + (float(match_ipca.group(1)) / 100)

    return 0.0


def calcular_ir(meses, isento):
    if isento: return 0.0
    dias = meses * 30
    if dias <= 180:
        return 0.225
    elif dias <= 360:
        return 0.20
    elif dias <= 720:
        return 0.175
    else:
        return 0.15


def simular(valor_inicial, meses):
    resultados = []

    for item in base_dados:
        i_min = calcular_taxa_anual(item['Taxa_Min'])
        anos = meses / 12.0
        bruto_min = valor_inicial * (1 + i_min) ** anos

        # IR
        aliquota = calcular_ir(meses, item['Isento_IR'])
        imposto_min = (bruto_min - valor_inicial) * aliquota
        liq_min = bruto_min - imposto_min

        resultados.append({
            'Aplicação': f"{item['Aplicacao']} - {item['Tipo']}",
            'Valor Líquido': liq_min
        })

    df = pd.DataFrame(resultados).sort_values(by='Valor Líquido', ascending=False)
    return df


# --- 4. EXECUÇÃO ---
VALOR = int(input('Digite o valor que deseja investir: '))
MESES = int(input('Digite o tempo que deseja investir em messes: '))

df_resultado = simular(VALOR, MESES)
melhor = df_resultado.iloc[0]

print(df_resultado.to_markdown(index=False, numalign="left", stralign="left"))
print(f"\n🏆 MELHOR APLICAÇÃO: {melhor['Aplicação']}")
print(f"💰 VALOR LÍQUIDO FINAL: R$ {melhor['Valor Líquido']:,.2f}")