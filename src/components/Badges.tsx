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
      case 'Pending': return 'text-[#F09A11] bg-[#F09A11]/25 border-[#F09A11]/25';
      case 'Arrived': return 'text-[#3B82F6] bg-[#3B82F6]/25 border-[#3B82F6]/25';
      case 'Servicing': return 'text-[#6A65D5] bg-[#6A65D5]/25 border-[#6A65D5]/25';
      case 'Done': 
      case 'Completed': return 'text-[#2FA301] bg-[#2FA301]/25 border-[#2FA301]/25';
      case 'Shipped':
      case 'Skipped': return 'text-[#7E8590] bg-[#7E8590]/25 border-[#7E8590]/25';
      case 'Failed': return 'text-[#F12428] bg-[#F12428]/25 border-[#F12428]/25';
      default: return 'text-[#7E8590] bg-[#7E8590]/25 border-[#7E8590]/25';
    }
  };

  return (
    <div className={cn("px-[8px] py-[3px] rounded-[6px] border border-solid text-[11px] font-semibold font-['Google_Sans_Flex'] whitespace-nowrap w-fit flex items-center justify-center leading-[normal]", getColors(), className)}>
      {status}
    </div>
  );
}
