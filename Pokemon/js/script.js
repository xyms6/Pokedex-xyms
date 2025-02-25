document.getElementById('pesquisar').addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    const suggestionContainer = document.getElementById('sugestao');
    suggestionContainer.innerHTML = ''; // Limpar sugestões anteriores

    if (query.length > 1) {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
            .then(response => response.json())
            .then(data => {
                const filteredPokemons = data.results.filter(pokemon => pokemon.name.includes(query));

                if (filteredPokemons.length > 0) {
                    filteredPokemons.forEach(pokemon => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.textContent = pokemon.name;
                        suggestionItem.addEventListener('click', function() {
                            displayPokemonInfo(pokemon.name);
                            suggestionContainer.style.display = 'none'; // Esconde a lista de sugestões
                        });
                        suggestionContainer.appendChild(suggestionItem);
                    });
                    suggestionContainer.style.display = 'block'; // Mostra as sugestões
                } else {
                    suggestionContainer.style.display = 'none'; // Nenhuma sugestão encontrada
                }
            })
            .catch(error => console.error('Erro ao buscar sugestões:', error));
    } else {
        suggestionContainer.style.display = 'none'; // Se nao estiver nada digitado
    }
});

function displayPokemonInfo(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const pokemonNameFormatted = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const pokemonTypes = data.types.map(type => type.type.name).join(', ');
            const pokemonImage = data.sprites.other['official-artwork'].front_default;
            const pokemonHeight = (data.height / 10).toFixed(1); // Conversor para metros
            const pokemonWeight = (data.weight / 10).toFixed(1); // Conversor para Kilos
            const pokemonAbilities = data.abilities.map(ability => ability.ability.name).join(', ');

            document.getElementById('pokemon-nome').innerText = pokemonNameFormatted;
            document.getElementById('pokemon-imagem').src = pokemonImage;
            document.getElementById('pokemon-tipo').innerHTML = pokemonTypes.split(', ').map(type => `<span>${type}</span>`).join('');
            document.getElementById('pokemon-descricao').innerHTML = `
                <p><strong>Altura:</strong> ${pokemonHeight}m</p>
                <p><strong>Peso:</strong> ${pokemonWeight}kg</p>
                <p><strong>Habilidades:</strong> ${pokemonAbilities}</p>
            `;

            document.getElementById('pokemon-info').style.display = 'block';
        })
        .catch(error => {
            document.getElementById('pokemon-info').style.display = 'none';
            alert('Pokémon não encontrado!');
        });
}
