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
    <div className="flex flex-col md:flex-row min-h-screen bg-cream-50">
      <Sidebar onSearch={handleSearch} isLoading={loading} />

      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto min-h-screen md:h-screen scrollbar-hide">
        {hasSearched ? (
          <div>
            {/* Results Header */}
            <header className="mb-10 pb-6 border-b border-cream-200 animate-fade-in-up">
              <p className="text-olive-400 uppercase tracking-[0.2em] text-[11px] font-medium mb-2">
                Search Results
              </p>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-light text-warm-900 tracking-tight">
                  &ldquo;{currentQuery}&rdquo;
                </h2>
                <span className="text-olive-400 text-sm whitespace-nowrap">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
              </div>
              <div className="h-[1px] bg-blush-300/50 mt-6 animate-line-grow" />
            </header>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="aspect-[4/5] rounded-xl animate-shimmer mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded animate-shimmer" />
                      <div className="h-3 w-1/2 rounded animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && products.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-scale-in">
                <div className="w-12 h-12 rounded-full bg-blush-200/50 flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5 text-blush-400" strokeWidth={1.5} />
                </div>
                <p className="text-warm-600 text-sm">
                  No matches found. Try refining your search.
                </p>
              </div>
            ) : !loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {conversation.length > 0 && (
              <div className="mt-20 pt-8 border-t border-cream-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h3 className="text-[11px] font-medium text-olive-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {conversation.map((q, i) => (
                    <span
                      key={i}
                      className="opacity-0 animate-scale-in px-3.5 py-1.5 bg-white rounded-full text-warm-600 text-xs border border-cream-200 hover:border-blush-300 hover:text-warm-800 transition-colors duration-200 cursor-default"
                      style={{ animationDelay: `${400 + i * 50}ms` }}
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
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-12 h-[1px] bg-blush-300 mb-10 animate-line-grow" />
            <h1 className="text-4xl md:text-5xl font-extralight text-warm-900 mb-4 tracking-tight leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Discover Your
              <br />
              Perfect Ritual
            </h1>
            <p className="text-olive-400 leading-relaxed text-[15px] max-w-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              AI-powered recommendations to find the perfect shade,
              texture, and finish for your unique style.
            </p>
            <div className="w-12 h-[1px] bg-blush-300 mt-10 opacity-0 animate-line-grow" style={{ animationDelay: '600ms' }} />
          </div>
        )}
      </main>
    </div>
  );
}
