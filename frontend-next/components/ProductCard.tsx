'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  let imageUrl = product.image_url;
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }

  return (
    <div className="group">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100 rounded-xl mb-4">
        <Image
          src={imageUrl}
          alt={product.product_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay with rating */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-warm-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-white text-white" strokeWidth={1.5} />
            <span className="text-xs font-medium text-white">
              {product.rating}
            </span>
            <span className="text-xs text-white/60">
              ({product.review_count})
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-start gap-3">
          <h3
            className="text-sm font-medium text-warm-900 leading-snug line-clamp-2 group-hover:text-blush-500 transition-colors duration-300"
            title={product.product_name}
          >
            {product.product_name}
          </h3>
          <p className="text-sm font-medium text-warm-900 whitespace-nowrap">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <p className="text-[11px] text-olive-400 capitalize tracking-wide">
          {product.category}
          {product.variant_title_product && (
            <>
              <span className="mx-1.5 text-cream-300">/</span>
              {product.variant_title_product}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
