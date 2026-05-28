import React from "react";
import { Pill, Sparkles, Tag } from "lucide-react";
import { motion } from "motion/react";
import { DrugProfile } from "../types";

interface DrugProfileCardProps {
  profile: DrugProfile;
}

export default function DrugProfileCard({ profile }: DrugProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 bg-[#1c1c1e]/40 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-[#2c2c2e] relative overflow-hidden shadow-md"
      id="drug-profile-sidebar"
    >
      <div className="absolute top-0 left-0 w-24 h-24 bg-zinc-800/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main active name card */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl font-medium font-sans lowercase">
            ✨ verified substance
          </span>
          <span className="text-zinc-600 font-sans text-[10px] lowercase">active formula</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400 shadow-sm">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h2 id="resolved-inn" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1 lowercase">
              {profile.inn?.toLowerCase()}
            </h2>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-sans lowercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
              <span>generic ingredient</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1c1c1e]/60 border border-[#2c2c2e]/60 p-4 rounded-2xl">
          <span className="text-[10px] text-zinc-500 font-medium block mb-1 font-sans lowercase">
            💡 simply explained:
          </span>
          <p id="resolved-desc" className="text-zinc-300 text-sm leading-relaxed font-sans font-light lowercase">
            {profile.description ? profile.description.toLowerCase() : "no consumer description available for this active compound."}
          </p>
        </div>
      </div>

      {/* Meta indicators */}
      <div className="space-y-5 pt-5 border-t border-zinc-900/60">
        <div>
          <span className="text-[10px] text-zinc-500 font-medium block mb-1.5 font-sans lowercase">
            🎯 main drug class
          </span>
          <p className="text-sm text-zinc-300 font-sans font-normal flex items-center gap-1.5 bg-[#1c1c1e]/60 px-3 py-2 rounded-xl border border-[#2c2c2e]/60 w-fit lowercase">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            {profile.drugClass ? profile.drugClass.toLowerCase() : "general therapeutic agent"}
          </p>
        </div>

        {profile.commonNames && profile.commonNames.length > 0 && (
          <div>
            <span className="text-[10px] text-zinc-500 font-medium block mb-2 font-sans lowercase">
              🏷️ other familiar brands or names
            </span>
            <div className="flex flex-wrap gap-1.5" id="resolved-aliases">
              {profile.commonNames.map((name, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1.5 text-xs bg-[#1c1c1e]/60 hover:bg-[#2c2c2e] border border-[#2c2c2e] text-zinc-400 font-sans rounded-xl transition-all font-light flex items-center gap-1 lowercase"
                >
                  <Tag className="w-3 h-3 text-zinc-600" />
                  {name?.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-600 font-sans lowercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]/60" />
            <span>sourced via rxnav & openfda</span>
          </div>
          <span className="text-zinc-800">id: resolver-active</span>
        </div>
      </div>
    </motion.div>
  );
}
