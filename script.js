function mudarTela(nomeTela) {
    // 1. Esconde todas as telas
    document.getElementById('tela-home').classList.add('hidden');
    document.getElementById('tela-game').classList.add('hidden');
    document.getElementById('tela-pokedex').classList.add('hidden');

    // 2. Mostra apenas a tela solicitada
    if (nomeTela === 'home') {
        document.getElementById('tela-home').classList.remove('hidden');
    } else if (nomeTela === 'game') {
        document.getElementById('tela-game').classList.remove('hidden');
        iniciarNovoJogo();
    } else if (nomeTela === 'pokedex') {
        document.getElementById('tela-pokedex').classList.remove('hidden');
        carregarPokedexCompleta();
    }
}

function alternarTema() {
    const body = document.body;

    if (!body.classList.contains('theme-ultraball') && 
        !body.classList.contains('theme-greatball') && 
        !body.classList.contains('theme-masterball')) {
        
        // Vai para a Ultra Ball
        body.classList.add('theme-ultraball');

    } else if (body.classList.contains('theme-ultraball')) {
        
        // Passa para a Great Ball
        body.classList.remove('theme-ultraball');
        body.classList.add('theme-greatball');

    } else if (body.classList.contains('theme-greatball')) {
        
        // Passa para a Master Ball
        body.classList.remove('theme-greatball');
        body.classList.add('theme-masterball');

    } else {
        
        // Volta ao tema Clássico inicial (Vermelho)
        body.classList.remove('theme-masterball');
    }
}

async function carregarTodosOsPokemons() {
    try {
        // Pedimos à API o limite máximo atual (por exemplo, 1025 Pokémon para abranger até à 9ª geração)
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
        const dados = await resposta.json();
        
        console.log("Lista de todos os Pokémon:", dados.results);
        // dados.results é um array com o nome e o link de cada Pokémon
        
        return dados.results;
    } catch (erro) {
        console.error("Erro ao carregar a lista de Pokémon:", erro);
    }
}

async function buscarPokemon(nomeOuId) {
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeOuId.toLowerCase()}`);
        
        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado!");
        }

        const dados = await resposta.json();
        
        // Aqui tens os dados principais prontos a usar:
        const pokemonInfo = {
            nome: dados.name,
            id: dados.id,
            imagem: dados.sprites.other['official-artwork'].front_default || dados.sprites.front_default,
            tipo: dados.types.map(t => t.type.name).join(', ')
        };

        console.log(pokemonInfo);
        return pokemonInfo;

    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        alert("Pokémon não encontrado. Tenta outro nome ou ID!");
    }
}

let listaCompletaPokemons = [];

// Função chamada quando clicas no botão da Pokédex
async function carregarPokedexCompleta() {
    const grid = document.getElementById('grid-pokemons');
    
    // Se já temos os pokémons guardados, basta desenhá-los e sair
    if (listaCompletaPokemons.length > 0) {
        exibirPokemons(listaCompletaPokemons);
        return;
    }

    grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>A carregar todos os Pokémon...</p>";

    try {
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
        const dados = await resposta.json();
        
        listaCompletaPokemons = dados.results;
        exibirPokemons(listaCompletaPokemons);

    } catch (erro) {
        console.error("Erro ao carregar pokémons:", erro);
        grid.innerHTML = "<p style='text-align:center; color:red; grid-column: 1/-1;'>Erro ao carregar a Pokédex.</p>";
    }
}

// Função para desenhar os cards na tela (otimizada para abrir instantaneamente)
async function exibirPokemons(pokemons) {
    const grid = document.getElementById('grid-pokemons');
    grid.innerHTML = "";

    if (pokemons.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Nenhum Pokémon encontrado.</p>";
        return;
    }

    // Mostra os primeiros 150 para não travar o navegador
    const pokemonsParaMostrar = pokemons.slice(0, 150);

    for (const p of pokemonsParaMostrar) {
        const idMatch = p.url.match(/\/(\d+)\/$/);
        const id = idMatch ? idMatch[1] : 0;
        
        // Vamos buscar os detalhes (incluindo os tipos) de cada Pokémon individualmente
        let tiposHtml = '';
        try {
            const respostaDetalhes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const dadosPokemon = await respostaDetalhes.json();
            
            // Cria os badges de tipo com base nos dados reais da API
            tiposHtml = dadosPokemon.types.map(t => `<span class="tipo ${t.type.name}">${t.type.name}</span>`).join('');
        } catch (erro) {
            console.error("Erro ao carregar tipos do Pokémon ID:", id);
        }

        const imagemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <span>#${id}</span>
            <img src="${imagemUrl}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <div class="pokemon-types">
                ${tiposHtml}
            </div>
        `;
        grid.appendChild(card);
    }

    if (pokemons.length > 150) {
        const aviso = document.createElement('p');
        aviso.style.cssText = "text-align:center; grid-column: 1/-1; color: #666; padding: 20px;";
        aviso.innerText = `A mostrar 150 de ${pokemons.length} Pokémon. Usa a barra de pesquisa acima para encontrar os restantes!`;
        grid.appendChild(aviso);
    }
}

// Função de pesquisa em tempo real
function filtrarPokemons() {
    const termo = document.getElementById('input-pesquisa').value.toLowerCase();
    
    const filtrados = listaCompletaPokemons.filter(p => 
        p.name.toLowerCase().includes(termo) || p.url.match(/\/(\d+)\/$/)[1] === termo
    );

    exibirPokemons(filtrados);
}

