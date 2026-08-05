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
  
  const getStatusStyles = (woStatus: string) => {
    switch (woStatus) {
      case "Pending":
        return "text-[#f09a11] bg-[#f09a1133] border-[#f09a1133]";
      case "Completed":
        return "text-[#2FA301] bg-[#2FA3011A] border-[#2FA301]";
      case "Failed":
        return "text-[#FF3B30] bg-[#FF3B301A] border-[#FF3B30]";
      default:
        return "text-[#71727A] bg-[#E8E9F1] border-[#E8E9F1]";
    }
  };

  return (
    <div className={cn(
      "bg-white flex flex-col gap-[9px] p-[12px] rounded-[24px] shadow-sm w-full transition-transform active:scale-[0.98]",
      isCompleted && "opacity-80"
    )}>
      <div className="flex flex-col gap-[10px] w-full">
        {/* Stop Info Row */}
        <div className="flex gap-[6px] items-center pb-[10px] relative border-b border-[#e8e9f1]">
          <div className={cn(
            "flex items-center justify-center shrink-0 size-[36px] rounded-[21px]",
            isCompleted ? "bg-[#2FA301] text-white" : "bg-[#e8e9f1] text-[#71727a]"
          )}>
            <span className="font-bold text-[14px]">{number}</span>
          </div>
          
          <div className="flex flex-1 gap-[16px] items-center min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-[#2f3036] text-[16px] font-semibold truncate leading-normal font-['Google_Sans_Flex']" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
                {address}
              </p>
            </div>
            <ChevronRight size={16} className="text-[#71727A] shrink-0" />
          </div>
        </div>

        {/* Work Orders List */}
        <div className="flex flex-col gap-[6px] w-full">
          {workOrders.map((wo) => (
            <div key={wo.id} className="flex gap-[8px] items-center w-full">
              <div className="bg-[#e8e9f1] px-[8px] py-[3px] rounded-[6px] border border-[#e8e9f1] shrink-0">
                <p className="text-[#2f3036] text-[11px] font-semibold whitespace-nowrap">{wo.action}</p>
              </div>
              
              <div className="flex flex-1 gap-[2px] items-center min-w-0">
                <User size={12} className="text-[#71727A] shrink-0" />
                <p className="text-[#71727a] text-[12px] font-medium truncate font-['Google_Sans_Flex']" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
                  {wo.customerName}
                </p>
              </div>

              <div className={cn(
                "px-[8px] py-[3px] rounded-[6px] border border-solid shrink-0",
                getStatusStyles(wo.status)
              )}>
                <p className="text-[10px] font-semibold font-['Google_Sans_Flex']" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
                  {wo.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
