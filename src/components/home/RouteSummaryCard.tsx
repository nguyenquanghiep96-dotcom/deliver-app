import { Link } from 'react-router';
import { ChevronRight, MapPin, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RouteSummaryCardProps {
  route: any;
  completedWOsCount: number;
  totalWOs: number;
  progressPercentage: number;
  remainingDistanceStr: string;
  onInfoClick: (note: string) => void;
}

export function RouteSummaryCard({
  route,
  completedWOsCount,
  totalWOs,
  progressPercentage,
  remainingDistanceStr,
  onInfoClick
}: RouteSummaryCardProps) {
  return (
    <div className="route-summary-card bg-[#E4E6EC] rounded-[24px] p-4 flex flex-col gap-3 border border-transparent relative z-10">
      {/* Header: Route ID + Status */}
      <div className="flex items-center justify-between">
         <Link to={`/route/${route.id}`} className="route-summary-title flex items-center gap-1.5 decoration-none group active:scale-95 transition-transform">
           <h2 className="text-[#2B3B63] font-bold text-[20px] m-0 font-['Google_Sans_Flex'] group-hover:text-[#FF7048] transition-colors">
             {route.name}
           </h2>
           <ChevronRight size={20} className="text-[#C5C6CC] group-hover:text-[#FF7048] transition-colors" />
         </Link>
         <div className={cn(
           "route-summary-status px-3 py-1.5 rounded-full text-[12px] font-bold shrink-0 shadow-sm flex items-center gap-1.5",
           route.status === 'Completed' ? "bg-white text-[#2FA301]" :
           route.status === 'En Route' ? "bg-[#2563eb] text-white" :
           "bg-white text-[#F09A11]"
         )}>
           {route.status === 'En Route' && (
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
           )}
           {route.status === 'En Route' ? 'In Progress' : route.status === 'Planned' ? 'Scheduled' : 'Completed'}
         </div>
      </div>



      {/* Progress */}
      <div className="route-summary-progress flex flex-col gap-1.5 mt-1">
         <div className="flex justify-between items-center text-[13px] text-[#71727A] font-['Google_Sans_Flex']">
           <span>Progress</span>
           <span className="font-semibold text-[#2B3B63]">{completedWOsCount}/{totalWOs} Work Orders</span>
         </div>
         <div className="w-full bg-[#d0d4dc] h-[8px] rounded-full overflow-hidden">
           <div 
             className="h-full bg-[#FF7048] transition-all duration-500 rounded-full" 
             style={{ width: `${progressPercentage}%` }} 
           />
         </div>
      </div>

      {/* Distance & Info */}
      <div className="flex items-center justify-between mt-1 text-[#71727A] text-[13px] font-['Google_Sans_Flex']">
         <div className="flex items-center gap-2">
           <MapPin size={14} className="text-[#c5c6cc]"/>
           <span>{remainingDistanceStr} remaining</span>
         </div>
         <button 
           onClick={() => onInfoClick(route.routeNote || 'No notes available for this route.')}
           className="text-[#71727A] bg-white rounded-full p-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer border-none"
         >
           <Info size={16} strokeWidth={1.5} />
         </button>
      </div>
    </div>
  );
}
