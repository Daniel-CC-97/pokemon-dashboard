export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

class PokemonAPI {
  private static readonly BASE_URL = "https://pokeapi.co/api/v2";

  public static async fetchPokemonList(
    limit = 20,
    offset = 0
  ): Promise<PokemonListResponse> {
    const res = await fetch(
      `${this.BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    if (!res.ok) {
      throw new Error("Error fetching Pokemon list");
    }
    return await res.json();
  }

  public static async fetchPokemonByName(name: string): Promise<any> {
    const res = await fetch(
      `${this.BASE_URL}/pokemon/${name.toLocaleLowerCase()}`
    );
    if (!res.ok) {
      throw new Error(`Error fetching Pokemon: ${name}`);
    }
    return await res.json();
  }
}

export default PokemonAPI;
