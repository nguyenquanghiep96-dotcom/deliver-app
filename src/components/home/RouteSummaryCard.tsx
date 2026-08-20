import { Link, useNavigate } from 'react-router';
import { ChevronRight, MapPin, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDriver } from '../../DriverContext';

interface RouteSummaryCardProps {
  route: any;
  completedStopsCount: number;
  totalStops: number;
  progressPercentage: number;
  totalDistanceStr: string;
  onInfoClick: (note: string) => void;
  connectedToStop?: boolean;
}

export function RouteSummaryCard({
  route,
  completedStopsCount,
  totalStops,
  progressPercentage,
  totalDistanceStr,
  onInfoClick,
  connectedToStop = false,
}: RouteSummaryCardProps) {
  const navigate = useNavigate();
  const { startRoute } = useDriver();
  return (
    <div className={cn(
      "route-summary-card bg-[#2B3B63] px-4 pt-4 pb-5 flex flex-col gap-3 border border-[#2B3B63] relative z-10",
      "rounded-[20px]"
    )}>
      {/* Header: Route ID + Status */}
      <div className="flex items-center justify-between">
         <Link to={`/route/${route.id}`} className="route-summary-title flex items-center gap-1.5 decoration-none group active:scale-95 transition-transform">
           <h2 className="text-white font-bold text-[20px] m-0 font-['Google_Sans_Flex'] group-hover:text-[#FFB39D] transition-colors">
             {route.name}
           </h2>
           <ChevronRight size={20} className="text-white/45 group-hover:text-[#FFB39D] transition-colors" />
         </Link>
         <div className={cn(
           "route-summary-status h-6 px-2.5 rounded-full text-[11px] font-semibold shrink-0 flex items-center",
           route.status === 'Completed' ? "bg-[#2FA301] text-white" :
           route.status === 'En Route' ? "bg-[#2563EB] text-white" :
           "bg-[#7C3AED] text-white"
         )}>
           {route.status === 'En Route' ? 'In Progress' : route.status === 'Planned' ? 'Scheduled' : 'Completed'}
         </div>
      </div>



      {/* Progress */}
      <div className="route-summary-progress flex flex-col gap-1.5 mt-1">
         <div className="flex justify-between items-center text-[13px] text-white/65 font-['Google_Sans_Flex']">
           <span>Progress</span>
           <span className="font-semibold text-white">{completedStopsCount}/{totalStops} Stops done</span>
         </div>
         <div
           className="w-full bg-white/15 h-[8px] rounded-full overflow-hidden"
           role="progressbar"
           aria-label="Route progress"
           aria-valuemin={0}
           aria-valuemax={100}
           aria-valuenow={Math.round(progressPercentage)}
           aria-valuetext={`${completedStopsCount} of ${totalStops} Stops completed`}
         >
           <div 
             className="h-full bg-[#FF7048] transition-all duration-500 rounded-full"
             style={{ width: `${progressPercentage}%` }} 
           />
         </div>
      </div>

      {/* Distance & Info */}
      <div className="flex items-center justify-between mt-1 text-white/65 text-[13px] font-['Google_Sans_Flex']">
         <div className="flex items-center gap-2">
           <MapPin size={14} className="text-white/50"/>
           <span className="text-[14px] font-semibold text-white">Total Distance · {totalDistanceStr}</span>
         </div>
         <button 
           onClick={() => onInfoClick(route.routeNote || 'No notes available for this route.')}
           className="relative size-10 text-white bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-transform cursor-pointer border border-white/15"
           aria-label="Show Route note"
         >
           <Info size={18} strokeWidth={1.5} aria-hidden="true" />
           {route.routeNote && <span className="absolute top-1 right-1 size-2.5 rounded-full bg-[#FF7048] border-2 border-[#2B3B63]" />}
         </button>
      </div>
      {route.status === 'Planned' && (
        <button
          type="button"
          onClick={() => {
            startRoute(route.id);
            navigate(`/route/${route.id}`, { state: { from: '/home?tab=home' } });
          }}
          className="w-full min-h-[52px] rounded-[14px] border-none bg-[#FF7048] text-white text-[16px] font-semibold flex items-center justify-center decoration-none active:scale-[0.99] transition-transform cursor-pointer"
        >
          Start Route
        </button>
      )}
    </div>
  );
}
