'use client';

import React from 'react';

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
    <div className="bg-[#fdf7f4] border border-[#e0cfc5] rounded-xl p-4 mb-4 shadow-[2px_2px_12px_rgba(174,144,128,0.2)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_16px_rgba(174,144,128,0.3)] w-full">
      <img
        src={imageUrl}
        alt={product.product_name}
        className="rounded-lg mb-2 w-full object-cover aspect-square"
      />
      <div className="text-[#5c3b31] font-semibold text-base mb-1 truncate" title={product.product_name}>
        {product.product_name}
      </div>
      <div className="text-[#a64b2a] font-bold mb-1">
        ${product.price.toFixed(2)}
      </div>
      <div className="text-[#6d4c41] text-sm mb-1 capitalize">
        {product.category}
      </div>
      <div className="text-[#3d2b24] text-xs mb-1 line-clamp-3 h-[48px]">
        {product.description}
      </div>
      <div className="text-[#3d2b24] text-xs flex items-center gap-1">
        <span>⭐ {product.rating}</span>
        <span className="text-gray-500">({product.review_count} reviews)</span>
      </div>
      <div className="text-[#3d2b24] text-xs mt-1 italic truncate">
        Variant: {product.variant_title_product}
      </div>
    </div>
  );
}
