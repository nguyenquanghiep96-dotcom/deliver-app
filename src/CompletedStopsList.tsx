import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import StopListItem from './components/StopListItem';
import { useDriver } from './DriverContext';

export default function CompletedStopsList() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { routes } = useDriver();
  const activeRoute = routes.find(r => r.status === 'En Route') || routes.find(r => r.status === 'Planned' && r.date === 'Today');
  
  if (!activeRoute) return null;

  const completedStops = activeRoute.stops.filter(s => s.status === 'Done');

  return (
    <div className="min-h-screen bg-[#F2F2F6] flex flex-col font-['Google_Sans_Flex']">
      <div className={`h-[110px] px-4 pt-[60px] pb-4 flex justify-between items-center w-full shrink-0 z-50 font-['Google_Sans_Flex'] sticky top-0 transition-all duration-150 ${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-[#F2F2F6] border-transparent'}`}>
        <button 
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 active:scale-90 transition-transform shrink-0 cursor-pointer text-[#2F3036]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <span className="text-[18px] font-semibold text-[#2F3036] truncate px-2 absolute left-1/2 -translate-x-1/2">
          Recent Completed
        </span>

        <div className="w-11 h-11 shrink-0" />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-12">
        {completedStops.map(stop => (
          <StopListItem key={stop.id} stop={stop} />
        ))}
        {completedStops.length === 0 && (
          <p className="text-center text-[#71727a] mt-10">No completed stops</p>
        )}
      </div>
    </div>
  );
}
