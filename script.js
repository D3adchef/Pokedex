const typeColors = {
  normal:    "#A8A77A",
  fire:      "#EE8130",
  water:     "#6390F0",
  electric:  "#F7D02C",
  grass:     "#7AC74C",
  ice:       "#96D9D6",
  fighting:  "#C22E28",
  poison:    "#A33EA1",
  ground:    "#E2BF65",
  flying:    "#A98FF3",
  psychic:   "#F95587",
  bug:       "#A6B91A",
  rock:      "#B6A136",
  ghost:     "#735797",
  dragon:    "#6F35FC",
  dark:      "#705746",
  steel:     "#B7B7CE",
  fairy:     "#D685AD"
};

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const pokemonInput = document.getElementById("pokemonInput");
  const finderGrid = document.getElementById("finderGrid");

  const randomBtn = document.getElementById("randomBtn");
  const randomGrid = document.getElementById("randomGrid");
  let randomInterval = null;
  let totalPokemon = 1025;

  // Get actual total count
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1")
    .then(res => res.json())
    .then(data => totalPokemon = data.count);

  searchBtn.addEventListener("click", async () => {
    const query = pokemonInput.value.trim().toLowerCase();
    if (!query) return;
    const card = await makeCard(query);
    if (card) {
      finderGrid.innerHTML = ""; // Show only one card
      finderGrid.appendChild(card);
    }
  });

  randomBtn.addEventListener("click", () => {
    if (randomInterval) {
      clearInterval(randomInterval);
      randomInterval = null;
      randomBtn.textContent = "Start Generator";
    } else {
      addRandomCard();
      randomInterval = setInterval(addRandomCard, 5000);
      randomBtn.textContent = "Stop Generator";
    }
  });

  async function addRandomCard() {
    const randomId = Math.floor(Math.random() * totalPokemon) + 1;
    const card = await makeCard(randomId);
    if (card) {
      randomGrid.innerHTML = ""; // Show only one card
      randomGrid.appendChild(card);
    }
  }

  async function makeCard(query) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      const image = data.sprites.front_default;
      const types = data.types.map(t => t.type.name);
      const abilities = data.abilities.map(a => a.ability.name).join(", ");
      const stats = {};
      data.stats.forEach(statObj => {
        stats[statObj.stat.name] = statObj.base_stat;
      });
      const card = document.createElement("div");
      card.className = "pokedex-card";

      // Get primary type for color
      const mainType = types[0];
      const bgColor = typeColors[mainType] || "#fff";
      card.style.background = bgColor;
      card.style.color = (["dark", "rock", "ghost", "steel", "dragon"].includes(mainType)) ? "#fff" : "#222";

      card.innerHTML = `
        <div class="poke-num">#${data.id}</div>
        <img class="poke-img" src="${image}" alt="${name}">
        <div class="poke-name">${name}</div>
        <div class="poke-type"><strong>Type:</strong> ${types.join(", ")}</div>
        <div class="poke-abilities"><strong>Abilities:</strong> ${abilities}</div>
        <ul class="poke-stats">
          <li><strong>HP:</strong> ${stats.hp}</li>
          <li><strong>Attack:</strong> ${stats.attack}</li>
          <li><strong>Defense:</strong> ${stats.defense}</li>
          <li><strong>Sp. Atk:</strong> ${stats['special-attack']}</li>
          <li><strong>Sp. Def:</strong> ${stats['special-defense']}</li>
          <li><strong>Speed:</strong> ${stats.speed}</li>
        </ul>
      `;
      return card;
    } catch {
      alert("Pokémon not found. Try another name or ID.");
      return null;
    }
  }
});
