import axios from 'axios';
import { useQuery } from 'react-query';
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
  const {
    isLoading,
    error,
    data: pokemonList,
  } = useQuery(
    'pokemon',
    async () => {
      const response = await axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=151'
      );
      const pokemonUrls = response.data.results.map((pokemon) => pokemon.url);

      const pokemonResponses = await Promise.all(
        pokemonUrls.map((url) => axios.get(url))
      );
      return pokemonResponses.map((response) => response.data);
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  if (error) {
    return <div>เกิดข้อผิดพลาด: {error.message}</div>;
  }

  return (
    <div>
      <label className="input input-bordered flex items-center gap-2 my-5 mx-4 ">
        <input type="text" className="grow " placeholder="Search" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <ul className="grid grid-cols-6">
        {pokemonList.map((pokemon, index) => (
          <li key={pokemon.name} className="m-4">
            <div className="card card-compact w-50 bg-base-100 shadow-xl">
              <p className="text-xl font-semibold px-4">
                #{String(index + 1).padStart(3, '0')}{' '}
                {/* ปรับปรุงการแสดงผลเลข index */}
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
    </div>
  );
};

export default PokemonComponent;
