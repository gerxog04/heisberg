import React from "react";

export default function Footer() {
  return (
    <footer className="mt-20 py-10 border-t border-zinc-900/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-600 font-sans lowercase max-w-[960px] mx-auto w-full px-5" id="footer-main">
      <p className="text-zinc-500 max-w-md text-center sm:text-left leading-relaxed">
        calca is for informational comparison. verify local registrations and consult a provider before switching prescriptions.
      </p>
      <div className="text-zinc-500 tracking-wider hover:text-zinc-400 transition-colors">
        created by kodewt
      </div>
    </footer>
  );
}
