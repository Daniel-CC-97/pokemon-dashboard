import PokemonAPI from "./api/pokemonApi";
import { PokemonListItem } from "./api/pokemonApi";

export default class PokemonDashboard {
  private pokemonList: PokemonListItem[] = [];
  private currentPage: number = 0;
  private totalPages: number = 0;
  private rootElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.rootElement = container;
    this.render();
  }

  // Fetch Pokemon list and render them in the UI
  private async fetchAndRenderPokemon() {
    try {
      // Fetch the first 20 Pokémon
      const data = await PokemonAPI.fetchPokemonList(20, this.currentPage * 20);
      console.log("Fetched data: ", data);

      // Create an array of promises to fetch the detailed information for each Pokémon
      const pokemonDetailsPromises = data.results.map((pokemon) =>
        fetch(pokemon.url)
          .then((response) => response.json())
          .then((pokemonDetails) => ({
            ...pokemon,
            details: pokemonDetails, // Add details to the current pokemon object
          }))
      );

      // Wait for all Pokémon details to be fetched
      const detailedPokemonList = await Promise.all(pokemonDetailsPromises);

      // Update the pokemonList with detailed data
      this.pokemonList = detailedPokemonList;

      this.totalPages = Math.ceil(data.count / 20);

      // Render the Pokémon list in cards
      this.renderPokemonList();
      console.log("Detailed Pokémon list: ", this.pokemonList);
    } catch (error) {
      console.error("Error fetching and rendering Pokémon: ", error);
    }
  }

  // Render the pokemon in a list of cards
  private renderPokemonList() {
    // Create the cards
    const pokemonCardsHTML = this.pokemonList
      .map((pokemon) => {
        return `
      <li class="pokemon-card">
        <img class="pokemon-image" src=${pokemon.details.sprites.other["official-artwork"].front_default}></img>
        <h3>${pokemon.name}</h3>
      </li>
      `;
      })
      .join("");

    // Set the inner HTML to the cards + pagination
    this.rootElement.innerHTML = `
      <ul class="pokemon-list">
        ${pokemonCardsHTML}
      </ul>
      <div class="pagination">
        <button id="prev-button" ${
          this.currentPage === 0 ? "disabled" : ""
        }>Previous</button>
        <button id="next-button" ${
          this.currentPage === this.totalPages - 1 ? "disabled" : ""
        }>Next</button>
      </div>
    `;
    this.afterRender();
  }

  // Add event listeners for Next/Previous buttons
  private afterRender() {
    const prevButton = this.rootElement.querySelector("#prev-button");
    const nextButton = this.rootElement.querySelector("#next-button");

    prevButton?.addEventListener("click", () => this.changePage(-1));
    nextButton?.addEventListener("click", () => this.changePage(1));
  }

  // Change page based on button click
  private changePage(direction: number) {
    this.currentPage += direction;
    this.fetchAndRenderPokemon();
  }

  // Initialise the component
  public render() {
    this.fetchAndRenderPokemon();
  }
}
