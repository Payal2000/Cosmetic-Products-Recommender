'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  CircleDot,
  Eye,
  Droplets,
  Scissors,
  Flower2,
  Sun,
  Briefcase,
  Moon,
  Camera,
} from 'lucide-react';

interface SidebarProps {
  onSearch: (query: string, filters: string[], priceRange: [number, number]) => void;
  isLoading: boolean;
}

export default function Sidebar({ onSearch, isLoading }: SidebarProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const categories = [
    { id: 'face', label: 'Face', icon: CircleDot },
    { id: 'lips', label: 'Lips', icon: Droplets },
    { id: 'eyes', label: 'Eyes', icon: Eye },
    { id: 'tools', label: 'Tools', icon: Scissors },
    { id: 'body', label: 'Body', icon: Flower2 },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    onSearch(query, selectedCategories, priceRange);
  };

  const handlePreload = (text: string) => {
    setQuery(text);
  };

  return (
    <aside className="w-full md:w-[380px] bg-white border-r border-cream-200 flex flex-col md:h-screen flex-shrink-0">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex-shrink-0 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-blush-400 transition-transform duration-500 hover:rotate-12" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold tracking-tight text-warm-900">
            RARE.
          </h1>
        </div>
        <p className="text-[11px] text-olive-400 tracking-[0.2em] uppercase font-medium mt-1 pl-[30px]">
          Beauty Recommender
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-6">
        {/* Search */}
        <div className="border-t border-cream-200 pt-6 mb-6">
          <label className="flex items-center gap-2 text-[11px] font-medium text-olive-400 tracking-[0.15em] uppercase mb-3">
            <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
            Describe your look
          </label>
          <textarea
            className="w-full p-4 bg-cream-50 border border-cream-300 rounded-xl text-sm text-warm-800 placeholder:text-olive-300 focus:ring-1 focus:ring-blush-400 focus:border-blush-400 outline-none resize-none leading-relaxed focus-glow transition-all duration-300"
            rows={3}
            placeholder="A natural, dewy finish for everyday wear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="border-t border-cream-200 pt-6 mb-6">
          <label className="flex items-center gap-2 text-[11px] font-medium text-olive-400 tracking-[0.15em] uppercase mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-blush-400 text-white border-blush-400 shadow-sm shadow-blush-400/20'
                      : 'bg-white text-warm-600 border-cream-300 hover:border-blush-300 hover:text-warm-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} strokeWidth={1.5} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Rating */}
        <div className="border-t border-cream-200 pt-6 mb-6 space-y-5">
          <div>
            <label className="flex items-center justify-between text-[11px] font-medium text-olive-400 tracking-[0.15em] uppercase mb-3">
              <span>Price Range</span>
              <span className="text-warm-700 tracking-normal font-semibold">
                Up to ${priceRange[1]}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Curated Looks */}
        <div className="border-t border-cream-200 pt-6">
          <label className="text-[11px] font-medium text-olive-400 tracking-[0.15em] uppercase mb-3 block">
            Curated Looks
          </label>
          <div className="space-y-0.5">
            <button
              onClick={() => handlePreload('products for a summer dewy glow with Rare Beauty')}
              className="flex items-center gap-3 w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-cream-100 text-warm-700 hover:text-warm-900 transition-all duration-200 active:scale-[0.98] group"
            >
              <Sun className="w-4 h-4 text-olive-300 group-hover:text-blush-400 group-hover:rotate-45 transition-all duration-300" strokeWidth={1.5} />
              <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-200">Summer Dewy Glow</span>
            </button>
            <button
              onClick={() => handlePreload('lightweight natural makeup for office from Rare Beauty')}
              className="flex items-center gap-3 w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-cream-100 text-warm-700 hover:text-warm-900 transition-all duration-200 active:scale-[0.98] group"
            >
              <Briefcase className="w-4 h-4 text-olive-300 group-hover:text-blush-400 transition-all duration-300" strokeWidth={1.5} />
              <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-200">Natural Office Look</span>
            </button>
            <button
              onClick={() => handlePreload('evening glam look with Rare Beauty products')}
              className="flex items-center gap-3 w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-cream-100 text-warm-700 hover:text-warm-900 transition-all duration-200 active:scale-[0.98] group"
            >
              <Moon className="w-4 h-4 text-olive-300 group-hover:text-blush-400 transition-all duration-300" strokeWidth={1.5} />
              <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-200">Evening Glam Look</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="px-8 pb-8 pt-5 space-y-3 border-t border-cream-200 flex-shrink-0 bg-white">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-blush-400 text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-blush-500 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:shadow-md hover:shadow-blush-400/20"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" strokeWidth={1.5} />
          )}
          {isLoading ? 'Searching' : 'Explore Products'}
        </button>

        <Link href="/try-on" className="block">
          <button className="w-full bg-transparent text-warm-700 border border-cream-300 py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-blush-400 hover:text-white hover:border-blush-400 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5">
            <Camera className="w-4 h-4" strokeWidth={1.5} />
            Virtual Try-On
          </button>
        </Link>
      </div>
    </aside>
  );
}
