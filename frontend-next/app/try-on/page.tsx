'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ARCamera, { ARCameraRef } from '@/components/ARCamera';
import { lipShades, cheekShades, browProducts, contourShades, foundationShades } from '@/data/shades';
import { makeupPresets } from '@/data/presets';
import { ArrowLeft, Palette, CircleDot, Eye, Layers, Camera, Shield, Download, Sliders, ToggleLeft, ToggleRight, Save, Upload, Trash2, X, Sparkles, Share2, Link2, Check, ChevronDown, ChevronUp } from 'lucide-react';

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
      className={`w-7 h-7 rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none active:scale-90 ${
        selected
          ? 'scale-110 ring-2 ring-offset-2 ring-blush-400 shadow-md'
          : 'hover:scale-110 hover:shadow-sm'
      } ${isLight ? 'border border-cream-200' : ''}`}
      style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
    />
  );
}

export default function TryOnPage() {
  const arCameraRef = useRef<ARCameraRef>(null);

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

  // Intensity controls
  const [lipIntensity, setLipIntensity] = useState(1);
  const [cheekIntensity, setCheekIntensity] = useState(1);
  const [browIntensity, setBrowIntensity] = useState(1);
  const [contourIntensity, setContourIntensity] = useState(1);
  const [foundationIntensity, setFoundationIntensity] = useState(1);

  // Before/After toggle
  const [showMakeup, setShowMakeup] = useState(true);

  // Save/Load Looks
  const [savedLooks, setSavedLooks] = useState<Array<{name: string, look: any}>>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [lookName, setLookName] = useState('');
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  // Share functionality
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    presets: false,
    lips: false,
    cheeks: false,
    brows: false,
    face: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Load saved looks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedMakeupLooks');
    if (saved) {
      setSavedLooks(JSON.parse(saved));
    }
  }, []);

  const saveLook = () => {
    if (!lookName.trim()) return;

    const look = {
      lipFinish,
      lipProduct,
      selectedLipShade,
      cheekFinish,
      cheekProduct,
      selectedCheekShade,
      selectedBrowProduct,
      selectedBrowShade,
      selectedContourShade,
      selectedFoundationShade,
      lipIntensity,
      cheekIntensity,
      browIntensity,
      contourIntensity,
      foundationIntensity,
    };

    const newLooks = [...savedLooks, { name: lookName, look }];
    setSavedLooks(newLooks);
    localStorage.setItem('savedMakeupLooks', JSON.stringify(newLooks));
    setLookName('');
    setShowSaveDialog(false);
  };

  const loadLook = (look: any) => {
    setLipFinish(look.lipFinish);
    setLipProduct(look.lipProduct);
    setSelectedLipShade(look.selectedLipShade);
    setCheekFinish(look.cheekFinish);
    setCheekProduct(look.cheekProduct);
    setSelectedCheekShade(look.selectedCheekShade);
    setSelectedBrowProduct(look.selectedBrowProduct);
    setSelectedBrowShade(look.selectedBrowShade);
    setSelectedContourShade(look.selectedContourShade);
    setSelectedFoundationShade(look.selectedFoundationShade);
    setLipIntensity(look.lipIntensity ?? 1);
    setCheekIntensity(look.cheekIntensity ?? 1);
    setBrowIntensity(look.browIntensity ?? 1);
    setContourIntensity(look.contourIntensity ?? 1);
    setFoundationIntensity(look.foundationIntensity ?? 1);
    setShowLoadDialog(false);
  };

  const deleteLook = (index: number) => {
    const newLooks = savedLooks.filter((_, i) => i !== index);
    setSavedLooks(newLooks);
    localStorage.setItem('savedMakeupLooks', JSON.stringify(newLooks));
  };

  const shareToSocial = async (platform: 'twitter' | 'facebook' | 'pinterest') => {
    // First capture screenshot
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const imageUrl = canvas.toDataURL('image/png');
    const text = 'Check out my virtual makeup look!';
    const url = window.location.href;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2000);
  };

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
    'w-full bg-white border border-cream-200 rounded-lg py-2.5 px-3 pr-8 text-sm text-warm-700 focus:ring-1 focus:ring-blush-400 focus:border-blush-400 outline-none appearance-none cursor-pointer focus-glow transition-all duration-200';

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row font-sans text-warm-900">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-[380px] bg-white border-r border-cream-200 md:h-screen overflow-y-auto scrollbar-hide flex-shrink-0 flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex-shrink-0 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-olive-400 hover:text-warm-900 transition-all duration-200 mb-6 text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            Back
          </Link>
          <h1 className="text-2xl font-light tracking-tight text-warm-900 mb-1">
            Virtual Studio
          </h1>
          <p className="text-olive-400 text-sm mb-4">
            Select shades to preview live.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-blush-400 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blush-500 transition-colors duration-200 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={1.5} />
              Save Look
            </button>
            <button
              onClick={() => setShowLoadDialog(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white text-warm-700 px-3 py-2 rounded-lg text-xs font-medium border border-cream-200 hover:bg-cream-50 transition-colors duration-200"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
              Load Look
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-8">
          <div className="space-y-6">
            {/* PRESETS */}
            <section className="border-t border-cream-200 pt-6 opacity-0 animate-fade-in-up">
              <button
                onClick={() => toggleSection('presets')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                  <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                    Quick Looks
                  </h3>
                </div>
                {expandedSections.presets ? (
                  <ChevronUp className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                )}
              </button>
              {expandedSections.presets && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(makeupPresets).map(([name, preset]) => (
                    <button
                      key={name}
                      onClick={() => loadLook(preset)}
                      className="p-3 bg-cream-100 hover:bg-blush-100 rounded-lg text-xs font-medium text-warm-700 hover:text-blush-600 transition-all duration-200 text-left border border-transparent hover:border-blush-300"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* LIPS */}
            <section className="border-t border-cream-200 pt-6 opacity-0 animate-fade-in-up stagger-1">
              <button
                onClick={() => toggleSection('lips')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                  <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                    Lips
                  </h3>
                </div>
                {expandedSections.lips ? (
                  <ChevronUp className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                )}
              </button>

              {expandedSections.lips && (
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
                    Shade
                  </label>
                  <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blush-50 to-cream-100 rounded-lg border border-blush-200">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedLipShade }}
                      />
                      <span className="text-sm font-medium text-warm-800">
                        {Object.keys(getLipShades()).find(k => getLipShades()[k] === selectedLipShade) || 'Select a shade'}
                      </span>
                    </div>
                  </div>
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

                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Intensity: {Math.round(lipIntensity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={lipIntensity}
                    onChange={(e) => setLipIntensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              )}
            </section>

            {/* CHEEKS */}
            <section className="border-t border-cream-200 pt-6 opacity-0 animate-fade-in-up stagger-3">
              <button
                onClick={() => toggleSection('cheeks')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                  <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                    Cheeks
                  </h3>
                </div>
                {expandedSections.cheeks ? (
                  <ChevronUp className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                )}
              </button>

              {expandedSections.cheeks && (
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
                    Shade
                  </label>
                  <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blush-50 to-cream-100 rounded-lg border border-blush-200">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedCheekShade }}
                      />
                      <span className="text-sm font-medium text-warm-800">
                        {Object.keys(getCheekShades()).find(k => getCheekShades()[k] === selectedCheekShade) || 'Select a shade'}
                      </span>
                    </div>
                  </div>
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

                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Intensity: {Math.round(cheekIntensity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={cheekIntensity}
                    onChange={(e) => setCheekIntensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              )}
            </section>

            {/* BROWS */}
            <section className="border-t border-cream-200 pt-6 opacity-0 animate-fade-in-up stagger-5">
              <button
                onClick={() => toggleSection('brows')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                  <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                    Brows
                  </h3>
                </div>
                {expandedSections.brows ? (
                  <ChevronUp className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                )}
              </button>

              {expandedSections.brows && (
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
                    Shade
                  </label>
                  <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blush-50 to-cream-100 rounded-lg border border-blush-200">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedBrowShade }}
                      />
                      <span className="text-sm font-medium text-warm-800">
                        {Object.keys(getBrowShades()).find(k => getBrowShades()[k] === selectedBrowShade) || 'Select a shade'}
                      </span>
                    </div>
                  </div>
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

                <div>
                  <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                    Intensity: {Math.round(browIntensity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={browIntensity}
                    onChange={(e) => setBrowIntensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              )}
            </section>

            {/* FACE */}
            <section className="border-t border-cream-200 pt-6 opacity-0 animate-fade-in-up stagger-7">
              <button
                onClick={() => toggleSection('face')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                  <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-olive-500">
                    Face
                  </h3>
                </div>
                {expandedSections.face ? (
                  <ChevronUp className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-olive-400" strokeWidth={1.5} />
                )}
              </button>

              {expandedSections.face && (
                <div className="bg-cream-100 p-4 rounded-xl space-y-5">
                {/* Contour */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                      Bronzer / Contour
                    </label>
                    <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blush-50 to-cream-100 rounded-lg border border-blush-200">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: selectedContourShade }}
                        />
                        <span className="text-sm font-medium text-warm-800">
                          {Object.keys(getContourShades()).find(k => getContourShades()[k] === selectedContourShade) || 'Select a shade'}
                        </span>
                      </div>
                    </div>
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
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                      Intensity: {Math.round(contourIntensity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={contourIntensity}
                      onChange={(e) => setContourIntensity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Foundation */}
                <div className="border-t border-cream-200/60 pt-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                      Foundation
                    </label>
                    <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blush-50 to-cream-100 rounded-lg border border-blush-200">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: selectedFoundationShade }}
                        />
                        <span className="text-sm font-medium text-warm-800">
                          {Object.keys(getFoundationShades()).find(k => getFoundationShades()[k] === selectedFoundationShade) || 'Select a shade'}
                        </span>
                      </div>
                    </div>
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
                  <div>
                    <label className="block text-[10px] font-medium text-olive-400 mb-2 uppercase tracking-wider">
                      Intensity: {Math.round(foundationIntensity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={foundationIntensity}
                      onChange={(e) => setFoundationIntensity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              )}
            </section>
          </div>
        </div>
      </aside>

      {/* AR Camera View */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden bg-cream-50">
        <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
          <div className="bg-white p-3 rounded-2xl shadow-lg border border-cream-200/40 mb-6 w-full max-w-[670px] opacity-0 animate-scale-in" style={{ animationDelay: '150ms' }}>
            <ARCamera
              ref={arCameraRef}
              lipShade={selectedLipShade}
              cheekShade={selectedCheekShade}
              browShade={selectedBrowShade}
              browProductType={selectedBrowProduct}
              contourShade={selectedContourShade}
              foundationShade={selectedFoundationShade}
              lipIntensity={lipIntensity}
              cheekIntensity={cheekIntensity}
              browIntensity={browIntensity}
              contourIntensity={contourIntensity}
              foundationIntensity={foundationIntensity}
              showMakeup={showMakeup}
            />
          </div>

          <div className="flex items-center gap-2.5 text-olive-400 text-xs tracking-wide flex-wrap justify-center">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-cream-200/60 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Camera active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-cream-200/60 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Processed locally</span>
            </div>
            <button
              onClick={() => setShowMakeup(!showMakeup)}
              className="flex items-center gap-1.5 bg-white text-warm-700 px-4 py-2 rounded-full border border-cream-200/60 opacity-0 animate-fade-in-up hover:bg-cream-50 transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
              style={{ animationDelay: '600ms' }}
            >
              {showMakeup ? <ToggleRight className="w-3.5 h-3.5" strokeWidth={1.5} /> : <ToggleLeft className="w-3.5 h-3.5" strokeWidth={1.5} />}
              <span className="font-medium">{showMakeup ? 'Hide Makeup' : 'Show Makeup'}</span>
            </button>
            <button
              onClick={() => arCameraRef.current?.captureScreenshot()}
              className="flex items-center gap-1.5 bg-blush-400 text-white px-4 py-2 rounded-full border border-blush-500/20 opacity-0 animate-fade-in-up hover:bg-blush-500 transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
              style={{ animationDelay: '700ms' }}
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="font-medium">Download</span>
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="flex items-center gap-1.5 bg-white text-warm-700 px-4 py-2 rounded-full border border-cream-200/60 opacity-0 animate-fade-in-up hover:bg-cream-50 transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
              style={{ animationDelay: '800ms' }}
            >
              <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Look Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSaveDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-warm-900">Save Your Look</h2>
              <button onClick={() => setShowSaveDialog(false)} className="text-olive-400 hover:text-warm-900 transition-colors">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <input
              type="text"
              value={lookName}
              onChange={(e) => setLookName(e.target.value)}
              placeholder="Enter look name..."
              className="w-full bg-cream-50 border border-cream-200 rounded-lg py-3 px-4 text-sm text-warm-700 focus:ring-2 focus:ring-blush-400 focus:border-blush-400 outline-none mb-4"
              onKeyDown={(e) => e.key === 'Enter' && saveLook()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-warm-700 bg-cream-50 hover:bg-cream-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveLook}
                disabled={!lookName.trim()}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blush-400 hover:bg-blush-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Look
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Look Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLoadDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-warm-900">Load Saved Look</h2>
              <button onClick={() => setShowLoadDialog(false)} className="text-olive-400 hover:text-warm-900 transition-colors">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            {savedLooks.length === 0 ? (
              <p className="text-center text-olive-400 py-8">No saved looks yet. Create your first look!</p>
            ) : (
              <div className="space-y-2">
                {savedLooks.map((saved, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition-colors group"
                  >
                    <button
                      onClick={() => loadLook(saved.look)}
                      className="flex-1 text-left text-sm font-medium text-warm-900"
                    >
                      {saved.name}
                    </button>
                    <button
                      onClick={() => deleteLook(index)}
                      className="opacity-0 group-hover:opacity-100 text-olive-400 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShareDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-warm-900">Share Your Look</h2>
              <button onClick={() => setShowShareDialog(false)} className="text-olive-400 hover:text-warm-900 transition-colors">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="font-medium text-warm-900">Share on Twitter</span>
              </button>

              <button
                onClick={() => shareToSocial('facebook')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-medium text-warm-900">Share on Facebook</span>
              </button>

              <button
                onClick={() => shareToSocial('pinterest')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#E60023] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </div>
                <span className="font-medium text-warm-900">Share on Pinterest</span>
              </button>

              <div className="border-t border-cream-200 pt-3 mt-3">
                <button
                  onClick={copyShareLink}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition-colors"
                >
                  {shareLinkCopied ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" strokeWidth={2} />
                      </div>
                      <span className="font-medium text-green-600">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-olive-400" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium text-warm-900">Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
