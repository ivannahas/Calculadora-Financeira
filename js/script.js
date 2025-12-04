// ARQUIVO: script.js

// Função auxiliar para formatar moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// ------- Variáveis Iniciais/Globais ------- 
const investimentos = [
    ["CDB", 0.01, "Certificado de Depósito Bancário."],
    ["Tesouro Direto", 0.008, "Títulos públicos seguros."],
    ["LCI", 0.009, "Letra de Crédito Imobiliário."],
    ["LCA", 0.0085, "Letra de Crédito do Agronegócio."],
    ["Debêntures", 0.011, "Títulos de dívida privada."],
    ["Fundo Renda Fixa", 0.007, "Fundo diversificado."]
];

// Reutilizando a função de construção (apenas para manter os cards no HTML)
const divInvestimentos = document.getElementById('investimentos');
if (divInvestimentos) {
    divInvestimentos.innerHTML = '';
    for (const [nome, taxa, descricao] of investimentos) {
        divInvestimentos.innerHTML += `
            <div class="cartaoInvestimento">
            <h3>${nome}</h3>
            <p>Exemplo de Taxa: ${(taxa * 100).toFixed(2)}% a.m.</p>
            <p>${descricao}</p>
            </div>`;
    }
}


// ------- calcular valores do investimento no Backend (Python) ------- 
async function calcularInvestimento() {
    const valorInicial = Number(document.getElementById('valorInicial').value);
    const tempo = Number(document.getElementById('tempo').value);
    const divMelhorResultado = document.getElementById('melhorResultado');
    const divOutrosResultados = document.getElementById('outrosResultados');
    
    // Limpa resultados anteriores
    divMelhorResultado.innerHTML = ''; 
    divOutrosResultados.innerHTML = '';
    
    if (isNaN(valorInicial) || isNaN(tempo) || valorInicial <= 0 || tempo <= 0) {
        divMelhorResultado.innerHTML = '<p class="error">Preencha os campos com valores positivos.</p>';
        return;
    }
    
    divMelhorResultado.innerHTML = '<p>Calculando...</p>';

    try {
        const response = await fetch('http://127.0.0.1:5000/simular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                valorInicial: valorInicial,
                tempo: tempo
            })
        });

        const data = await response.json();

        if (response.ok) {
            const resultados = data.resultados;
            const valor_inicial = data.valor_inicial;
            
            if (resultados.length === 0) {
                divMelhorResultado.innerHTML = '<p>Nenhum resultado de simulação encontrado.</p>';
                return;
            }

            // --- 1. Renderiza o 1º Lugar ---
            const primeiro = resultados[0];
            const valorFinalFormatado = formatarMoeda(primeiro.Valor_Liquido);
            const lucro = primeiro.Valor_Liquido - valor_inicial;
            const lucroFormatado = formatarMoeda(lucro);

            divMelhorResultado.innerHTML = `
                <div class="cartaoInformativo melhor-investimento primeiro-lugar">
                    <h3>🏆 Melhor Aplicação</h3>
                    <p class="investimentoSelecionado">${primeiro.Aplicacao}</p>
                    <p>Valor Líquido Final: ${valorFinalFormatado}</p>
                    <p>Lucro Estimado: ${lucroFormatado}</p>
                </div>
            `;
            
            // --- 2. Renderiza o 2º e 3º Lugares ---
            if (resultados.length > 1) {
                let htmlOutros = '';
                
                // Itera do 2º (índice 1) até o 3º (índice 2)
                for (let i = 1; i < Math.min(3, resultados.length); i++) {
                    const colocacao = i + 1;
                    const resultado = resultados[i];
                    const simbolo = colocacao === 2 ? '🥈' : '🥉'; // Taça prata e bronze
                    const classe = colocacao === 2 ? 'segundo-lugar' : 'terceiro-lugar';

                    const valorFinalFormatado = formatarMoeda(resultado.Valor_Liquido);
                    const lucro = resultado.Valor_Liquido - valor_inicial;
                    const lucroFormatado = formatarMoeda(lucro);
                    
                    htmlOutros += `
                        <div class="cartaoInformativo ${classe}">
                            <h4>${simbolo} ${colocacao}º Lugar</h4>
                            <p><strong>${resultado.Aplicacao}</strong></p>
                            <p>Final: ${valorFinalFormatado}</p>
                            <p>Lucro: ${lucroFormatado}</p>
                        </div>
                    `;
                }
                divOutrosResultados.innerHTML = htmlOutros;
            }

            // === NOVO CÓDIGO DE ROLAGEM AUTOMÁTICA (SCROLL) ===
            const resultadosContainer = document.querySelector('.resultadosContainer');
            if (resultadosContainer) {
                resultadosContainer.scrollIntoView({ 
                    behavior: 'smooth', // Rolagem suave
                    block: 'center'     // Alinha o container no meio da tela
                });
            }

        } else {
            // Se houver erro na API
            divMelhorResultado.innerHTML = `<p class="error">Erro ao calcular: ${data.erro || 'Ocorreu um erro desconhecido.'}</p>`;
        }

    } catch (error) {
        // Erro de conexão
        console.error('Erro na requisição:', error);
        divMelhorResultado.innerHTML = '<p class="error">Erro de conexão. Certifique-se de que o servidor Python está rodando na porta 5000.</p>';
    }
}