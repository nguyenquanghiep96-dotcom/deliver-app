import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

interface RoutesLinkCardProps {
  routesCount: number;
}

export function RoutesLinkCard({ routesCount }: RoutesLinkCardProps) {
  return (
    <div className="-mx-4 bg-white px-4 py-5 flex flex-col gap-3 border-y border-black/5">
      <div className="routes-link-card w-full bg-white rounded-[20px] p-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-transparent active:scale-[0.98] transition-transform">
         <Link to="/home?tab=routes" className="flex justify-between items-center decoration-none">
           <div className="flex flex-col gap-1">
             <h2 className="text-[#2B3B63] font-bold text-[20px] m-0 font-['Google_Sans_Flex']">Routes</h2>
             <span className="text-[#2B3B63] text-[14px] font-['Google_Sans_Flex']">
               {routesCount} Routes in this month
             </span>
           </div>
           <div className="bg-[#F2F2F3] size-[32px] rounded-full flex items-center justify-center shrink-0">
             <ChevronRight size={18} className="text-[#2B3B63]"/>
           </div>
         </Link>
      </div>
    </div>
  );
}
