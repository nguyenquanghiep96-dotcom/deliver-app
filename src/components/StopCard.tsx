import { ChevronRight, User } from "lucide-react";
import { cn } from "../lib/utils";
import type { WorkOrder } from "../mockData";

interface StopCardProps {
  number: number;
  address: string;
  workOrders: WorkOrder[];
  status: "Pending" | "Servicing" | "Done";
  isCompleted?: boolean;
}

export function StopCard({ 
  number, 
  address, 
  workOrders,
  status,
  isCompleted = false 
}: StopCardProps) {
  
  // Derive stop type from first work order action, fallback to 'STOP'
  const primaryAction = workOrders[0]?.action?.toUpperCase() || 'STOP';
  
  const getBadgeStyles = (action: string) => {
    switch (action) {
      case 'PICKUP':
        return { bg: '#F2F2F3', text: '#2F3036', dot: '#2F3036' };
      case 'DROPOFF':
        return { bg: '#FFF7EE', text: '#FF7048', dot: '#FF7048' };
      case 'VISIT':
        return { bg: '#F2F2F3', text: '#71727A', dot: '#71727A' };
      case 'START':
        return { bg: '#E9F9EE', text: '#2FA301', dot: '#2FA301' };
      case 'END':
        return { bg: '#F2F2F3', text: '#2F3036', dot: '#2F3036' };
      default:
        return { bg: '#F2F2F3', text: '#71727A', dot: '#71727A' };
    }
  };

  const badgeStyle = getBadgeStyles(primaryAction);

  // Derive location name (use customer name of first work order if available)
  const locationName = workOrders[0]?.customerName ? `${workOrders[0].customerName} Residence` : address;

  return (
    <div className={cn(
      "bg-white flex flex-col gap-[12px] p-[16px] rounded-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] w-full transition-transform active:scale-[0.98] border border-transparent",
      isCompleted && "opacity-60"
    )}>
      {/* ── Stop Header ── */}
      <div className="flex gap-[12px] items-start relative border-b border-[#e8e9f1] pb-[12px]">
        {/* Number Box */}
        <div className={cn(
          "flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-[6px] mt-1",
          isCompleted ? "bg-[#2FA301] text-white" : "bg-[#2F3036] text-white"
        )}>
          <span className="font-bold text-[14px]">{number}</span>
        </div>
        
        <div className="flex flex-col flex-1 gap-[4px] min-w-0">
          <div className="flex items-center gap-[8px]">
            {/* Type Badge */}
            <div 
              className="flex items-center gap-[4px] px-[8px] py-[2px] rounded-full"
              style={{ backgroundColor: badgeStyle.bg }}
            >
              <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: badgeStyle.dot }} />
              <span className="text-[10px] font-bold tracking-wide" style={{ color: badgeStyle.text }}>
                {primaryAction}
              </span>
            </div>
            
            {/* Location Name */}
            <span className="text-[#2F3036] text-[16px] font-bold truncate font-['Google_Sans_Flex']">
              {locationName}
            </span>
          </div>
          
          {/* Full Address */}
          <p className="text-[#71727A] text-[13px] font-medium leading-snug font-['Google_Sans_Flex'] m-0 pr-8">
            {address}
          </p>
        </div>

        {/* Status indicator on the right */}
        {status !== 'Pending' && (
          <div className="absolute top-0 right-0">
            <span className={cn(
              "text-[11px] font-bold px-[8px] py-[4px] rounded-[6px]",
              status === 'Done' ? "bg-[#2FA3011A] text-[#2FA301]" : "bg-[#f09a1133] text-[#f09a11]"
            )}>
              {status}
            </span>
          </div>
        )}
      </div>

      {/* ── Work Orders List ── */}
      {workOrders.length > 0 && (
        <div className="flex flex-col gap-[10px] w-full pt-[4px]">
          {workOrders.map((wo) => (
            <div key={wo.id} className="flex gap-[10px] items-start w-full">
              {/* Dark Blue Type Badge */}
              <div className="bg-[#1C2024] px-[8px] py-[4px] rounded-[6px] shrink-0 mt-[2px]">
                <p className="text-white text-[11px] font-bold whitespace-nowrap m-0">{wo.type}</p>
              </div>
              
              <div className="flex flex-col flex-1 min-w-0 gap-[2px]">
                {/* Unit Details */}
                <p className="text-[#2F3036] text-[13px] font-semibold truncate font-['Google_Sans_Flex'] m-0">
                  {wo.unitInfo.size}{wo.unitInfo.modelName ? ` ${wo.unitInfo.modelName}` : ''}
                  <span className="text-[#71727A] font-normal"> · {wo.unitInfo.serial}</span>
                </p>
                {/* Customer Name */}
                <p className="text-[#8F9098] text-[12px] font-medium truncate font-['Google_Sans_Flex'] m-0">
                  {wo.customerName}
                </p>
              </div>

              {/* WO ID */}
              <div className="shrink-0 pl-[8px] pt-[2px]">
                <p className="text-[#FF7048] text-[12px] font-bold font-['Google_Sans_Flex'] m-0">
                  {wo.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