// Array com todos os teus anúncios disponíveis (coloca aqui os caminhos corretos das imagens)
const listaAnuncios = [
    "imagens/Anuncios/dito2.png", //
    "imagens/Anuncios/psiduck.png", //
    "imagens/Anuncios/borboleta.png", //
    "imagens/Anuncios/dito.png", // 
    "imagens/Anuncios/magicarp.png", // 
    "imagens/Anuncios/meau.png", //
    "imagens/Anuncios/onix.png", //
    "imagens/Anuncios/veterinaria.png", //
];

// Função para sortear e aplicar novos anúncios em ambas as laterais
function mudarAnunciosAleatorios() {
    const imgEsq = document.getElementById('img-anuncio-esq');
    const imgDir = document.getElementById('img-anuncio-dir');

    if (!imgEsq || !imgDir) return;

    // Escolhe índices aleatórios diferentes para a esquerda e para a direita
    let indexEsq = Math.floor(Math.random() * listaAnuncios.length);
    let indexDir = Math.floor(Math.random() * listaAnuncios.length);

    // Garante que o anúncio da esquerda não seja igual ao da direita (opcional, mas fica mais fixe)
    if (listaAnuncios.length > 1) {
        while (indexDir === indexEsq) {
            indexDir = Math.floor(Math.random() * listaAnuncios.length);
        }
    }

    // Aplica as novas imagens
    imgEsq.src = listaAnuncios[indexEsq];
    imgDir.src = listaAnuncios[indexDir];
}

// Configura o temporizador para mudar sozinhos de 10 em 10 minutos
// 10 minutos = 10 * 60 * 1000 milissegundos = 600000 ms
setInterval(mudarAnunciosAleatorios, 10 * 60 * 1000);

// Variável para guardar o nome correto do Pokémon atual do mini-game
let pokemonCorretoGame = "";
let dadosPokemonAtual = null;
let dadosEspecieAtual = null;

async function iniciarNovoJogo() {
    const imgElement = document.getElementById('game-img');
    const inputElement = document.getElementById('game-input');
    const mensagemElement = document.getElementById('game-mensagem');
    const dicaElement = document.getElementById('game-dica');
    const btnProximo = document.getElementById('btn-proximo-game');
    const controles = document.getElementById('game-controles');

    // Reseta tudo para a nova ronda
    inputElement.value = "";
    mensagemElement.textContent = "A carregar...";
    mensagemElement.style.color = "#333";
    dicaElement.textContent = "Clica num botão acima se precisares de uma dica!";
    btnProximo.style.display = "none";
    controles.style.display = "flex";
    
    imgElement.classList.remove('pokemon-revelado');
    imgElement.src = ""; 

    try {
        const idAleatorio = Math.floor(Math.random() * 150) + 1;
        
        const respostaPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
        dadosPokemonAtual = await respostaPokemon.json();

        const respostaEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idAleatorio}`);
        dadosEspecieAtual = await respostaEspecie.json();

        pokemonCorretoGame = dadosPokemonAtual.name.toLowerCase();

        imgElement.src = dadosPokemonAtual.sprites.other['official-artwork'].front_default || dadosPokemonAtual.sprites.front_default;
        mensagemElement.textContent = "";
    } catch (erro) {
        console.error("Erro ao carregar o Pokémon:", erro);
        mensagemElement.textContent = "Erro ao carregar. Tenta novamente!";
    }
}

// Função que revela cada dica individualmente quando o jogador clica
function revelarDica(tipoDica) {
    const dicaElement = document.getElementById('game-dica');
    if (!pokemonCorretoGame) return;

    if (tipoDica === 'tipo') {
        const tipos = dadosPokemonAtual.types.map(t => t.type.name.toUpperCase()).join(' / ');
        dicaElement.textContent = `💡 Tipo(s): [${tipos}]`;
        dicaElement.style.color = "#d97706";
    } 
    else if (tipoDica === 'letras') {
        const primeira = pokemonCorretoGame.charAt(0).toUpperCase();
        const ultima = pokemonCorretoGame.charAt(pokemonCorretoGame.length - 1).toUpperCase();
        dicaElement.textContent = `💡 Começa com: ${primeira} | Termina com: ${ultima} (Tem ${pokemonCorretoGame.length} letras)`;
        dicaElement.style.color = "#2563eb";
    } 
    else if (tipoDica === 'evolucao') {
        let evolucaoTexto = "É um Pokémon de Forma Base (não evolui de ninguém)";
        if (dadosEspecieAtual.evolves_from_species) {
            evolucaoTexto = "É um Pokémon Evoluído";
        }
        dicaElement.textContent = `💡 Evolução: ${evolucaoTexto}`;
        dicaElement.style.color = "#7c3aed";
    }
}

function verificarRespostaGame() {
    const inputElement = document.getElementById('game-input');
    const mensagemElement = document.getElementById('game-mensagem');
    const imgElement = document.getElementById('game-img');
    const btnProximo = document.getElementById('btn-proximo-game');
    const controles = document.getElementById('game-controles');

    const palpite = inputElement.value.trim().toLowerCase();
    if (!palpite) return;

    if (palpite === pokemonCorretoGame) {
        // ACERTOU
        mensagemElement.textContent = `Boa! Era o ${pokemonCorretoGame.toUpperCase()}!`;
        mensagemElement.style.color = "#2e7d32";
        
        // Revela a cor original do Pokémon
        imgElement.classList.add('pokemon-revelado');
        
        // Esconde os controlos e mostra o botão de próximo
        controles.style.display = "none";
        btnProximo.style.display = "block";
    } else {
        // ERROU
        mensagemElement.textContent = "Errado! Tenta outra vez.";
        mensagemElement.style.color = "#c62828";
        inputElement.focus();
        inputElement.select();
    }
}