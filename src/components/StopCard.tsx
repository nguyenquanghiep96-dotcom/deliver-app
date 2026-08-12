import { ChevronRight, ChevronDown, ChevronUp, User, CheckCircle2, Flag } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "../lib/utils";
import type { Stop } from "../mockData";

// Color map for action dot labels (matching OPSHub website)
const ACTION_COLORS: Record<string, string> = {
  Pickup: '#3B82F6',   // Blue
  Dropoff: '#F97316',  // Orange  
  Visit: '#8B5CF6',    // Purple
  Start: '#6B7280',    // Gray
  End: '#6B7280',      // Gray
};

// Color for WO type badge
const TYPE_COLORS: Record<string, string> = {
  Delivery: '#2B3B63',
  Repo: '#DC2626',
  Repair: '#7C3AED',
  'Lot Transfer': '#6B7280',
  'Welfare Check': '#059669',
  'Private Move': '#0891B2',
  'Payment Collection': '#CA8A04',
};

interface UniversalStopCardProps {
  stop: Stop;
  routeId: string;
  hideAction?: boolean;
  className?: string;
  title?: string;
}

export function StopCard({ stop, routeId, hideAction = false, className, title }: UniversalStopCardProps) {
  const isDone = stop.status === 'Done';
  const linkUrl = `/route/${routeId}/stop/${stop.id}`;
  const location = useLocation();
  const [showAllWOs, setShowAllWOs] = useState(false);
  
  // Filter out Start/End work orders for display
  const displayWOs = stop.workOrders.filter(wo => wo.action !== 'Start' && wo.action !== 'End');
  const hasMultipleWOs = displayWOs.length > 1;
  const previewCount = isDone ? 0 : 1;
  const visibleWOs = showAllWOs ? displayWOs : displayWOs.slice(0, previewCount);
  
  // Get unique actions for the dot labels
  const uniqueActions = Array.from(new Set(displayWOs.map(wo => wo.action)));

  const cardContent = (
    <div className={cn(
      "stop-card bg-white flex flex-col border-y border-black/5 relative overflow-hidden",
      className
    )}>
      {isDone && (
        <div className="bg-[#2FA301] w-full text-white text-[11px] font-bold py-[6px] text-center uppercase tracking-[0.1em]">
          Completed
        </div>
      )}
      <div className={cn("px-4 flex flex-col gap-3", isDone ? "pb-5 pt-3" : "py-5")}>
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-bold text-[#2B3B63] m-0 font-['Google_Sans_Flex']">
            {title}
          </h3>
          {title === 'Current Stop' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#2fa301] uppercase tracking-wider">On Going</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2fa301] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2fa301]"></span>
              </span>
            </div>
          )}
        </div>
      )}
      {/* Number + Address */}
      <div className="flex items-center gap-3">
        <div className={cn(
          "size-[32px] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5",
          isDone ? "bg-[#2FA301]" : "bg-[#2B3B63]"
        )}>
          <span className="font-bold text-[14px]">{stop.num}</span>
        </div>
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {/* Address */}
          <h4 className="text-[#2B3B63] text-[16px] font-bold m-0 leading-snug font-['Google_Sans_Flex']">
            {stop.address}
          </h4>
        </div>
      </div>

      {/* Work Orders section */}
      <div className="flex flex-col mt-1 pt-3 border-t border-[#E8E9F1]">
        {visibleWOs.map((wo, i) => (
          <div key={wo.id} className={cn("flex flex-col gap-1.5 pb-3 border-b border-[#F2F4F7] last:border-0 last:pb-0", i > 0 && "pt-3")}>
            {/* Type badge */}
            <div className="flex items-center gap-2 text-[14px]">
              <div className="flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] pl-1.5 pr-2 py-[2px] rounded-full">
                <div 
                  className="size-[6px] rounded-full shrink-0" 
                  style={{ backgroundColor: ACTION_COLORS[wo.action] || '#6B7280' }}
                />
                <span className="text-[#2B3B63] text-[11px] font-bold uppercase tracking-wider">
                  {wo.action}
                </span>
              </div>
              <span 
                className="text-white text-[11px] font-bold px-2 py-[2px] rounded-[6px] shrink-0"
                style={{ backgroundColor: TYPE_COLORS[wo.type] || '#2B3B63' }}
              >
                {wo.type}
              </span>

              <div className="flex-1" />
              
              {wo.status === 'Completed' && (
                <CheckCircle2 size={16} className="text-[#2FA301] shrink-0" />
              )}
              {wo.status === 'Failed' && (
                <Flag size={16} className="text-[#f52525] shrink-0" />
              )}
            </div>
            {/* Customer & Unit info */}
            <div className="flex items-center gap-2 pl-[4px] text-[13px] text-[#71727A] overflow-hidden">
              <User size={13} className="shrink-0"/>
              <span className="text-[#2B3B63] font-semibold font-['Google_Sans_Flex'] truncate shrink-0 max-w-[120px]">{wo.customerName}</span>
              {wo.unitInfo && (wo.unitInfo.size || wo.unitInfo.modelName) && (
                <span className="truncate">· {wo.unitInfo.size} {wo.unitInfo.modelName}</span>
              )}
            </div>
          </div>
        ))}
        
        {/* Show more/less toggle */}
        {(hasMultipleWOs || (isDone && displayWOs.length > 0)) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAllWOs(!showAllWOs);
            }}
            className="flex items-center gap-1 text-[#3B82F6] text-[13px] font-semibold font-['Google_Sans_Flex'] bg-transparent border-none cursor-pointer p-0 mt-0.5 active:opacity-70"
          >
            {showAllWOs ? (
              <>
                <ChevronUp size={14} />
                Show less
              </>
            ) : isDone ? (
              <>
                <ChevronDown size={14} />
                See work orders
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                {displayWOs.length - 1} more work order{displayWOs.length - 1 > 1 ? 's' : ''}
              </>
            )}
          </button>
        )}
      </div>
    </div>
      
      {!hideAction && (
        <div className="sticky bottom-0 bg-white pt-2 pb-4 px-4 z-10 w-full mt-2">
          <Link 
            to={linkUrl} 
            state={{ from: location.state ? (location.state as any).from : (location.pathname + location.search) }}
            className="bg-[#FF7048] text-white py-[16px] px-6 rounded-[10px] text-[16px] font-semibold decoration-none flex justify-center items-center font-['Google_Sans_Flex'] active:scale-95 transition-transform w-full"
          >
            {stop.status === 'Pending' ? 'Navigate to Stop' : 'Resume Stop'}
          </Link>
        </div>
      )}
    </div>
  );

  if (hideAction) {
    return (
      <Link to={linkUrl} className="block decoration-none active:scale-[0.98] transition-transform">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
