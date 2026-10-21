// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
import * as Models from "./models.js";
import * as Utils from "./utils.js"
import {BasePokemon} from "./models.js";
const mapaPokemon = new Map<number, Models.BasePokemon>();

const btnCarregarPokemon = document.getElementById("btn-show-all") as HTMLButtonElement;

btnCarregarPokemon.addEventListener("click", carregarLlistaPokemon);

async function carregarLlistaPokemon() {
    Utils.mostrarEstat("Carregant llista pokemon...", "loading");
    const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    if (!resposta.ok){
        Utils.mostrarEstat("Error carregant la llista de pokemons", "error");
    }
    const pokemons: BasePokemon[] = await resposta.json();
}




// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits



// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits



// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits



// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits