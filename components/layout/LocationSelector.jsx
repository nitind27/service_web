'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  Check,
  X,
  Compass,
  Navigation,
  Sparkles,
  Building2,
  Loader2,
  LocateFixed,
} from 'lucide-react';

export const ALL_INDIAN_STATES_DATA = [
  {
    state: 'Pan-India',
    isSpecial: true,
    cities: ['All India (Nationwide)'],
  },
  {
    state: 'Delhi NCR',
    cities: ['New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Greater Noida'],
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand'],
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Navi Mumbai', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  },
  {
    state: 'Karnataka',
    cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Davanagere', 'Ballari', 'Shimoga'],
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Bareilly', 'Aligarh', 'Gorakhpur', 'Noida', 'Ghaziabad'],
  },
  {
    state: 'Haryana',
    cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Rohtak', 'Hisar', 'Sonipat', 'Panchkula'],
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar'],
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar'],
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Bardhaman', 'Kharagpur', 'Malda'],
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur'],
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam'],
  },
  {
    state: 'Bihar',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Ara'],
  },
  {
    state: 'Kerala',
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Alappuzha'],
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kakinada', 'Rajahmundry'],
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
  },
  {
    state: 'Jharkhand',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih'],
  },
  {
    state: 'Chhattisgarh',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Durg', 'Jagdalpur'],
  },
  {
    state: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Nainital', 'Kashipur'],
  },
  {
    state: 'Himachal Pradesh',
    cities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi'],
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'],
  },
  {
    state: 'Jammu & Kashmir (UT)',
    cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'],
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  },
  {
    state: 'Chandigarh (UT)',
    cities: ['Chandigarh (Tricity)'],
  },
  {
    state: 'Tripura',
    cities: ['Agartala', 'Udaipur', 'Dharmanagar'],
  },
  {
    state: 'Meghalaya',
    cities: ['Shillong', 'Tura', 'Jowai'],
  },
  {
    state: 'Manipur',
    cities: ['Imphal', 'Churachandpur', 'Thoubal'],
  },
  {
    state: 'Nagaland',
    cities: ['Kohima', 'Dimapur', 'Mokokchung'],
  },
  {
    state: 'Mizoram',
    cities: ['Aizawl', 'Lunglei', 'Champhai'],
  },
  {
    state: 'Arunachal Pradesh',
    cities: ['Itanagar', 'Naharlagun', 'Pasighat'],
  },
  {
    state: 'Sikkim',
    cities: ['Gangtok', 'Namchi', 'Geyzing'],
  },
  {
    state: 'Ladakh (UT)',
    cities: ['Leh', 'Kargil'],
  },
  {
    state: 'Puducherry (UT)',
    cities: ['Puducherry', 'Karaikal'],
  },
];

export const POPULAR_CITIES = [
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Noida',
];

export default function LocationSelector({ value, onChange, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(value || 'New Delhi');
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize and auto-detect real location on mount
  useEffect(() => {
    async function initLocation() {
      const saved = localStorage.getItem('jeevanseva_selected_city');
      if (saved) {
        setSelectedLocation(saved);
        if (onChange) onChange(saved);
      }

      // Live Detection via internal API
      try {
        const res = await fetch('/api/location/detect');
        const data = await res.json();
        if (data.success && data.data) {
          setDetectedLocation(data.data);

          // If no previous custom selection saved, auto-select detected city & state
          if (!saved) {
            const autoDetected = data.data.city && data.data.state
              ? `${data.data.city}, ${data.data.state}`
              : data.data.formatted || 'New Delhi';

            setSelectedLocation(autoDetected);
            localStorage.setItem('jeevanseva_selected_city', autoDetected);
            if (onChange) onChange(autoDetected);
          }
        }
      } catch (err) {
        console.warn('Auto location detect error:', err);
      }
    }

    initLocation();
  }, []);

  // Update if external prop changes
  useEffect(() => {
    if (value && value !== selectedLocation) {
      setSelectedLocation(value);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (locName) => {
    setSelectedLocation(locName);
    localStorage.setItem('jeevanseva_selected_city', locName);
    if (onChange) onChange(locName);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Perform Real GPS Detection with IP fallback
  const handleDetectLocation = async () => {
    setDetecting(true);

    const performIpFallback = async () => {
      try {
        const res = await fetch('/api/location/detect');
        const data = await res.json();
        if (data.success && data.data) {
          setDetectedLocation(data.data);
          const locStr = `${data.data.city}, ${data.data.state}`;
          handleSelect(locStr);
        } else {
          handleSelect('New Delhi, Delhi');
        }
      } catch {
        handleSelect('New Delhi, Delhi');
      } finally {
        setDetecting(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`/api/location/detect?lat=${latitude}&lng=${longitude}`);
            const data = await res.json();
            if (data.success && data.data) {
              setDetectedLocation(data.data);
              const locStr = `${data.data.city}, ${data.data.state}`;
              handleSelect(locStr);
            } else {
              await performIpFallback();
            }
          } catch {
            await performIpFallback();
          } finally {
            setDetecting(false);
          }
        },
        async () => {
          // Permission denied or GPS timeout -> fallback to Network IP detection
          await performIpFallback();
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      await performIpFallback();
    }
  };

  // Filter states and cities
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return ALL_INDIAN_STATES_DATA;
    const q = searchQuery.toLowerCase().trim();

    return ALL_INDIAN_STATES_DATA.map((st) => {
      const stateMatches = st.state.toLowerCase().includes(q);
      const matchingCities = st.cities.filter((c) => c.toLowerCase().includes(q));

      if (stateMatches) return st;
      if (matchingCities.length > 0) {
        return { ...st, cities: matchingCities };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 rounded-full border transition-all cursor-pointer ${
          compact
            ? 'px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border-slate-200'
            : 'px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs hover:border-brand-royal/40'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-orange-100 text-accent-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <MapPin className="w-3 h-3 text-accent-600" />
        </span>
        <div className="text-left flex items-baseline gap-1">
          <span className="font-extrabold text-slate-800 tracking-tight max-w-[150px] truncate" title={selectedLocation}>
            {selectedLocation}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-brand-royal transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-royal' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="fixed sm:absolute left-2 sm:left-0 top-16 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-[440px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-brand-royal to-blue-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide leading-tight">Select Location</h4>
                <p className="text-[10px] text-blue-200">Doorstep services available across 28+ States</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Detected Location Banner (Live GPS / IP) */}
          {detectedLocation && (
            <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between shadow-2xs animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                  <Navigation className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Live Detected Location
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="font-extrabold text-xs text-slate-900 leading-tight">
                    {detectedLocation.city}, {detectedLocation.state}
                  </p>
                  {detectedLocation.source && (
                    <span className="text-[10px] text-slate-500 block">
                      Source: {detectedLocation.source === 'gps' ? 'Exact GPS Satellite' : 'Network IP'}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelect(`${detectedLocation.city}, ${detectedLocation.state}`)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition"
              >
                Use This
              </button>
            </div>
          )}

          {/* Search Box & GPS Button */}
          <div className="p-3 bg-slate-50 border-b border-slate-200/80 space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search state or city (e.g. Gujarat, Ahmedabad, Maharashtra, Pune)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-xs bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-brand-royal focus:ring-2 focus:ring-blue-100 transition shadow-2xs font-medium text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-blue-50 text-brand-royal rounded-xl border border-dashed border-blue-300 text-xs font-bold transition shadow-2xs hover:border-brand-royal"
            >
              {detecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-royal" />
                  <span>Detecting GPS Coordinates &amp; State...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3.5 h-3.5 text-accent-500" />
                  <span>Detect Current State &amp; City (GPS Auto-Detect)</span>
                </>
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
            {/* Popular Cities Horizontal Chips */}
            {!searchQuery.trim() && (
              <div className="p-2 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Popular Metro Cities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.map((city) => {
                    const isSelected = selectedLocation.includes(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelect(city)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-brand-royal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                        <span>{city}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Indian States & Cities List */}
            <div className="p-2 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {searchQuery.trim() ? `Search Results (${filteredData.length} Regions)` : 'All 28 Indian States & UTs'}
              </span>

              {filteredData.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <p className="font-semibold text-xs">No matching state or city found</p>
                  <p className="text-[11px]">Try searching with a different spelling or select Pan-India.</p>
                </div>
              ) : (
                filteredData.map((st) => (
                  <div key={st.state} className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-royal flex-shrink-0" />
                        {st.state}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelect(st.state)}
                        className="text-[10px] font-bold text-brand-royal hover:underline px-1.5 py-0.5 rounded"
                      >
                        Select Entire State
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {st.cities.map((city) => {
                        const isSelected = selectedLocation === city || selectedLocation.startsWith(city) || selectedLocation === st.state;
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleSelect(`${city}, ${st.state}`)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                              isSelected
                                ? 'bg-brand-royal text-white font-bold'
                                : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200/80 hover:border-brand-royal/40'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                            <span>{city}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
            <span>Doorstep verified technicians available in your selected city &amp; state.</span>
          </div>
        </div>
      )}
    </div>
  );
}
