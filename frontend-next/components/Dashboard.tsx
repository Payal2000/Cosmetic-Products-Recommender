'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import { Sparkles, Clock } from 'lucide-react';

interface Product {
  id: string;
  product_name: string;
  price: number;
  category: string;
  rating: number;
  review_count: number;
  description: string;
  variant_title_product: string;
  image_url: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [conversation, setConversation] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (
    query: string,
    filters: string[],
    priceRange: [number, number],
    minRating: number
  ) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setCurrentQuery(query);
    setConversation(prev => [...prev, query]);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters }),
      });

      const data = await response.json();

      if (data.matches) {
        const filtered = data.matches.filter((p: Product) => {
          const price = p.price || 0;
          const rating = p.rating || 0;
          return price >= priceRange[0] && price <= priceRange[1] && rating >= minRating;
        });
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50/40">
      <Sidebar onSearch={handleSearch} isLoading={loading} />

      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto h-screen scrollbar-hide">
        {hasSearched ? (
          <div className="animate-fade-in-up">
            {/* Results Header */}
            <header className="mb-10 pb-6 border-b border-stone-200/60">
              <p className="text-stone-400 uppercase tracking-[0.2em] text-[11px] font-medium mb-2">
                Search Results
              </p>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
                  &ldquo;{currentQuery}&rdquo;
                </h2>
                <span className="text-stone-400 text-sm whitespace-nowrap">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
              </div>
            </header>

            {/* Results Grid */}
            {products.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
                </div>
                <p className="text-stone-500 text-sm">
                  No matches found. Try refining your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {conversation.length > 0 && (
              <div className="mt-20 pt-8 border-t border-stone-200/60">
                <h3 className="text-[11px] font-medium text-stone-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {conversation.map((q, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-white rounded-full text-stone-500 text-xs border border-stone-200/60"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Welcome State */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-fade-in">
            <div className="w-12 h-[1px] bg-stone-300 mb-10" />
            <h1 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-4 tracking-tight leading-tight">
              Discover Your
              <br />
              Perfect Ritual
            </h1>
            <p className="text-stone-400 leading-relaxed text-[15px] max-w-sm">
              AI-powered recommendations to find the perfect shade,
              texture, and finish for your unique style.
            </p>
            <div className="w-12 h-[1px] bg-stone-300 mt-10" />
          </div>
        )}
      </main>
    </div>
  );
}
