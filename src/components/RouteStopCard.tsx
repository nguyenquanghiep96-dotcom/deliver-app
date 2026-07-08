import { MapPin, ChevronRight, User, Phone, Navigation } from "lucide-react";
import { cn, cleanStopType } from "../lib/utils";

export default function RouteStopCard({ stop }: { stop: any }) {
  const isServicing = stop.status === 'Servicing';
  const isCompleted = stop.status === 'Done';
  
  // Status styling configurations from Figma
  let statusBg = "rgba(239, 154, 11, 0.20)";
  let statusText = "#F09A11";
  let statusBorder = "1px solid rgba(239, 154, 11, 0.20)";
  let statusLabel = "Pending";
  
  if (isServicing) {
    statusBg = "rgba(59, 130, 246, 0.20)";
    statusText = "#3B82F6";
    statusBorder = "1px solid #3B82F6";
    statusLabel = "Arrived";
  } else if (isCompleted) {
    statusBg = "rgba(47, 163, 1, 0.20)";
    statusText = "#2FA301";
    statusBorder = "1px solid rgba(47, 163, 1, 0.20)";
    statusLabel = "Done";
  }

  // Stop circle styles from Figma
  let stopCircleBg = "bg-[#E8E9F1]";
  let stopCircleText = "text-[#71727A]";
  let stopCircleOutline = "";

  if (isServicing) {
    stopCircleBg = "bg-[#FF7048]";
    stopCircleText = "text-white";
    stopCircleOutline = "2px solid #FFAC95";
  } else if (isCompleted) {
    stopCircleBg = "bg-[rgba(47,163,1,0.20)]";
    stopCircleText = "text-[#2FA301]";
  }

  return (
    <div
      className={`bg-white rounded-[24px] p-[12px] w-full transition-transform active:scale-[0.98] flex flex-col gap-[9px]`}
      style={{
        boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)',
        outline: '2px solid white',
        outlineOffset: '-2px',
      }}
    >
      {/* Figma: Inner content block */}
      <div className="w-full flex flex-col gap-[6px]">
        {/* Row 1: Header - Stop number + Type + Status + Chevron */}
        <div className="self-stretch pb-[10px] border-b border-[#E8E9F1] flex items-center gap-[8px]">
          <div
            style={{
              outline: stopCircleOutline || undefined,
            }}
            className={cn("flex items-center justify-center shrink-0 size-[32px] rounded-[21px] font-['Proxima_Nova'] font-bold text-[14px]", stopCircleBg, stopCircleText)}
          >
            {stop.num}
          </div>
          <div className="flex-1 flex flex-col justify-center items-start gap-[3px] min-w-0">
            <div className="flex items-center gap-[12px] w-full">
              <span className="font-semibold text-[14px] text-[#2F3036] font-['Google_Sans_Flex'] truncate">
                {cleanStopType(stop.type)}
              </span>
              <div 
                className="px-[6px] py-[3px] rounded-[6px] flex items-center justify-center shrink-0"
                style={{
                  background: statusBg,
                  outline: statusBorder,
                  outlineOffset: '-1px'
                }}
              >
                <span className="text-[10px] font-semibold font-['Google_Sans_Flex']" style={{ color: statusText }}>
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#71727A] shrink-0" />
        </div>

        {/* Row 2, 3, 4: Stop main details */}
        <div className="self-stretch flex flex-col gap-[8px]">
          {/* Address */}
          <div className="self-stretch flex flex-col gap-[2px]">
            <div className="self-stretch flex items-center gap-[5px]">
              <MapPin size={16} className="text-[#2F3036] shrink-0" />
              <span className="flex-1 text-[16px] font-semibold text-[#2F3036] font-['Google_Sans_Flex'] leading-[1.25]">
                {stop.address}
              </span>
            </div>
            {/* Unit size info */}
            {stop.unitInfo && (stop.unitInfo.serial || stop.unitInfo.size) && (
              <div className="self-stretch flex items-start gap-[6px]">
                <span className="flex-1 text-[14px] font-semibold text-[#FF7048] font-['Google_Sans_Flex'] leading-[1.25]">
                  #{stop.unitInfo.serial}{stop.unitInfo.size ? ` • ${stop.unitInfo.size}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {stop.notes && (
            <div 
              className="self-stretch px-[10px] py-[6px] bg-[rgba(255,112,72,0.10)] rounded-[10px] border-l-[2px] border-[#FF7048] flex items-start gap-[6px]"
            >
              <div className="flex-1 flex flex-col gap-[2px]">
                <p className="self-stretch text-[14px] text-[#71727a] font-['Google_Sans_Flex'] leading-[1.4] line-clamp-2">
                  {stop.notes}
                </p>
              </div>
            </div>
          )}

          {/* Footer - Customer + Phone + Navigate */}
          <div className="self-stretch flex items-center gap-[16px] pt-1">
            {/* Customer name */}
            <div className="flex-1 bg-white overflow-hidden flex items-center gap-[6px] min-w-0">
              <User size={16} className="text-[#71727A] shrink-0" />
              <span className="flex-1 font-medium text-[12px] text-[#71727a] font-['Google_Sans_Flex'] truncate">
                {stop.customerName}
              </span>
            </div>
            {/* Phone */}
            {stop.customerPhone && (
              <a
                href={`tel:${stop.customerPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="px-[8px] py-[8px] rounded-[10px] flex items-center justify-center gap-[6px] shrink-0 no-underline"
                style={{
                  outline: '1px solid #C5C6CC',
                  outlineOffset: '-1px'
                }}
              >
                <Phone size={12} className="text-[#71727A]" />
                <span className="font-medium text-[12px] text-[#71727a] font-['Google_Sans_Flex']">
                  {stop.customerPhone}
                </span>
              </a>
            )}
            {/* Map Direction */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="size-[40px] bg-[#2F3036] rounded-[46px] flex items-center justify-center shrink-0 no-underline active:scale-95 transition-transform"
            >
              <Navigation size={18} className="text-white" fill="white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
