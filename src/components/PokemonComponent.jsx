import { useState, useEffect } from 'react';

const PokemonComponent = () => {
  const [pokemonsList, setPokemonList] = useState([]);
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
      .then((response) => response.json())
      .then((data) => {
        const pokemonPromises = data.results.map((pokemon) => {
          return fetch(pokemon.url).then((res) => res.json());
        });

        Promise.all(pokemonPromises)
          .then((pokemonData) => setPokemonList(pokemonData))
          .catch((error) => console.error('เกิดข้อผิดพลาด:', error));
      })
      .catch((error) => console.error('เกิดข้อผิดพลาด:', error));
  }, []);

  console.log(pokemonsList);
  return (
    <ul className="grid grid-cols-6 ">
      {pokemonsList.map((pokemon) => (
        <li key={pokemon.name} className="m-4">
          <div className="card card-compact w-50 bg-base-100 shadow-xl ">
            <figure>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title"> {pokemon.name}</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PokemonComponent;
