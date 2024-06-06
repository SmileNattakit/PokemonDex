import axios from 'axios';
import { useState, useEffect } from 'react';

const typeColors = {
  grass: 'bg-green-500',
  fire: 'bg-red-500',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-500',
  normal: 'bg-gray-400',
  fighting: 'bg-orange-500',
  flying: 'bg-sky-400',
  poison: 'bg-purple-400 text-white',
  ground: 'bg-amber-500',
  rock: 'bg-stone-500',
  bug: 'bg-lime-500',
  ghost: 'bg-indigo-700 text-white',
  psychic: 'bg-pink-500',
  ice: 'bg-cyan-500',
  dragon: 'bg-fuchsia-500',
  dark: 'bg-neutral-500',
  steel: 'bg-slate-500',
  fairy: 'bg-rose-500',
};

const PokemonComponent = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=151'
        );
        const pokemonUrls = response.data.results.map((pokemon) => pokemon.url);
        const pokemonResponses = await axios.all(
          pokemonUrls.map((url) => axios.get(url))
        );
        const pokemonData = pokemonResponses.map((response) => response.data);
        setPokemonList(pokemonData);
      } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
      }
    };

    fetchPokemonData();
  }, []);

  return (
    <ul className="grid grid-cols-6">
      {pokemonList.map((pokemon, index) => (
        <li key={pokemon.name} className="m-4">
          <div className="card card-compact w-50 bg-base-100 shadow-xl">
            <p className="text-xl font-semibold px-4">
              #{(index + 1).toString().padStart(3, '0')}
            </p>
            <figure>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{pokemon.name}</h2>
              <div>
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`badge ${
                      typeColors[type.type.name] || 'bg-gray-500'
                    }`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PokemonComponent;
