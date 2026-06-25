import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrackOrderProps {
  setActivePage: (page: any) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function TrackOrder({ setActivePage, triggerToast }: TrackOrderProps) {
  const [orderNumber, setOrderNumber] = useState('TR-8942');
  const [email, setEmail] = useState('julian@example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      if (triggerToast) {
        triggerToast('Please provide your genuine order reference and email address.', 'error');
      }
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1000);
  };

  return (
    <div className="pt-20 min-h-screen overflow-x-hidden bg-background">
      {/* Universal Backward Navigation Button */}
      <div className="max-w-container-max mx-auto px-gutter pt-md">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => {
            setActivePage('HOME');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-xs font-display text-[10px] tracking-[0.2em] font-bold text-on-surface-variant uppercase hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg leading-none">west</span>
          <span>Back to Gallery</span>
        </motion.button>
      </div>

      {/* Search Hero Section */}
      <section className="py-lg px-gutter">
        <div className="max-w-5xl mx-auto text-center mb-lg space-y-md w-full">
          <span className="font-display text-[11px] md:text-xs tracking-[0.3em] text-primary uppercase font-bold block">
            Trendora Premium Logistics Gateway
          </span>
          <h1 className="font-display font-bold text-3xl md:text-6xl text-on-surface tracking-tight w-full leading-tight">
            Secure Transit Tracker
          </h1>
          <p className="text-on-surface-variant font-sans text-body-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-light">
            Enter your transaction credentials below to access real-time location data and the expected delivery timeline of your temperature-controlled cargo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-surface-container-low p-md md:p-lg rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-outline-variant/35">
          <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-md items-end">
            <div className="space-y-xs">
              <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant block ml-1 uppercase">
                Order Reference Code
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">tag</span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-12 pr-4 py-4 font-sans text-body-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                  placeholder="e.g. TR-8942"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-xs">
              <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant block ml-1 uppercase">
                Verification Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-12 pr-4 py-4 font-sans text-body-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                  placeholder="email@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-sm">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-inverse-surface text-on-tertiary py-4 rounded-xl font-display font-semibold text-body-md hover:opacity-95 transition-all flex items-center justify-center gap-sm shadow-md cursor-pointer uppercase tracking-wider text-xs"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Retrieving Secure Telemetry...</span>
                  </>
                ) : (
                  <>
                    <span>Query Transit Pipeline</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </section>

      {/* Tracking Results Area */}
      <AnimatePresence>
        {showResults && !isLoading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-container-max mx-auto px-gutter py-md mb-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              {/* Stepper Timeline Log */}
              <div className="lg:col-span-2 space-y-lg">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 pb-md gap-md">
                  <div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-sans text-[10px] font-bold tracking-wider uppercase">
                      In Premium Transit
                    </span>
                    <h2 className="font-display font-bold text-2xl md:text-3xl mt-sm text-on-surface">
                      Consignment {orderNumber}
                    </h2>
                    <p className="text-on-surface-variant font-sans text-body-sm mt-xs">
                      Estimated Handover: <span className="font-bold text-on-surface">Wednesday, Oct 24</span>
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-on-surface-variant font-sans text-[10px] font-bold tracking-wider uppercase mb-1">
                      Logistics Custodian
                    </p>
                    <p className="font-display font-bold text-headline-sm text-primary">Trendora Global Express</p>
                  </div>
                </div>

                {/* Progress Visual Timeline */}
                <div className="py-md overflow-x-auto no-scrollbar bg-surface-container-low p-md rounded-3xl border border-outline-variant/10">
                  <div className="min-w-[600px] relative px-8 pb-4">
                    {/* Background Progress bar lines */}
                    <div className="absolute top-[22px] left-[60px] right-[60px] h-1 bg-surface-container-high rounded-full">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
                    </div>

                    <div className="flex justify-between relative z-10">
                      {/* Received Step */}
                      <div className="flex flex-col items-center text-center w-28">
                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-lg font-bold">check</span>
                        </div>
                        <p className="mt-sm font-sans text-[10px] font-bold text-on-surface uppercase tracking-wider">1. Verified</p>
                        <p className="text-[10px] text-on-surface-variant/70 font-mono mt-xs">Oct 18, 09:12</p>
                      </div>

                      {/* Processed Step */}
                      <div className="flex flex-col items-center text-center w-28">
                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-lg font-bold">check</span>
                        </div>
                        <p className="mt-sm font-sans text-[10px] font-bold text-on-surface uppercase tracking-wider">2. Curated</p>
                        <p className="text-[10px] text-on-surface-variant/70 font-mono mt-xs">Oct 19, 14:45</p>
                      </div>

                      {/* Shipped Step (Current) */}
                      <div className="flex flex-col items-center text-center w-28">
                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-4 ring-primary/20">
                          <span className="material-symbols-outlined text-lg animate-pulse">local_shipping</span>
                        </div>
                        <p className="mt-sm font-sans text-[10px] font-bold text-primary uppercase tracking-wider">3. Dispatched</p>
                        <p className="text-[10px] text-on-surface-variant/70 font-mono mt-xs">Oct 20, 11:30</p>
                      </div>

                      {/* Out for Delivery Step */}
                      <div className="flex flex-col items-center text-center w-28">
                        <div className="w-12 h-12 rounded-full bg-surface-container-high text-outline flex items-center justify-center border border-outline-variant/30">
                          <span className="material-symbols-outlined text-lg">package_2</span>
                        </div>
                        <p className="mt-sm font-sans text-[10px] font-bold text-outline uppercase tracking-wider">4. Handover</p>
                        <p className="text-[10px] text-on-surface-variant/70 font-mono mt-xs">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History list */}
                <div className="bg-surface-bright rounded-3xl p-md md:p-lg border border-outline-variant/20 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-md">
                  <h3 className="font-display font-semibold text-headline-sm text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary text-xl">history</span>
                    Detailed Timeline History
                  </h3>
                  <div className="space-y-md border-l-2 border-outline-variant/30 ml-3 pl-8">
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10"></div>
                      <p className="font-sans text-body-md font-bold text-on-surface">Regional transit clearance — Brooklyn Premium Curation Hub, NY</p>
                      <p className="text-on-surface-variant font-sans text-body-sm">Brooklyn, NY | Oct 21, 04:12 PM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-outline-variant/70"></div>
                      <p className="font-sans text-body-md font-bold text-on-surface-variant">Departed Regional center</p>
                      <p className="text-on-surface-variant font-sans text-body-sm">Newark, NJ | Oct 20, 08:30 PM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-outline-variant/70"></div>
                      <p className="font-sans text-body-md font-bold text-on-surface-variant">Consignment styled, securely packed & dispatched</p>
                      <p className="text-on-surface-variant font-sans text-body-sm">Jersey City, NJ | Oct 20, 11:30 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-outline-variant/70"></div>
                      <p className="font-sans text-body-md font-bold text-on-surface-variant">Order Confirmed and quality check certified</p>
                      <p className="text-on-surface-variant font-sans text-body-sm">Digital Gateway | Oct 18, 09:12 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geo-Map location Card and Mini summary */}
              <div className="space-y-lg">
                <div className="rounded-3xl overflow-hidden border border-outline-variant/30 shadow-md h-[320px] relative group bg-surface-container">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXpJg93snlF-XMWniu16ns-b68ogbQocKkKAEyor-cq-XeFL0KsS3agTDg1YzX2l9GXmdCwDwj8M1RNQt_-DjLXobqGo9MiFclQidFEpVuq_be57dOvcdE_-w71rpEfY5Bu_JxT4VNTPKK6OcFNdVnVxyUufz2ptYryOETyMPMFhvchK2tYoEbCKZ5yLjJMJsxkg_LblZcS4xwn1WpoNC5pApySXFTzMOGNuUDumggY42TJepRyp6oSmPIL68cII1Spcmn5t9hK6IP"
                    alt="Transit Location Map"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-sm rounded-2xl flex items-center gap-sm shadow-md border border-white/20">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-[8px] font-bold text-on-surface-variant uppercase">CURRENT REGION</p>
                      <p className="font-sans text-body-sm font-bold text-on-surface">Brooklyn Transit Hub, NY</p>
                    </div>
                  </div>
                </div>

                {/* Mini Summary */}
                <div className="bg-surface-container-low p-lg rounded-3xl border border-outline-variant/20 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-md">
                  <h3 className="font-display font-semibold text-body-md text-on-surface">Shipment contents</h3>
                  <div className="flex items-center gap-md">
                    <img
                      className="w-16 h-20 object-cover rounded-xl shadow-sm border border-black/5"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDk3Ygeyp7VcHHEVl1MK9IxdZQGU6pRP4ax2Qm7aJsrN1eDsHIuMMiDupWj0s_8pnC7bL2st5pK7ga_e4Ysxlun6t8zmsgW8gZV9WGrUv457nJvGOKFM6Pxm3DcfnWuSMxMrIWq3DEJ15sTCH-I1Qkot4-tngq5sKYwAfv2Mg-jyIdNReTukxlG7jcgF1ripQ5vCcL0gdKirnHH-ZxIQ26UpRdkWrtHXqcz9nwhFzpyn8eC4NcWNkJLSVFcNZ4UBuwffUyjdFm-P3B"
                      alt="Watch details"
                    />
                    <div>
                      <h4 className="font-display font-semibold text-body-sm text-on-surface">Classic Horizon Watch</h4>
                      <p className="text-on-surface-variant font-sans text-[11px] font-semibold">Silver / Midnight Black</p>
                      <p className="font-sans text-body-sm font-bold text-primary mt-1">$249.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
