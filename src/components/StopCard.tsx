import { Check, ChevronDown, ChevronUp, User, Flag, Navigation } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../lib/utils";
import type { Stop } from "../mockData";
import { ACTION_COLORS, TYPE_COLORS } from "../lib/workOrderStyles";

// Temporarily hidden while the Stop card action hierarchy is being refined.
const SHOW_STOP_CARD_NAVIGATION = false;

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
  const navigate = useNavigate();
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
      "stop-card flex flex-col relative overflow-hidden",
      isDone ? "bg-[#2FA301]/10 border border-[#2FA301]/20" : "bg-white border-y border-black/5",
      className
    )}>
      <div className={cn("px-4 flex flex-col gap-3", isDone ? "py-4" : hideAction ? "pt-4 pb-3" : "py-5")}>
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-bold text-[#2B3B63] m-0 font-['Google_Sans_Flex']">
            {title}
          </h3>
          {title === 'Current Stop' && stop.status === 'Servicing' && (
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
            {hideAction && stop.status === 'Servicing' && (
              <span className="inline-flex align-middle ml-2 px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold leading-4 whitespace-nowrap">
                Arrived
              </span>
            )}
          </h4>
        </div>
      </div>

      {/* Work Orders section */}
      <div className={cn("flex flex-col mt-1 pt-3 border-t", isDone ? "border-[#2FA301]/15" : "border-[#E8E9F1]")}>
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
              <span className="text-[11px] font-semibold text-[#8A909D] shrink-0">{wo.id}</span>

              <div className="flex-1" />
              
              {wo.status === 'Completed' && (
                <span className="size-[18px] rounded-full bg-[#2FA301] text-white flex items-center justify-center shrink-0" aria-label="Completed">
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                </span>
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
            className={cn("flex items-center gap-1 text-[13px] font-semibold font-['Google_Sans_Flex'] bg-transparent border-none cursor-pointer p-0 mt-0.5 active:opacity-70", isDone ? "text-[#238000]" : "text-[#3B82F6]")}
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

      {SHOW_STOP_CARD_NAVIGATION && hideAction && !isDone && (
        <div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`}
            target="_blank"
            rel="noreferrer"
            onClick={event => event.stopPropagation()}
            className="w-full min-h-[40px] px-3 rounded-[10px] bg-[#F4F5F8] border border-[#DFE2E7] text-[#2B3B63] text-[16px] font-semibold no-underline flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            aria-label={`Navigate to Stop ${stop.num}`}
            title="Navigate"
          >
            <Navigation size={16} fill="currentColor" className="text-[#FF7048]" />
            Navigate
          </a>
        </div>
      )}
    </div>
      
      {!hideAction && (
        <div className="sticky bottom-0 bg-white pt-2 pb-4 px-4 z-10 w-full mt-2">
          <div className={cn("grid gap-2", title === 'Suggested Stop' ? "grid-cols-2" : "grid-cols-1")}>
            {title === 'Suggested Stop' && (
              <Link
                to={`/route/${routeId}`}
                state={{ from: location.pathname + location.search }}
                className="min-h-[52px] px-3 rounded-[10px] border border-[#D9DDE4] bg-white text-[#2B3B63] text-[16px] font-semibold decoration-none flex justify-center items-center text-center font-['Google_Sans_Flex'] active:scale-95 transition-transform"
              >
                All Stops
              </Link>
            )}
            <Link
              to={linkUrl}
              state={{ from: location.state ? (location.state as any).from : (location.pathname + location.search) }}
              className="min-h-[52px] bg-[#FF7048] text-white px-3 rounded-[10px] text-[16px] font-semibold decoration-none flex justify-center items-center text-center font-['Google_Sans_Flex'] active:scale-95 transition-transform"
            >
              <span className="whitespace-nowrap">{stop.status === 'Pending' ? 'View Stop' : 'Resume Stop'}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  if (hideAction) {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={() => navigate(linkUrl, { state: { from: location.pathname + location.search } })}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') navigate(linkUrl, { state: { from: location.pathname + location.search } });
        }}
        className="block cursor-pointer active:scale-[0.98] transition-transform"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
