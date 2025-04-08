const app = document.getElementById("app");

async function fetchPokemonList() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    const data = await res.json();
    console.log("Fetched Pokémon:", data.results);

    app.innerHTML = `
      <h1>Pokémon List</h1>
      <ul>
        ${data.results.map((p: any) => `<li>${p.name}</li>`).join("")}
      </ul>
    `;
  } catch (error) {
    console.error("Failed to fetch Pokémon:", error);
    app.innerHTML = `<p>Something went wrong.</p>`;
  }
}

fetchPokemonList();
