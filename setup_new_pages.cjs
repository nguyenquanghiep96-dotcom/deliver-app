const fs = require('fs');

// 1. Create StopListItem.tsx
const stopListItemCode = `import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import imgUserIcon from '../assets/images/image-13.svg';

export const cleanStopType = (type: string) => {
  if (type === 'Delivery & Install') return 'Delivery & Install';
  return type;
};

export default function StopListItem({ stop }: { stop: any }) {
  const isDone = stop.status === 'Done';
  const statusColor = isDone ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" : "bg-[rgba(240,154,17,0.2)] text-[#f09a11] border-[rgba(240,154,17,0.2)]";
  const statusText = isDone ? "Completed" : "Pending";

  return (
    <div className="bg-white rounded-[24px] p-[12px] w-full border border-transparent shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[6px] items-center pb-[10px] border-b border-[#e8e9f1]">
          <div className="bg-[#e8e9f1] w-[36px] h-[36px] rounded-[21px] flex items-center justify-center text-[#71727a] font-bold text-[14px] shrink-0 font-['Proxima_Nova']">
            {stop.num}
          </div>
          <span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex']">{stop.address}</span>
          <Link to={\`/stop/\${stop.id}\`} className="text-[#71727a] hover:text-[#2f3036] shrink-0 w-[16px] h-[16px] flex items-center justify-center">
            <ChevronRight size={16} strokeWidth={3} />
          </Link>
        </div>
        <div className="flex items-center gap-[8px] flex-wrap select-none w-full">
          <div className="bg-[#e8e9f1] px-[8px] py-[3px] rounded-[6px] text-[11px] font-semibold text-[#2f3036] shrink-0 font-['Proxima_Nova'] border border-[#e8e9f1]">
            {cleanStopType(stop.type)}
          </div>
          <div className="flex items-center gap-[2px] truncate text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex'] flex-1">
            <img src={imgUserIcon} className="w-[12px] h-[12px]" alt="user" /> {stop.customerName}
          </div>
          <div className={\`px-[8px] py-[3px] rounded-[6px] text-[10px] font-semibold shrink-0 font-['Google_Sans_Flex'] border \${statusColor}\`}>
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
if(!fs.existsSync('src/components')) fs.mkdirSync('src/components');
fs.writeFileSync('src/components/StopListItem.tsx', stopListItemCode);

// 2. Create UpcomingStopsList.tsx
const upcomingStopsListCode = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StopListItem from './components/StopListItem';
import { mockRoutes } from './data/mockData';

export default function UpcomingStopsList() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeRoute = mockRoutes.find(r => r.status === 'En Route') || mockRoutes.find(r => r.status === 'Planned' && r.date === 'Today');
  
  if (!activeRoute) return null;

  const pendingStops = activeRoute.stops.filter(s => s.status === 'Pending' || s.status === 'Servicing');
  const activeStopIndex = pendingStops.findIndex(s => s.status === 'Servicing' || s.status === 'Pending');
  const upcomingStops = pendingStops.slice(activeStopIndex + 1);

  return (
    <div className="min-h-screen bg-[#F2F2F6] flex flex-col font-['Google_Sans_Flex']">
      <div className={\`h-[110px] px-4 pt-[60px] pb-4 flex justify-between items-center w-full shrink-0 z-50 font-['Google_Sans_Flex'] sticky top-0 transition-all duration-150 \${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-[#F2F2F6] border-transparent'}\`}>
        <button 
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 active:scale-90 transition-transform shrink-0 cursor-pointer text-[#2F3036]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <span className="text-[18px] font-semibold text-[#2F3036] truncate px-2 absolute left-1/2 -translate-x-1/2">
          Upcoming Stops
        </span>

        <div className="w-11 h-11 shrink-0" />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-12">
        {upcomingStops.map(stop => (
          <StopListItem key={stop.id} stop={stop} />
        ))}
        {upcomingStops.length === 0 && (
          <p className="text-center text-[#71727a] mt-10">No upcoming stops</p>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/UpcomingStopsList.tsx', upcomingStopsListCode);

// 3. Create CompletedStopsList.tsx
const completedStopsListCode = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StopListItem from './components/StopListItem';
import { mockRoutes } from './data/mockData';

export default function CompletedStopsList() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeRoute = mockRoutes.find(r => r.status === 'En Route') || mockRoutes.find(r => r.status === 'Planned' && r.date === 'Today');
  
  if (!activeRoute) return null;

  const completedStops = activeRoute.stops.filter(s => s.status === 'Done');

  return (
    <div className="min-h-screen bg-[#F2F2F6] flex flex-col font-['Google_Sans_Flex']">
      <div className={\`h-[110px] px-4 pt-[60px] pb-4 flex justify-between items-center w-full shrink-0 z-50 font-['Google_Sans_Flex'] sticky top-0 transition-all duration-150 \${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-[#F2F2F6] border-transparent'}\`}>
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
`;
fs.writeFileSync('src/CompletedStopsList.tsx', completedStopsListCode);

console.log('Created StopListItem, UpcomingStopsList, CompletedStopsList');
