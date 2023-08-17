"use client";

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

interface Character {
  _id: string;
  name: string;
  dateOfBirth: string;
  house: string;
  role: string;
  wand: string;
  // ... other properties
}

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCharacters = useSWR(
    'https://hp-api.onrender.com/api/characters',
    async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  );

  const filteredCharacters = characters.filter((character: Character) => {
    return (
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.house.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    setCharacters(fetchCharacters.data || []);
  }, [fetchCharacters.data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Harry Potter Characters</h1>
      <input
        type="text"
        placeholder="Search characters..."
        value={searchTerm}
        onChange={handleChange}
        className="p-2 border rounded-md shadow-sm mb-4"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCharacters.map((character: Character) => (
          <div
            key={character._id}
            className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
          >
            <Link href={`/characters/${character._id}`} passHref>
                <h2 className="text-lg font-semibold">{character.name}</h2>
                <p>Date of Birth: {character.dateOfBirth}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
