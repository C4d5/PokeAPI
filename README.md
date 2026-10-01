# 🎮 Quem é esse Pokémon? (Whos That Pokémon?)

Um mini-jogo web interativo e nostálgico baseado no clássico quadro do anime Pokémon ("Quem é esse Pokémon?"). O objetivo é adivinhar o Pokémon misterioso através da sua silhueta antes de revelar a sua forma original, contando com um sistema dinâmico de dicas individuais!

---

## 🚀 Tecnologias Utilizadas

*   **HTML5** / **CSS3** (Layout responsivo, sombras e efeitos visuais customizados)
*   **JavaScript (Vanilla)** (Manipulação de DOM e lógica de jogo)
*   **[PokéAPI](https://pokeapi.co/)** (Consumo de dados e sprites oficiais da 1.ª Geração)

---

## ✨ Funcionalidades

*   **Silhueta Misteriosa:** O Pokémon é exibido em formato de silhueta preta utilizando filtros CSS (`brightness(0)`).
*   **Sistema de Dicas Interativas:** O jogador pode gastar cliques para revelar dicas cruciais sob demanda:
    *   💡 **Tipo(s)** do Pokémon.
    *   💡 **Primeira e última letra** do nome, além da quantidade de caracteres.
    *   💡 **Estágio de evolução** (Forma Base ou Evoluído).
*   **Validação em Tempo Real:** Valida a resposta digitada pelo usuário (ou pressionando a tecla `Enter`), revelando o Pokémon colorido e ativando o botão de próxima rodada em caso de acerto.
*   **Geração 1:** Sorteio aleatório focado nos clássicos 150 Pokémon originais.

---

## 📂 Estrutura do Projeto

```text
├── index.html        # Estrutura principal da interface do jogo
├── style.css         # Estilização visual, caixas e animações
└── script.js         # Lógica de consumo da API, dicas e validações
```

🖥️ Como Executar o Projeto Localmente
Clona este repositório para a tua máquina:

Bash
git clone [https://github.com/teu-utilizador/whos-that-pokemon.git](https://github.com/teu-utilizador/whos-that-pokemon.git)
Certifica-te de ter uma pasta chamada imagens contendo a imagem de fundo utilizada (quemépokemon.jpg).

Abre o ficheiro index.html diretamente no teu navegador web preferido e diverte-te!
