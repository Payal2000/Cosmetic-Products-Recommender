'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ARCamera from '@/components/ARCamera';
import { lipShades, cheekShades, browProducts, contourShades, foundationShades } from '@/data/shades';

export default function TryOnPage() {
  // --- STATE ---
  const [lipFinish, setLipFinish] = useState('matte');
  const [lipProduct, setLipProduct] = useState('');
  const [selectedLipShade, setSelectedLipShade] = useState('#E33638');

  const [cheekFinish, setCheekFinish] = useState('matte');
  const [cheekProduct, setCheekProduct] = useState('');
  const [selectedCheekShade, setSelectedCheekShade] = useState('#f7976c');

  const [selectedBrowProduct, setSelectedBrowProduct] = useState('Brow Harmony Pencil & Gel');
  const [selectedBrowShade, setSelectedBrowShade] = useState('#6D4F3A');

  const [selectedContourProduct, setSelectedContourProduct] = useState('Warm Wishes Bronzer Stick');
  const [selectedContourShade, setSelectedContourShade] = useState('#A2644F');

  const [selectedFoundationProduct, setSelectedFoundationProduct] = useState('Liquid Touch Weightless Foundation');
  const [selectedFoundationShade, setSelectedFoundationShade] = useState('#F7E3CF');

  // --- INITIALIZERS & UPDATES ---
  
  // Set initial product when finish changes
  useEffect(() => {
    const products = Object.keys(lipShades[lipFinish as keyof typeof lipShades] || {});
    if (products.length > 0) {
        setLipProduct(products[0]);
    }
  }, [lipFinish]);

  useEffect(() => {
    const products = Object.keys(cheekShades[cheekFinish as keyof typeof cheekShades] || {});
    if (products.length > 0) {
        setCheekProduct(products[0]);
    }
  }, [cheekFinish]);


  // --- GETTERS (Safe accessors) ---
  const getLipShades = () => {
    // @ts-ignore
    return lipShades[lipFinish]?.[lipProduct] || {};
  };

  const getCheekShades = () => {
    // @ts-ignore
    return cheekShades[cheekFinish]?.[cheekProduct] || {};
  };

  const getBrowShades = () => {
    // @ts-ignore
    return browProducts[selectedBrowProduct] || {};
  };

  const getContourShades = () => {
    // @ts-ignore
    return contourShades[selectedContourProduct] || {};
  };

  const getFoundationShades = () => {
    // @ts-ignore
    return foundationShades[selectedFoundationProduct] || {};
  };

  // --- HELPERS for Swatches ---
  const Swatch = ({ color, selected, onClick, title }: { color: string, selected: boolean, onClick: () => void, title: string }) => (
    <div
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
        selected ? 'border-2 border-black scale-110' : 'border-gray-200 hover:border-gray-400'
      }`}
      style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <div className="w-full md:w-96 bg-white p-6 overflow-y-auto border-r border-gray-200 h-screen scrollbar-thin">
         <div className="mb-6">
            <Link href="/" className="text-[#c2185b] font-semibold hover:underline flex items-center gap-2 mb-4">
                ← Back to Recommender
            </Link>
            <h1 className="text-2xl font-bold text-[#5c3b31]">AR Shade Try-On</h1>
        </div>

        {/* LIPS */}
        <div className="mb-8 p-4 bg-pink-50 rounded-xl">
            <h3 className="font-bold text-[#c2185b] mb-2 border-b border-pink-200 pb-1">Lips</h3>
            
            <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Finish</label>
                <select 
                    value={lipFinish} 
                    onChange={(e) => setLipFinish(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-sm"
                >
                    <option value="matte">Matte</option>
                    <option value="glossy">Glossy</option>
                    <option value="dewy">Dewy</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product</label>
                <select 
                    value={lipProduct} 
                    onChange={(e) => setLipProduct(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-sm"
                >
                    {Object.keys(lipShades[lipFinish as keyof typeof lipShades] || {}).map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap gap-2">
                {Object.entries(getLipShades()).map(([name, hex]) => (
                    <Swatch 
                        key={name} 
                        title={name}
                        color={hex as string} 
                        selected={selectedLipShade === hex} 
                        onClick={() => setSelectedLipShade(hex as string)} 
                    />
                ))}
            </div>
        </div>

        {/* CHEEKS */}
        <div className="mb-8 p-4 bg-orange-50 rounded-xl">
            <h3 className="font-bold text-orange-800 mb-2 border-b border-orange-200 pb-1">Cheeks</h3>
             <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Finish</label>
                <select 
                    value={cheekFinish} 
                    onChange={(e) => setCheekFinish(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-sm"
                >
                   {Object.keys(cheekShades).map(f => (
                       <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                   ))}
                </select>
            </div>
             <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product</label>
                <select 
                    value={cheekProduct} 
                    onChange={(e) => setCheekProduct(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-sm"
                >
                   {Object.keys(cheekShades[cheekFinish as keyof typeof cheekShades] || {}).map(p => (
                       <option key={p} value={p}>{p}</option>
                   ))}
                </select>
            </div>
            <div className="flex flex-wrap gap-2">
                {Object.entries(getCheekShades()).map(([name, hex]) => (
                    <Swatch 
                        key={name}
                        title={name}
                        color={hex as string}
                        selected={selectedCheekShade === hex}
                        onClick={() => setSelectedCheekShade(hex as string)}
                    />
                ))}
            </div>
        </div>

        {/* BROWS */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
             <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">Brows</h3>
             <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product</label>
                <select 
                    value={selectedBrowProduct} 
                    onChange={(e) => setSelectedBrowProduct(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-sm"
                >
                   {Object.keys(browProducts).map(p => (
                       <option key={p} value={p}>{p}</option>
                   ))}
                </select>
            </div>
             <div className="flex flex-wrap gap-2">
                {Object.entries(getBrowShades()).map(([name, hex]) => (
                    <Swatch 
                        key={name}
                        title={name}
                        color={hex as string}
                        selected={selectedBrowShade === hex}
                        onClick={() => setSelectedBrowShade(hex as string)}
                    />
                ))}
            </div>
        </div>

         {/* CONTOUR */}
         <div className="mb-8 p-4 bg-amber-50 rounded-xl">
             <h3 className="font-bold text-amber-800 mb-2 border-b border-amber-200 pb-1">Contour</h3>
             <div className="mb-3">
                <div className="text-sm text-gray-700">{selectedContourProduct}</div>
            </div>
             <div className="flex flex-wrap gap-2">
                {Object.entries(getContourShades()).map(([name, hex]) => (
                    <Swatch 
                        key={name}
                        title={name}
                        color={hex as string}
                        selected={selectedContourShade === hex}
                        onClick={() => setSelectedContourShade(hex as string)}
                    />
                ))}
            </div>
        </div>

        {/* FOUNDATION */}
        <div className="mb-8 p-4 bg-stone-50 rounded-xl">
             <h3 className="font-bold text-stone-800 mb-2 border-b border-stone-200 pb-1">Foundation</h3>
             <div className="mb-3">
                <div className="text-sm text-gray-700">{selectedFoundationProduct}</div>
            </div>
             <div className="flex flex-wrap gap-2">
                {Object.entries(getFoundationShades()).map(([name, hex]) => (
                    <Swatch 
                        key={name}
                        title={name}
                        color={hex as string}
                        selected={selectedFoundationShade === hex}
                        onClick={() => setSelectedFoundationShade(hex as string)}
                    />
                ))}
            </div>
        </div>

      </div>

      {/* AR Camera View */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fdf7f4]">
        <div className="flex flex-col items-center">
            <ARCamera 
                lipShade={selectedLipShade}
                cheekShade={selectedCheekShade}
                browShade={selectedBrowShade}
                browProductType={selectedBrowProduct}
                contourShade={selectedContourShade}
                foundationShade={selectedFoundationShade}
            />
             <p className="mt-4 text-gray-500 text-sm">
                Allows camera access to try on shades. <br/> 
                Face data is processed locally in your browser.
            </p>
        </div>
      </div>
    </div>
  );
}
