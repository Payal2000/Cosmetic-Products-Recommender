'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  onSearch: (query: string, filters: string[], priceRange: [number, number], minRating: number) => void;
  isLoading: boolean;
}

export default function Sidebar({ onSearch, isLoading }: SidebarProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [minRating, setMinRating] = useState(3.0);

  const categories = ['face', 'lips', 'eyes', 'tools', 'body'];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    onSearch(query, selectedCategories, priceRange, minRating);
  };

  const handlePreload = (text: string) => {
    setQuery(text);
    // Optional: Auto-search when clicking a preset
  };

  return (
    <div className="w-full md:w-80 p-6 bg-white border-r border-gray-100 flex-shrink-0 min-h-screen">
       <div className="mb-6">
        <img
          src="https://theindustry.beauty/wp-content/uploads/2024/09/RAREB.jpg"
          alt="Rare Beauty"
          className="w-48 mb-4 rounded-md"
        />
        <h2 className="text-xl font-bold text-[#5c3b31]">🪞 Recommender</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#5c3b31] mb-2">What are you looking for?</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c2185b] focus:border-transparent outline-none transition-all"
          rows={4}
          placeholder="Describe the look or product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#5c3b31] mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedCategories.includes(cat)
                  ? 'bg-[#c2185b] text-white border-[#c2185b]'
                  : 'bg-white text-[#5c3b31] border-gray-300 hover:border-[#c2185b]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#5c3b31] mb-2">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c2185b]"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#5c3b31] mb-2">
          Min Rating: {minRating}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c2185b]"
        />
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-[#5c3b31] mb-2">💄 Try a pre-loaded look:</p>
        <div className="space-y-2">
          <button onClick={() => handlePreload("products for a summer dewy glow with Rare Beauty")} className="block w-full text-left text-xs p-2 rounded hover:bg-rose-50 text-[#c2185b] transition-colors">
            Summer Dewy Glow
          </button>
          <button onClick={() => handlePreload("lightweight natural makeup for office from Rare Beauty")} className="block w-full text-left text-xs p-2 rounded hover:bg-rose-50 text-[#c2185b] transition-colors">
            Natural Office Look
          </button>
          <button onClick={() => handlePreload("evening glam look with Rare Beauty products")} className="block w-full text-left text-xs p-2 rounded hover:bg-rose-50 text-[#c2185b] transition-colors">
            Evening Glam Look
          </button>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="w-full bg-[#c2185b] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#a0134a] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      <div className="mt-8 text-center">
        <Link href="/try-on">
          <button className="w-full bg-white text-[#c2185b] border-2 border-[#c2185b] py-3 rounded-lg font-semibold shadow-sm hover:bg-rose-50 transition-all">
            💄 Try It On Yourself
          </button>
        </Link>
      </div>
    </div>
  );
}
