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
  inlineActionLabel?: string;
}

export function StopCard({ stop, routeId, hideAction = false, className, title, inlineActionLabel }: UniversalStopCardProps) {
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
      <div className={cn("px-4 flex flex-col gap-3", isDone ? "py-4" : hideAction ? "py-4" : "py-5")}>
      {title && (
        <div className="flex items-center justify-between mb-0">
          <h3 className="text-[14px] font-semibold text-[#2B3B63] m-0 font-['Google_Sans_Flex'] flex items-center gap-2">
            {title}
            {title === 'Current Stop' && <span className="relative size-2 rounded-full bg-[#2FA301]"><span className="absolute inset-0 rounded-full bg-[#2FA301] animate-ping opacity-50" /></span>}
          </h3>
        </div>
      )}
      {/* Number + Address */}
      <div className="flex items-center gap-3">
        <div className={cn(
          "rounded-full flex items-center justify-center text-white shrink-0 mt-0.5",
          isDone ? "size-[28px]" : "size-[32px]",
          isDone ? "bg-[#2FA301]" : "bg-[#2B3B63]"
        )}>
          <span className={cn("font-bold", isDone ? "text-[12px]" : "text-[14px]")}>{stop.num}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Address */}
          <h4 className={cn("text-[#2B3B63] font-bold m-0 leading-snug font-['Google_Sans_Flex'] min-w-0", isDone ? "text-[14px]" : "text-[16px]")}>
            <span style={{ fontWeight: 700, fontVariationSettings: "'wght' 700" }}>{stop.address}</span>
            {stop.status === 'Servicing' && <span className="h-5 px-2 ml-1.5 rounded-full bg-[#2563EB] text-white text-[10px] font-semibold inline-flex align-middle items-center whitespace-nowrap">Arrived</span>}
            {isDone && <span className="h-5 px-2 ml-1.5 rounded-full bg-[#2FA301] text-white text-[10px] font-semibold inline-flex align-middle items-center whitespace-nowrap">Done</span>}
          </h4>
          {isDone && <ChevronDown size={22} strokeWidth={2.25} className="-rotate-90 text-[#7F8795] shrink-0 ml-auto" />}
        </div>
      </div>

      {/* Work Orders section */}
      <div className={cn("flex flex-col mt-1 pt-3 border-t", isDone ? "hidden" : "border-[#E8E9F1]")}>
        {visibleWOs.map((wo, i) => (
          <div key={wo.id} className={cn("pb-3 border-b border-[#F2F4F7] last:border-0 last:pb-0", i > 0 && "pt-3")}>
            <div className="text-[13px] leading-5 text-[#71727A] line-clamp-2">
              <span className="inline-flex align-middle items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] pl-1.5 pr-2 py-[2px] rounded-full mr-1.5">
                <div 
                  className="size-[6px] rounded-full shrink-0" 
                  style={{ backgroundColor: ACTION_COLORS[wo.action] || '#6B7280' }}
                />
                <span className="text-[#2B3B63] text-[11px] font-bold uppercase tracking-wider">
                  {wo.action}
                </span>
              </span>
              <span 
                className="inline-flex align-middle text-white text-[11px] leading-5 font-bold px-2 py-[1px] rounded-[6px] mr-1.5"
                style={{ backgroundColor: TYPE_COLORS[wo.type] || '#2B3B63' }}
              >
                {wo.type}
              </span>
              <span className="text-[11px] font-semibold text-[#8A909D] mr-1.5">{wo.id}</span>
              {wo.action !== 'Pickup' && <span className="inline-flex align-middle items-center gap-1 text-[#2B3B63] font-semibold mr-1.5"><User size={13} />{wo.customerName}</span>}
              {wo.unitInfo && (wo.unitInfo.size || wo.unitInfo.modelName) && <span>· {wo.unitInfo.size} {wo.unitInfo.modelName}</span>}
              {wo.status === 'Completed' && (
                <span className="inline-flex align-middle size-[18px] rounded-full bg-[#2FA301] text-white items-center justify-center ml-1" aria-label="Completed">
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                </span>
              )}
              {wo.status === 'Failed' && (
                <Flag size={16} className="inline-block align-middle text-[#f52525] ml-1" />
              )}
            </div>
          </div>
        ))}
        
        {/* Show more/less toggle */}
        {!isDone && hasMultipleWOs && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAllWOs(!showAllWOs);
            }}
            className={cn("flex items-center gap-1 text-[13px] font-semibold font-['Google_Sans_Flex'] bg-transparent border-none cursor-pointer p-0 mt-1 active:opacity-70", isDone ? "text-[#238000]" : "text-[#3B82F6]")}
          >
            {showAllWOs ? (
              <>
                <ChevronUp size={14} />
                Show less
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
      {inlineActionLabel && !isDone && (
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              navigate(linkUrl, { state: { from: location.pathname + location.search } });
            }}
            className={cn("flex-1 min-h-[52px] rounded-[14px] text-[16px] font-semibold cursor-pointer active:scale-[0.99]", inlineActionLabel === 'Continue Stop' ? "bg-[#FF7048] border border-[#FF7048] text-white" : "bg-[#F1F3F7] border border-[#E1E4E9] text-[#2B3B63]")}
          >
            {inlineActionLabel}
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`}
            target="_blank"
            rel="noreferrer"
            onClick={event => event.stopPropagation()}
            className="size-[52px] rounded-[14px] bg-white border border-[#D9DDE4] text-[#FF7048] flex items-center justify-center shrink-0 decoration-none active:scale-95"
            aria-label={`Navigate to Stop ${stop.num}`}
          >
            <Navigation size={19} fill="currentColor" />
          </a>
        </div>
      )}
    </div>
      
      {!hideAction && (
        <div className="sticky bottom-0 bg-white pt-0 pb-4 px-4 z-10 w-full">
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
              <span className="whitespace-nowrap">{stop.status === 'Pending' ? 'View Stop' : 'Continue Stop'}</span>
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
