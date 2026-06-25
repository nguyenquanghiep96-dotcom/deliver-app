import React from 'react';
import { cn } from '../lib/utils';

export function TagBadge({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("px-[8px] py-[3px] rounded-[6px] bg-[#E8E9F1] border border-transparent text-[#2F3036] text-[11px] font-semibold font-['Google_Sans_Flex'] whitespace-nowrap w-fit flex items-center justify-center leading-[normal]", className)}>
      {text}
    </div>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const getColors = () => {
    switch (status) {
      case 'Pending': return 'text-[#D99424] bg-[#FEF1D3] border-[#D99424]';
      case 'Arrived': return 'text-[#4C7BEC] bg-[#DBE7FF] border-[#4C7BEC]';
      case 'Servicing': return 'text-[#8467C8] bg-[#EAE1FB] border-[#8467C8]';
      case 'Done': return 'text-[#419D38] bg-[#DBF1D8] border-[#419D38]';
      case 'Skipped': return 'text-[#8A8D91] bg-[#ECECEE] border-[#8A8D91]';
      case 'Failed': return 'text-[#E0454A] bg-[#FCE1E1] border-[#E0454A]';
      default: return 'text-[#8A8D91] bg-[#ECECEE] border-[#8A8D91]';
    }
  };

  return (
    <div className={cn("px-[8px] py-[3px] rounded-[6px] border border-solid text-[11px] font-semibold font-['Google_Sans_Flex'] whitespace-nowrap w-fit flex items-center justify-center leading-[normal]", getColors(), className)}>
      {status}
    </div>
  );
}
