import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const handlePageLink = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant/30 w-full mt-lg">
      <div className="max-w-container-max mx-auto px-gutter py-md flex flex-col md:flex-row justify-between items-center gap-md">
        {/* Left: Brand logo & statement */}
        <div className="flex flex-col md:flex-row items-center gap-md text-center md:text-left">
          <button
            onClick={() => handlePageLink('HOME')}
            className="font-display text-xl tracking-tight text-on-surface dark:text-inverse-on-surface font-bold cursor-pointer hover:opacity-80"
          >
            Trendora
          </button>
          <span className="hidden md:inline text-outline-variant/50">|</span>
          <p className="font-sans text-[11px] text-footer-text max-w-md md:max-w-full">
            {/* max-w-xs md:max-w-md */}
            Elevated essentials for the modern minimalist. Curating structural precision and sustainable luxury.
          </p>
        </div>

        {/* Right: Curated short navigation links */}
        <div className="flex flex-wrap justify-center gap-sm md:gap-md font-sans text-xs font-semibold tracking-wider text-footer-text uppercase">
          <button onClick={() => handlePageLink('HOME')} className="hover:text-primary transition-colors cursor-pointer">
            Collection
          </button>
          <button onClick={() => handlePageLink('TRACK_ORDER')} className="hover:text-primary transition-colors cursor-pointer">
            Track Order
          </button>
          <button onClick={() => handlePageLink('DASHBOARD')} className="hover:text-primary transition-colors cursor-pointer">
            Membership
          </button>
          <button onClick={() => handlePageLink('CONTACT')} className="hover:text-primary transition-colors cursor-pointer">
            Concierge
          </button>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter py-sm border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-sm text-[10px]">
        <p className="font-sans text-footer-text/80">
          © 2026 Trendora. All rights reserved. Curated Offline-First Client Architecture.
        </p>
        <div className="flex gap-sm text-footer-text/50">
          <span className="material-symbols-outlined text-2xl">payments</span>
          <span className="material-symbols-outlined text-2xl">credit_card</span>
          <span className="material-symbols-outlined text-2xl">wallet</span>
        </div>
      </div>
    </footer>
  );
}
