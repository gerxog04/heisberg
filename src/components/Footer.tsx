import React, { useState } from "react";
import { Heart, X, Sparkles, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <footer className="mt-20 pt-8 pb-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-zinc-500 font-sans lowercase" id="footer-main">
      <div className="flex flex-col gap-1 text-center md:text-left">
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start font-sans text-[10px] text-zinc-650">
          <span>🇺🇸 fda usa</span>
          <span className="text-zinc-800">•</span>
          <span>🇨🇦 health canada</span>
          <span className="text-zinc-800">•</span>
          <span>🇪🇺 ema europe</span>
        </div>
        <p className="text-zinc-600 max-w-sm text-xs mt-1 leading-relaxed">
          calca is for exploration and comparison. always check with a licensed healthcare practitioner before changing or substituting any prescriptions.
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-zinc-650">
          <span>made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/5" aria-label="heart" />
          <span>by calca</span>
        </div>

        {/* Version info - Interactive link triggers Apple-style roadmap panel */}
        <button
          onClick={() => setModalOpen(true)}
          className="text-[10px] text-zinc-600 hover:text-white transition-all bg-[#1c1c1e]/45 hover:bg-[#1c1c1e] px-2.5 py-1 rounded-lg border border-[#2c2c2e]/70 cursor-pointer flex items-center gap-1.5 lowercase"
          id="version-trigger-btn"
        >
          <Sparkles className="w-3 h-3 text-[#34c759]" />
          <span>version 1.1</span>
        </button>
      </div>

      {/* Satisfying Apple-style Backdrop Sheet Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 cursor-zoom-out"
            id="roadmap-backdrop"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#1c1c1e] border border-[#2c2c2e] rounded-3xl p-6 md:p-7 space-y-6 text-left cursor-default shadow-2xl"
              id="roadmap-dialog"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-[#0071e3]" />
                  <h4 className="text-base font-bold text-white tracking-tight lowercase">
                    version roadmap
                  </h4>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Version History lists */}
              <div className="space-y-5">
                {/* Version 1.1 current */}
                <div className="space-y-2 relative pl-4 border-l-2 border-[#34c759]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white lowercase">v1.1</span>
                    <span className="text-[10px] text-zinc-500 font-medium lowercase bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-800">latest</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-400 font-light list-none pl-0">
                    <li className="flex items-start gap-1.5">
                      <span className="text-zinc-600">-</span>
                      <span>more target territories added</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-zinc-600">-</span>
                      <span>updated design</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-zinc-600">-</span>
                      <span>minor improvements</span>
                    </li>
                  </ul>
                </div>

                {/* Version 1.0 */}
                <div className="space-y-2 relative pl-4 border-l-2 border-zinc-800">
                  <span className="text-xs font-bold text-zinc-400 block lowercase">v1.0</span>
                  <ul className="space-y-1.5 text-xs text-zinc-500 font-light list-none pl-0">
                    <li className="flex items-start gap-1.5">
                      <span className="text-zinc-700">-</span>
                      <span>created the app</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-2.5 rounded-2xl text-xs font-medium cursor-pointer transition-colors border border-zinc-800 lowercase text-center"
              >
                done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
