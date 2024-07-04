import axios from 'axios';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
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
  const { register, handleSubmit } = useForm();
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

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

  useEffect(() => {
    if (pokemonList && pokemonList.length > 0) {
      onSubmit({ search: '' });
    }
  }, [pokemonList]);

  const onSubmit = (data) => {
    let filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(data.search.toLowerCase())
    );

    filtered = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    setFilteredPokemonList(filtered);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    onSubmit({ search: '' });
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-xl font-semibold text-gray-700">กำลังโหลดข้อมูล Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center text-red-600">
          <p className="text-2xl font-bold">เกิดข้อผิดพลาด</p>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const PokemonCard = ({ pokemon }) => (
    <li key={pokemon.name} className="m-4">
      <div className="card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <span className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-full text-sm">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-full h-48 object-contain bg-gray-100"
          />
        </div>
        <div className="card-body">
          <h2 className="card-title text-lg capitalize">{pokemon.name}</h2>
          <div className="flex flex-wrap gap-1 mt-2">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`badge ${
                  typeColors[type.type.name] || 'bg-gray-500'
                } text-xs px-2 py-1`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-auto mb-4 sm:mb-0">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="ค้นหา Pokemon"
              {...register('search')}
            />
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
        </form>
        <button
          onClick={toggleSortOrder}
          className="btn btn-outline btn-primary"
        >
          เรียงตามหมายเลข {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {filteredPokemonList.length > 0 ? (
        <div>
          <p className="text-lg mb-4">พบ {filteredPokemonList.length} รายการ</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredPokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center mt-16">
          <p className="text-2xl font-semibold text-gray-600">ไม่พบข้อมูล Pokemon ที่ตรงกัน</p>
          <p className="mt-2 text-gray-500">ลองค้นหาด้วยชื่ออื่น หรือตรวจสอบการสะกดอีกครั้ง</p>
        </div>
      )}
    </div>
  );
};

export default PokemonComponent;