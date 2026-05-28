import React, { useState } from "react";
import { Building2, Layers, MapPin, Search, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DrugAnalogue, SelectedCountry } from "../types";

interface AnalogueListProps {
  country: SelectedCountry;
  analogueItems: DrugAnalogue[]; // Used for USA and Canada
  euFhirEntries: any[]; // Used for EU (FHIR RegulatedAuthorization list)
}

export default function AnalogueList({ country, analogueItems, euFhirEntries }: AnalogueListProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const hasItems = country === "EU" ? euFhirEntries.length > 0 : analogueItems.length > 0;

  // Local filtering for medical utility
  const filteredAnalogues = analogueItems.filter(item => 
    item.brandName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.dosageForm.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredEuEntries = euFhirEntries.filter(entry => {
    const rawSubject = entry.resource?.subject?.[0]?.display || "";
    const rawHolder = entry.resource?.holder?.display || "";
    const extCountry = entry.resource?.extension?.find((e: any) => e.url.includes("countries"))?.valueString || "";
    return (
      rawSubject.toLowerCase().includes(filterQuery.toLowerCase()) ||
      rawHolder.toLowerCase().includes(filterQuery.toLowerCase()) ||
      extCountry.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  const displayCount = country === "EU" ? filteredEuEntries.length : filteredAnalogues.length;

  return (
    <div className="space-y-6" id="analogue-list-box">
      {/* Header and Filter Info strip in Apple-style minimal layout */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-900/40 pb-5">
        <div>
          <span className="text-[10px] text-zinc-500 block font-medium font-sans lowercase">
            🌍 pharmacy options
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5 lowercase">
            approved brands in <span className="text-[#34c759] font-sans font-medium px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xl ml-1">{country.toLowerCase()}</span>
          </h3>
        </div>

        {/* Filter input */}
        {hasItems && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              id="result-filter"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="filter by brand name..."
              className="bg-[#1c1c1e]/60 border border-[#2c2c2e] text-xs text-white pl-9.5 pr-4 py-2.5 rounded-xl outline-none focus:border-zinc-700 w-full font-sans transition-all placeholder-zinc-750 lowercase shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Main listed content */}
      {!hasItems ? (
        <div className="text-center py-20 border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/10" id="no-analogue-state">
          <HelpCircle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 font-sans text-xs lowercase">no alternative brand versions found for this active ingredient formula.</p>
        </div>
      ) : (
        <div className="space-y-4" id="analogues-container">
          <div className="flex justify-between items-center text-xs text-zinc-550 px-1 font-sans lowercase">
            <span>found {displayCount} alternative options</span>
            <span>all certified by national regulations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="analogues-grid-root">
            <AnimatePresence mode="popLayout">
              {/* Render USA & Canada (Standard DrugAnalogue objects) */}
              {country !== "EU" && filteredAnalogues.map((item, index) => (
                <motion.div
                  key={item.id + index}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: Math.min(index * 0.02, 0.25), duration: 0.3 }}
                  whileHover={{ y: -2, borderColor: "#2c2c2e", backgroundColor: "rgba(28, 28, 30, 0.45)" }}
                  className="bg-[#1c1c1e]/25 hover:bg-[#1c1c1e]/50 border border-[#2c2c2e]/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between gap-4 relative"
                  id={`analogue-card-${item.id}`}
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3 pt-0.5">
                      <div>
                        <h4 className="text-base font-extrabold text-white tracking-tight lowercase">
                          {item.brandName?.toLowerCase()}
                        </h4>
                        <p className="text-[10px] text-zinc-550 font-mono lowercase mt-0.5 tracking-tight">
                          generic profile id: {item.id?.toLowerCase()}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-xl font-sans lowercase shrink-0">
                        <ShieldCheck className="w-3 h-3" /> approved
                      </span>
                    </div>

                    {/* Secondary values */}
                    <div className="space-y-2 border-t border-zinc-900/50 pt-3">
                      <div className="flex items-center gap-2 text-xs border-b border-zinc-900/10 pb-1">
                        <Building2 className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                        <span className="text-zinc-400 font-sans font-light line-clamp-1 lowercase">
                          {item.manufacturer ? item.manufacturer.toLowerCase() : "unknown manufacturer"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Layers className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                        <span className="text-zinc-400 font-sans font-light lowercase">
                          {item.dosageForm?.toLowerCase()} ({item.route ? item.route.toLowerCase() : "oral"})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges strength indicators */}
                  <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-zinc-900/40">
                    {item.strength ? item.strength.split(/[,;]/).map((str, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg font-sans lowercase"
                      >
                        {str.trim().toLowerCase()}
                      </span>
                    )) : (
                      <span className="px-2 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg font-sans lowercase">
                        standard strength
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Render EU FHIR Bundle entries */}
              {country === "EU" && filteredEuEntries.map((item, index) => {
                const res = item.resource;
                const dosageFormExt = res?.extension?.find((e: any) => e.url.includes("dosage-form"))?.valueString || "Formulation";
                const countriesExt = res?.extension?.find((e: any) => e.url.includes("countries"))?.valueString || "European Union";
                const authNumber = res?.identifier?.[0]?.value || "EU/1/XX/XXX";
                const authorizedBrand = res.subject?.[0]?.display || "Unknown Authorized Brand";
                const holderName = res.holder?.display || "Unknown Manufacturer";

                return (
                  <motion.div
                    key={res.id + index}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: Math.min(index * 0.02, 0.25), duration: 0.3 }}
                    whileHover={{ y: -2, borderColor: "#2c2c2e", backgroundColor: "rgba(28, 28, 30, 0.45)" }}
                    className="bg-[#1c1c1e]/25 hover:bg-[#1c1c1e]/50 border border-[#2c2c2e]/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between gap-4 relative"
                    id={`analogue-card-eu-${res.id}`}
                  >
                    <div className="space-y-3">
                      {/* Header line */}
                      <div className="flex items-start justify-between gap-3 pt-0.5">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-extrabold text-white tracking-tight lowercase truncate">
                            {authorizedBrand.toLowerCase()}
                          </h4>
                          <p className="text-[10px] text-zinc-550 font-mono lowercase mt-0.5 tracking-tight truncate">
                            ema id: {authNumber.toLowerCase()}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-xl font-sans lowercase shrink-0">
                          <ShieldCheck className="w-3 h-3" /> active
                        </span>
                      </div>

                      {/* Secondary values */}
                      <div className="space-y-2 border-t border-zinc-900/50 pt-3">
                        <div className="flex items-center gap-2 text-xs border-b border-zinc-900/10 pb-1">
                          <Building2 className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                          <span className="text-zinc-400 font-sans font-light line-clamp-1 lowercase">
                            {holderName.toLowerCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <Layers className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                          <span className="text-zinc-400 font-sans font-light line-clamp-1 lowercase">
                            {dosageFormExt.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer regions list */}
                    <div className="flex flex-wrap items-center gap-1 rounded-xl bg-zinc-900/50 px-3 py-1.5 border border-zinc-900 text-xs text-zinc-455">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                      <span className="truncate font-light flex-1 lowercase" title={countriesExt}>
                        {countriesExt.toLowerCase()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
