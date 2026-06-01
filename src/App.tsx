import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertOctagon, Pill } from "lucide-react";
import { DrugProfile, DrugAnalogue, SelectedCountry } from "./types";
import SearchHeader from "./components/SearchHeader";
import DrugProfileCard from "./components/DrugProfileCard";
import AnalogueList from "./components/AnalogueList";
import Footer from "./components/Footer";

export default function App() {
  const [drugName, setDrugName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry>("USA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results State
  const [profile, setProfile] = useState<DrugProfile | null>(null);
  const [analogueItems, setAnalogueItems] = useState<DrugAnalogue[]>([]);
  const [euFhirEntries, setEuFhirEntries] = useState<any[]>([]);

  // Execute Search Sequence
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName.trim()) return;

    setLoading(true);
    setError(null);
    setProfile(null);
    setAnalogueItems([]);
    setEuFhirEntries([]);

    setTimeout(() => {
      document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const resolveUrl = `/api/resolve-inn?name=${encodeURIComponent(drugName.trim())}`;
      const resolveRes = await fetch(resolveUrl);
      
      if (!resolveRes.ok) {
        const errorJson = await resolveRes.json().catch(() => ({}));
        throw new Error(errorJson.error || "we couldn't recognize this medicine. check the spelling or try another popular option.");
      }

      const resolvedData: DrugProfile = await resolveRes.json();
      setProfile(resolvedData);

      const targetInn = resolvedData.inn;

      if (selectedCountry === "USA") {
        const usaUrl = `/api/analogues/usa?inn=${encodeURIComponent(targetInn)}`;
        const usaRes = await fetch(usaUrl);
        if (!usaRes.ok) throw new Error("failed to extract analogues from fda registry.");
        const usaData = await usaRes.json();
        setAnalogueItems(usaData.results || []);
      } else if (selectedCountry === "Canada") {
        const canadaUrl = `/api/analogues/canada?inn=${encodeURIComponent(targetInn)}`;
        const canadaRes = await fetch(canadaUrl);
        if (!canadaRes.ok) throw new Error("failed to extract analogues from canada health registry.");
        const canadaData = await canadaRes.json();
        setAnalogueItems(canadaData.results || []);
      } else if (selectedCountry === "EU") {
        const euUrl = `/v2/RegulatedAuthorization?status=active&region=EU&ingredient=${encodeURIComponent(targetInn)}`;
        const euRes = await fetch(euUrl);
        if (!euRes.ok) throw new Error("failed to extract marketing authorizations from ema.");
        const euData = await euRes.json();
        setEuFhirEntries(euData.entry || []);
      } else if (selectedCountry === "Serbia") {
        const serbiaUrl = `/api/analogues/serbia?inn=${encodeURIComponent(targetInn)}`;
        const serbiaRes = await fetch(serbiaUrl);
        if (!serbiaRes.ok) throw new Error("failed to extract analogues from serbian medicine register.");
        const serbiaData = await serbiaRes.json();
        setAnalogueItems(serbiaData.results || []);
      } else if (selectedCountry === "Singapore") {
        const singaporeUrl = `/api/analogues/singapore?inn=${encodeURIComponent(targetInn)}`;
        const singaporeRes = await fetch(singaporeUrl);
        if (!singaporeRes.ok) throw new Error("failed to extract analogues from singapore hsa.");
        const singaporeData = await singaporeRes.json();
        setAnalogueItems(singaporeData.results || []);
      }

      setTimeout(() => {
        document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);

    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "something went wrong. let's try typing it again.");
      
      setTimeout(() => {
        document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-zinc-850 selection:text-white relative overflow-hidden font-sans lowercase" id="app-root-view">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-zinc-900/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-grow w-full max-w-[960px] mx-auto px-5 sm:px-8 py-10 md:py-16 space-y-10 relative z-10">
        
        <div className="space-y-10">
          <SearchHeader
            drugName={drugName}
            setDrugName={setDrugName}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            onSearch={handleSearch}
            loading={loading}
          />

          <div id="results-anchor">
            <AnimatePresence mode="wait">
              
              {loading && (
                <motion.div
                  key="search-loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center py-24 space-y-5"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full border-2 border-zinc-900 border-t-[#0071e3] animate-spin" />
                    <Pill className="w-4.5 h-4.5 text-zinc-500 absolute" />
                  </div>
                  <div className="space-y-1 text-center max-w-sm">
                    <p className="text-zinc-200 text-sm font-medium">analyzing active substances...</p>
                    <p className="text-zinc-550 text-xs">matching regulatory files in real-time</p>
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div
                  key="search-error"
                  initial={{ opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  className="border border-[#2c2c2e] bg-[#1c1c1e]/40 backdrop-blur-md rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row gap-4 items-start max-w-xl mx-auto"
                >
                  <div className="p-2.5 bg-zinc-900 text-zinc-400 rounded-xl border border-zinc-800 shrink-0">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-sm tracking-tight text-white">spelling issue or unregistered name</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{error.toLowerCase()}</p>
                    <button 
                      onClick={handleSearch}
                      className="mt-1 text-xs text-[#0071e3] hover:underline font-medium cursor-pointer"
                    >
                      try searching again
                    </button>
                  </div>
                </motion.div>
              )}

              {!profile && !loading && !error && (
                <motion.div
                  key="empty-intro"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="max-w-2xl mx-auto text-center space-y-6 py-12 px-6"
                >
                  <h3 className="text-xl sm:text-2xl font-light text-white/90 tracking-tight leading-relaxed">
                    traveling? search any familiar country-of-origin brand above to find identical active ingredients and approved local substitutes.
                  </h3>
                  
                  <div className="flex justify-center items-center gap-6 text-[10px] tracking-wider uppercase text-zinc-650 font-mono pt-4 border-t border-zinc-900/40">
                    <span>usa</span>
                    <span>•</span>
                    <span>canada</span>
                    <span>•</span>
                    <span>europe</span>
                    <span>•</span>
                    <span>serbia</span>
                    <span>•</span>
                    <span>singapore</span>
                  </div>
                </motion.div>
              )}

              {profile && !loading && (
                <motion.div
                  key="results-present"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-zinc-900/60 pt-8"
                >
                  <div className="lg:col-span-5">
                    <DrugProfileCard profile={profile} />
                  </div>

                  <div className="lg:col-span-7">
                    <AnalogueList
                      country={selectedCountry}
                      analogueItems={analogueItems}
                      euFhirEntries={euFhirEntries}
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}