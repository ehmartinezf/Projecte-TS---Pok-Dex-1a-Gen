// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits

import * as Models from "./models.js";
import * as Utils from "./utils.js"
import {BasePokemon, DetailedPokemon, IPokeApiListResponse} from "./models.js";
import {marcarItemActiu, renderitzarLlistaNoms} from "./utils.js";

const mapaPokemon = new Map<number, Models.BasePokemon>();
const pokemonFiltrats = new Map<number, Models.BasePokemon>();
let tipusActiu: string | null = null;

const btnCarregarPokemon = document.getElementById("btn-show-all") as HTMLButtonElement;
const input = document.getElementById("search-input") as HTMLInputElement;

btnCarregarPokemon.addEventListener("click", carregarLlistaPokemon);

async function carregarLlistaPokemon(): Promise<void> {
    Utils.netejarCercador();
    Utils.mostrarEstat("Carregant llista pokemon...", "loading");
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!resposta.ok) {
            throw new Error("Error en carragar la llista Pokémon");
        }
        const dades = await resposta.json() as Models.IPokeApiListResponse;
        pokemonFiltrats.clear();
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

    const mapaDades = botoActiu ? pokemonFiltrats : mapaPokemon;

    const resultats = Array.from(mapaDades.values()).filter(pokemon =>
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

llistaPokemon.addEventListener("click", (event) => {
    const element = event.target as HTMLElement;
    const item = element.closest("li");

    if (!item || !llistaPokemon.contains(item) || item.classList.contains("placeholder")) {
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
    if (pokemonGuardat) {
        pokemon = pokemonGuardat;
    } else {
        Utils.mostrarEstat("Carregant pokemon...", "loading")
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) {
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
    if (pokemon) {
        Utils.renderitzarDetallCard(pokemon)
    }
}


// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
Utils.generarBotonsTipus();


// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================

let botoActiu = false;
let ultimBoto: HTMLButtonElement;
const contenidor = document.getElementById("type-filter-container") as HTMLDivElement;
contenidor.addEventListener("click", (event) => {
    let botoPremut = event.target as HTMLButtonElement;
    let tipus;

    if (!botoActiu) {
        botoPremut.classList.add("active");
        ultimBoto = botoPremut;
        botoActiu = true;
        tipus = botoPremut.dataset.type;
    } else {
        if (botoPremut === ultimBoto){
            botoActiu = false;
            botoPremut.classList.remove("active");
        } else {
            ultimBoto.classList.remove("active");
            botoPremut.classList.add("active");
            ultimBoto = botoPremut;
            tipus = botoPremut.dataset.type;
        }
    }

    if (!botoActiu) {
        carregarLlistaPokemon();
    } else {
        if (!tipus) {
            return;
        }
        carregarPokemonPerTipus(tipus);
    }
});

async function carregarPokemonPerTipus(tipus: string) {
    Utils.mostrarEstat("Carregant pokemons per tipus...", "loading");
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/type/" + tipus);
        if (!resposta.ok) {
            throw new Error("Error en carregar els pokemons per tipus.");
        }
        const dades = await resposta.json() as Models.IPokeApiTypeResponse;
        pokemonFiltrats.clear();
        for (const iPokeApiTypeSlot of dades.pokemon) {
            if (new BasePokemon(iPokeApiTypeSlot.pokemon).id <= 151) {
                const pokemon = new BasePokemon(iPokeApiTypeSlot.pokemon);
                pokemonFiltrats.set(pokemon.id, pokemon);
            }
        }
        const llistaPokemonsResultants = Array.from(pokemonFiltrats.values());
        renderitzarLlistaNoms(llistaPokemonsResultants);
        Utils.netejarCercador();
        Utils.netejarDetallCard();
    } catch (error) {
        console.error(error);
        Utils.mostrarEstat("No s'ha pogut carregar els pokemon del tipus" + tipus, "error");

    } finally {
        Utils.amagarEstat();
    }
}