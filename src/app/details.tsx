import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Common reusable type for PokeAPI resources (name + url)
export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonCries {
  latest: string;
  legacy: string;
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface PokemonHeldItemVersion {
  rarity: number;
  version: NamedAPIResource;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersion[];
}

export interface PokemonMoveVersion {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  order: number | null; // Note: This can be null in the API response
  version_group: NamedAPIResource;
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
}

// Main Model
export interface Pokemon {
  id: number;
  is_default: boolean;
  base_experience: number;
  height: number;
  location_area_encounters: string;
  cries: PokemonCries;
  forms: NamedAPIResource[];
  abilities: PokemonAbility[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  moves: PokemonMove[];
  
  // Note: The JSON cut off here, but PokeAPI usually also returns:
  weight?: number;
  sprites?: Record<string, any>;
  stats?: any[];
  types?: any[];
}



export default function Details() {

    // const params = useLocalSearchParams();
    const { name } = useLocalSearchParams<{ name: string }>();

    console.log("The name of the pokemon is " + name);

    const [pokemonDetail, setPokemonDetail] = useState<Pokemon>();

    useEffect(() => {
        if (name) {
            // Ensure name is passed as a single string
             const pokemonName = Array.isArray(name) ? name[0] : name;
            fetchPokemonData(pokemonName);
        }
    }, [name]);

    

    async function fetchPokemonData(name: string) {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
            const data = await response.json();

            console.log(data)
            setPokemonDetail(data)

        } catch (e) {
            console.log(e);
        }4
    }

    console.log(name);

    return (
        <ScrollView
            contentContainerStyle = {{
                gap: 16,
                padding: 16
            }}
        >
            <View>
                <Text>{pokemonDetail?.abilities[0].ability.name}</Text>
            </View>
        </ScrollView>
    );

    
}


const styles = StyleSheet.create({});