# Calculadora Financeira - Comparador de Renda Fixa

## Visão Geral

Ferramenta web desenvolvida para simular e comparar o rendimento líquido de diversos produtos de Renda Fixa (CDBs, LCIs, Tesouro Direto, etc.) ao longo de um período definido pelo usuário.

O projeto utiliza uma arquitetura **Client-Server (Frontend/Backend)** para garantir cálculos precisos e complexos, aplicando regras de mercado, como alíquotas de Imposto de Renda (IR) regressivas e indexadores (CDI, SELIC e IPCA).

## Funcionalidades

* **Simulação Completa:** Calcula o rendimento líquido (após IR) baseado no valor inicial e tempo de investimento.
* **Ranking de Resultados:** Exibe o **Top 3** de melhores aplicações, com o 1º colocado em destaque e o 2º e 3º em um ranking visual com cards dedicados.
* **Cálculo Avançado:** O Backend Python utiliza a biblioteca **Pandas** para gerenciar a base de dados de investimentos e aplicar a fórmula de juros compostos.
* **Alíquotas Regressivas:** Implementação da tabela regressiva de Imposto de Renda conforme o tempo de aplicação (regra de 180, 360, 720 dias).
* **Experiência de Usuário:** Rolagem automática (smooth scroll) para a área de resultados após a simulação.
* **Navegação Fixa:** Os botões de navegação (`Renda Fixa`, `Simulador`) utilizam rolagem suave para as seções corretas da página.

## Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | Interface de usuário e lógica de conexão com a API. |
| **Backend** | Python, Flask | Framework web para criação da API REST e execução dos cálculos. |
| **Cálculo** | Pandas, RegEx | Processamento eficiente dos dados de investimento e conversão de taxas. |

## Como Rodar Localmente

O projeto é dividido entre o frontend estático e um backend dinâmico (servidor Flask).

### 1. Pré-requisitos

Certifique-se de ter o **Python (3.x)** e o **Git** instalados em sua máquina.

### 2. Configuração do Backend (Python)

Primeiro, você deve criar um arquivo chamado **`requirements.txt`** no diretório raiz do projeto e adicionar as dependências:

**`requirements.txt`**
```txt
Flask
Flask-Cors
pandas
Em seguida, use os comandos no seu terminal (VS Code):

Bash

# 1. Crie e ative um ambiente virtual (recomendado)
py -m venv .venv
.\.venv\Scripts\activate.bat  # Para Windows CMD
# ou: ./.venv/Scripts/activate (Para Linux/Mac/PowerShell)

# 2. Instale as dependências
py -m pip install -r requirements.txt

# 3. Execute o servidor Flask
# O servidor rodará em [http://127.0.0.1:5000](http://127.0.0.1:5000)
py Logica.py
Se o servidor iniciar corretamente, você verá a mensagem: * Running on http://127.0.0.1:5000. Mantenha este terminal aberto.

3. Acesso ao Frontend
Com o servidor Python rodando em segundo plano, abra o arquivo index.html diretamente no seu navegador ou através do Live Server do VS Code. O JavaScript se conectará à API para buscar os resultados da simulação.

 Nota Importante sobre o GitHub Pages
O site está hospedado no GitHub Pages, que é um serviço de hospedagem estática (funciona apenas para HTML, CSS e JavaScript).

O código Python (Flask) é um servidor dinâmico. Portanto, a calculadora não funcionará publicamente no seu link do GitHub Pages, pois ele não consegue se conectar ao servidor Python que está na sua máquina local.

Para que a calculadora funcione 24/7 na internet, você precisaria HOSPEDAR O BACKEND (Logica.py) em um serviço de nuvem (como Render ou Heroku).

 Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para sugerir melhorias na lógica de cálculo, adicionar novos produtos de Renda Fixa ou otimizar o design.

Faça um Fork do projeto.

Crie uma branch para sua feature: git checkout -b minha-feature

Commit suas alterações: git commit -m 'Adiciona nova feature X'

Faça o Push para a branch: git push origin minha-feature

Abra um Pull Request.
