'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';

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

  const handleSearch = async (query: string, filters: string[], priceRange: [number, number], minRating: number) => {
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
        // Apply client-side filtering for price and rating as per original app
        const filtered = data.matches.filter((p: any) => {
          const price = p.price || 0;
          const rating = p.rating || 0;
          return price >= priceRange[0] && price <= priceRange[1] && rating >= minRating;
        });
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Search failed', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar onSearch={handleSearch} isLoading={loading} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {hasSearched && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#5c3b31] mb-4">
              🔎 Results for <span className="italic">"{currentQuery}"</span>
            </h2>
            
            {products.length === 0 ? (
              <div className="p-8 bg-blue-50 text-blue-800 rounded-lg">
                No products found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {conversation.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#5c3b31] mb-4">🗣️ Your conversation so far:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {conversation.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasSearched && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
            <h2 className="text-3xl font-bold text-[#c2185b] mb-4">Welcome to Rare Beauty Recommender</h2>
            <p className="max-w-md">Use the sidebar to search for products or try one of our pre-loaded makeup looks.</p>
          </div>
        )}
      </main>
    </div>
  );
}
