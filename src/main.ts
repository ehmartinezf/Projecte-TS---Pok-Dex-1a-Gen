// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits

import * as Models from "./models.js";
import * as Utils from "./utils.js"
import {BasePokemon, DetailedPokemon, IPokeApiListResponse} from "./models.js";
import {marcarItemActiu} from "./utils.js";
const mapaPokemon = new Map<number, Models.BasePokemon>();

const btnCarregarPokemon = document.getElementById("btn-show-all") as HTMLButtonElement;
const input= document.getElementById("search-input") as HTMLInputElement;

btnCarregarPokemon.addEventListener("click", carregarLlistaPokemon);

async function carregarLlistaPokemon(): Promise<void> {
    Utils.netejarCercador();
    Utils.mostrarEstat("Carregant llista pokemon...", "loading");
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!resposta.ok){
            throw new Error("Error en carragar la llista Pokémon");
        }
        const dades = await resposta.json() as Models.IPokeApiListResponse;

        for (const item of dades.results) {
            const pokemon = new BasePokemon(item)
            mapaPokemon.set(pokemon.id, pokemon)
        }

        const llistaPokemon = Array.from(mapaPokemon.values());

        Utils.renderitzarLlistaNoms(llistaPokemon);
        Utils.amagarEstat();

    } catch (error) {
        console.error(error);
        Utils.mostrarEstat("No s'ha pogut carregar la llista Pokémon", "error");
    }
}


// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits

function cercadorPokemon() {
    const text = input.value.trim().toLowerCase();

    const resultats = Array.from(mapaPokemon.values()).filter(pokemon =>
        pokemon.name.toLowerCase().includes(text) || pokemon.id === parseInt(text, 10)
    );

    Utils.renderitzarLlistaNoms(resultats);
}
input.addEventListener("input", cercadorPokemon)

// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits

const cachePokemon = new Map<number, Models.DetailedPokemon>();
const llistaPokemon = document.getElementById("pokemon-list") as HTMLUListElement;
const pokemonDetail = document.getElementById("pokemon-detail") as HTMLDivElement;

llistaPokemon.addEventListener("click", (event) => {
    const element = event.target as HTMLElement;
    const item = element.closest("li");

    if (!item || !llistaPokemon.contains(item) || item.classList.contains("placeholder")){
        return;
    }

    Utils.marcarItemActiu(item);
    const id = Number(item.dataset.id);
    const pokemon = mapaPokemon.get(id);

    if (!pokemon) {
        return;
    }
    carregarDetallPokemon(id, pokemon.url);
});

async function carregarDetallPokemon(id: number, url: string): Promise<void> {
    let pokemon: DetailedPokemon | undefined;
    const pokemonGuardat = cachePokemon.get(id);
    if (pokemonGuardat){
        pokemon = pokemonGuardat;
    } else {
        Utils.mostrarEstat("Carregant pokemon...", "loading")
        try {
            const resposta = await fetch(url);
            if (!resposta.ok){
                throw new Error("Error en carregar els detalls del Pokémon.");
            }
            const dades = await resposta.json() as Models.IPokeApiDetail;
            pokemon = new DetailedPokemon(dades, url);
            cachePokemon.set(id, pokemon);

        } catch (error) {
            console.error(error);
            Utils.mostrarEstat("No s'ha pogut carregar els detalls del Pokémon", "error");

        } finally {
            Utils.amagarEstat();
        }
    }
    if (pokemon){
        Utils.renderitzarDetallCard(pokemon)
    }
}


// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits



// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits