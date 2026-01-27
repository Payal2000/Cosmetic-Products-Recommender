'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ARCamera from '@/components/ARCamera';
import { lipShades, cheekShades, browProducts, contourShades, foundationShades } from '@/data/shades';
import { ArrowLeft, Palette, CircleDot, Eye, Layers, Camera, Shield } from 'lucide-react';

/**
 * Swatch button for selecting color shades.
 * Renders a circular color preview with selected/hover states.
 */
function Swatch({
  color,
  selected,
  onClick,
  title,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
  title: string;
}) {
  const isLight = color === 'transparent' || color === '#ffffff';

  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-full transition-all duration-200 focus:outline-none ${
        selected
          ? 'scale-110 ring-2 ring-offset-2 ring-blush-400'
          : 'hover:scale-110'
      } ${isLight ? 'border border-cream-200' : ''}`}
      style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
    />
  );
}

export default function TryOnPage() {
  const [lipFinish, setLipFinish] = useState('matte');
  const [lipProduct, setLipProduct] = useState('');
  const [selectedLipShade, setSelectedLipShade] = useState('#E33638');

  const [cheekFinish, setCheekFinish] = useState('matte');
  const [cheekProduct, setCheekProduct] = useState('');
  const [selectedCheekShade, setSelectedCheekShade] = useState('#f7976c');

  const [selectedBrowProduct, setSelectedBrowProduct] = useState('Brow Harmony Pencil & Gel');
  const [selectedBrowShade, setSelectedBrowShade] = useState('#6D4F3A');

  const [selectedContourProduct] = useState('Warm Wishes Bronzer Stick');
  const [selectedContourShade, setSelectedContourShade] = useState('#A2644F');

  const [selectedFoundationProduct] = useState('Liquid Touch Weightless Foundation');
  const [selectedFoundationShade, setSelectedFoundationShade] = useState('#F7E3CF');

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

  const getLipShades = () => {
    // @ts-ignore - dynamic shade key access
    return lipShades[lipFinish]?.[lipProduct] || {};
  };

  const getCheekShades = () => {
    // @ts-ignore - dynamic shade key access
    return cheekShades[cheekFinish]?.[cheekProduct] || {};
  };

  const getBrowShades = () => {
    // @ts-ignore - dynamic shade key access
    return browProducts[selectedBrowProduct] || {};
  };

  const getContourShades = () => {
    // @ts-ignore - dynamic shade key access
    return contourShades[selectedContourProduct] || {};
  };

  const getFoundationShades = () => {
    // @ts-ignore - dynamic shade key access
    return foundationShades[selectedFoundationProduct] || {};
  };

  const selectClass =
    'w-full bg-white border border-cream-200 rounded-lg py-2.5 px-3 pr-8 text-sm text-warm-700 focus:ring-1 focus:ring-blush-400 focus:border-blush-400 outline-none appearance-none cursor-pointer';

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row font-sans text-warm-900">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-[380px] bg-white border-r border-cream-200 md:h-screen overflow-y-auto scrollbar-hide flex-shrink-0 flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex-shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-olive-400 hover:text-warm-900 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back
          </Link>
          <h1 className="text-2xl font-light tracking-tight text-warm-900 mb-1">
            Virtual Studio
          </h1>
          <p className="text-olive-400 text-sm">
            Select shades to preview live.
          </p>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-8">
          <div className="space-y-6">
            {/* LIPS */}
            <section className="border-t border-cream-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                  Lips
                </h3>
              </div>

              <div className="bg-cream-100 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-1.5 uppercase tracking-wider">
                      Finish
                    </label>
                    <select
                      value={lipFinish}
                      onChange={(e) => setLipFinish(e.target.value)}
                      className={selectClass}
                    >
                      <option value="matte">Matte</option>
                      <option value="glossy">Glossy</option>
                      <option value="dewy">Dewy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-1.5 uppercase tracking-wider">
                      Product
                    </label>
                    <select
                      value={lipProduct}
                      onChange={(e) => setLipProduct(e.target.value)}
                      className={`${selectClass} truncate`}
                    >
                      {Object.keys(lipShades[lipFinish as keyof typeof lipShades] || {}).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Shade: {Object.keys(getLipShades()).find(k => getLipShades()[k] === selectedLipShade)}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
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
              </div>
            </section>

            {/* CHEEKS */}
            <section className="border-t border-cream-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CircleDot className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                  Cheeks
                </h3>
              </div>

              <div className="bg-cream-100 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-1.5 uppercase tracking-wider">
                      Finish
                    </label>
                    <select
                      value={cheekFinish}
                      onChange={(e) => setCheekFinish(e.target.value)}
                      className={selectClass}
                    >
                      {Object.keys(cheekShades).map(f => (
                        <option key={f} value={f}>
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-1.5 uppercase tracking-wider">
                      Product
                    </label>
                    <select
                      value={cheekProduct}
                      onChange={(e) => setCheekProduct(e.target.value)}
                      className={`${selectClass} truncate`}
                    >
                      {Object.keys(cheekShades[cheekFinish as keyof typeof cheekShades] || {}).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Shade: {Object.keys(getCheekShades()).find(k => getCheekShades()[k] === selectedCheekShade)}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
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
              </div>
            </section>

            {/* BROWS */}
            <section className="border-t border-cream-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                  Brows
                </h3>
              </div>

              <div className="bg-cream-100 p-4 rounded-xl space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-1.5 uppercase tracking-wider">
                    Product
                  </label>
                  <select
                    value={selectedBrowProduct}
                    onChange={(e) => setSelectedBrowProduct(e.target.value)}
                    className={`${selectClass} truncate`}
                  >
                    {Object.keys(browProducts).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Shade: {Object.keys(getBrowShades()).find(k => getBrowShades()[k] === selectedBrowShade)}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
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
              </div>
            </section>

            {/* FACE */}
            <section className="border-t border-cream-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                  Face
                </h3>
              </div>

              <div className="bg-cream-100 p-4 rounded-xl space-y-5">
                {/* Contour */}
                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Bronzer / Contour
                  </label>
                  <div className="flex flex-wrap gap-2.5">
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

                {/* Foundation */}
                <div className="border-t border-cream-200/60 pt-4">
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Foundation
                  </label>
                  <div className="flex flex-wrap gap-2.5">
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
            </section>
          </div>
        </div>
      </aside>

      {/* AR Camera View */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden bg-cream-50">
        <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
          <div className="bg-white p-3 rounded-2xl shadow-lg border border-cream-200/40 mb-6">
            <ARCamera
              lipShade={selectedLipShade}
              cheekShade={selectedCheekShade}
              browShade={selectedBrowShade}
              browProductType={selectedBrowProduct}
              contourShade={selectedContourShade}
              foundationShade={selectedFoundationShade}
            />
          </div>

          <div className="flex items-center gap-2.5 text-olive-400 text-xs tracking-wide">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-cream-200/60">
              <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Camera active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-cream-200/60">
              <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Processed locally</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
