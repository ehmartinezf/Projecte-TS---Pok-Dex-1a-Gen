// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits

import * as Models from "./models.js";
import * as Utils from "./utils.js"
import {BasePokemon, IPokeApiListResponse} from "./models.js";
const mapaPokemon = new Map<number, Models.BasePokemon>();

const btnCarregarPokemon = document.getElementById("btn-show-all") as HTMLButtonElement;
const input= document.getElementById("search-input") as HTMLInputElement;

btnCarregarPokemon.addEventListener("click", carregarLlistaPokemon);

async function carregarLlistaPokemon(): Promise<void> {
    input.value = "";
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
        pokemon.name.toLowerCase().includes(text) || String(pokemon.id) === text
    );

    Utils.renderitzarLlistaNoms(resultats);
}
input.addEventListener("input", cercadorPokemon)

// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits

const cachePokemon = new Map<number, Models.DetailedPokemon>();


// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits



// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits