import React, { useState } from "react";
import { Search, Loader2, Globe2, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SelectedCountry } from "../types";

interface SearchHeaderProps {
  drugName: string;
  setDrugName: (val: string) => void;
  selectedCountry: SelectedCountry;
  setSelectedCountry: (country: SelectedCountry) => void;
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SearchHeader({
  drugName,
  setDrugName,
  selectedCountry,
  setSelectedCountry,
  onSearch,
  loading,
}: SearchHeaderProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const popularSuggestions = ["aspirin", "ibuprofen", "paracetamol", "lipitor", "nexium", "zoloft"];

  const regions: { id: SelectedCountry; name: string; emoji: string }[] = [
    { id: "USA", name: "usa", emoji: "🇺🇸" },
    { id: "Canada", name: "canada", emoji: "🇨🇦" },
    { id: "EU", name: "europe", emoji: "🇪🇺" },
    { id: "Serbia", name: "serbia", emoji: "🇷🇸" },
    { id: "Singapore", name: "singapore", emoji: "🇸🇬" },
  ];

  return (
    <div className="w-full space-y-8 relative z-20" id="search-container">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center text-center gap-1.5 pb-2">
        <div className="space-y-0.5">
          <motion.h1 
            className="text-2xl font-light tracking-widest lowercase text-zinc-100 font-sans"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            id="brand-title"
          >
            calca
          </motion.h1>
          <motion.button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="text-zinc-600 hover:text-zinc-400 text-xs font-sans lowercase tracking-wide cursor-pointer hover:underline transition-all block mx-auto py-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            id="brand-slogan"
          >
            where? calca.
          </motion.button>
        </div>
      </header>
 
      {/* Search Interface - Soft & Minimalist */}
      <motion.form 
        onSubmit={onSearch}
        className="space-y-6 bg-zinc-950/20 p-5 sm:p-7 rounded-[28px] border border-zinc-900/30 relative overflow-hidden z-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        id="search-form"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          {/* Drug Name Input - Soft Rounded */}
          <div className="lg:col-span-5 w-full space-y-1.5">
            <label className="text-[11px] text-zinc-500 font-light block pl-1 lowercase font-sans">
              pill or brand name
            </label>
            <div className="relative group">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600 group-focus-within:text-[#0071e3] transition-colors" />
              <input
                type="text"
                id="drug-input"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value.toLowerCase())}
                placeholder="advil, tylenol, aspirin..."
                className="w-full bg-zinc-900/40 border border-zinc-850/60 focus:border-zinc-800 rounded-2xl py-3 pl-11 pr-11 text-sm text-zinc-200 outline-none transition-all placeholder-zinc-700 font-sans lowercase"
                disabled={loading}
                required
              />
              {drugName && (
                <button
                  type="button"
                  onClick={() => setDrugName("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Destination Region Selection - Soft Tabs */}
          <div className="lg:col-span-5 w-full space-y-1.5" id="country-select-container">
            <label className="text-[11px] text-zinc-500 font-light block pl-1 lowercase font-sans">
              target territory
            </label>
            <div className="flex bg-zinc-900/45 border border-zinc-850/60 rounded-2xl p-1 gap-1">
              {regions.map((region) => {
                const isSelected = selectedCountry === region.id;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedCountry(region.id)}
                    disabled={loading}
                    className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-sans lowercase transition-all cursor-pointer disabled:opacity-50 ${
                      isSelected 
                        ? "bg-zinc-805 text-white/90 font-medium" 
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    <span className="text-xs leading-none mb-0.5 saturate-50">{region.emoji}</span>
                    <span className="leading-tight text-[10px]">{region.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Trigger */}
          <div className="lg:col-span-2 w-full">
            <motion.button
              type="submit"
              id="search-submit-btn"
              disabled={loading || !drugName.trim()}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full bg-[#0071e3]/80 hover:bg-[#0071e3] text-white py-3 px-6 rounded-2xl font-light flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xs lowercase font-sans leading-none shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 animate-spin" />
                  <span>searching</span>
                </>
              ) : (
                <>
                  <Search className="w-3" />
                  <span>search</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Suggestion tags as Soft Pill Bulbs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900/30" id="popular-suggestions">
          <span className="text-[10px] font-mono text-zinc-600 mr-1 flex items-center gap-1 lowercase">
            <Globe2 className="w-3 h-3 text-zinc-700" /> try:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {popularSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                id={`suggest-${item.toLowerCase()}`}
                onClick={() => setDrugName(item)}
                className="text-xs bg-zinc-900/15 hover:bg-zinc-900/30 border border-zinc-900/25 text-zinc-500 hover:text-zinc-300 px-3 py-1 rounded-full transition-all cursor-pointer font-sans lowercase"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </motion.form>

      {/* Satisfying Apple-style info Sheet Modal */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInfoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-zoom-out"
            id="info-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#1c1c1e] border border-[#2c2c2e] rounded-3xl p-6 md:p-7 space-y-6 text-left cursor-default shadow-2xl"
              id="info-dialog"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-[#0071e3]" />
                  <h4 className="text-base font-bold text-white tracking-tight lowercase">
                    about calca
                  </h4>
                </div>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Main text block matching verbatim requested speech */}
              <div className="space-y-4">
                <p className="text-zinc-350 text-[13.5px] leading-relaxed font-light font-sans lowercase">
                  oh, you need your pills... we understand. even if you're in another country you'll still need it.
                </p>
                <p className="text-zinc-350 text-[13.5px] leading-relaxed font-light font-sans lowercase">
                  but... what is the name of these pills in this country? don't worry, we developed this app right for this case. just type the pill name and found a drug analogue in the target country.
                </p>
                <p className="text-zinc-350 text-[13.5px] leading-relaxed font-light font-sans lowercase">
                  it's free and simple. give it a try!
                </p>
                <div className="bg-zinc-900/60 border border-zinc-800/65 rounded-xl p-3.5 text-zinc-500 text-xs font-sans leading-relaxed lowercase">
                  (for now you can search just in the usa, canada, EU, serbia and singapore. we're currently working to add more territories.)
                </div>
              </div>

              {/* Action close button */}
              <button
                onClick={() => setInfoOpen(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 py-3 rounded-2xl text-xs font-medium cursor-pointer transition-colors border border-zinc-800 lowercase text-center shadow-inner"
              >
                let's go
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
