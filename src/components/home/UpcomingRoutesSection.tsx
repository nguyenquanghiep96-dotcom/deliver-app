import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { initialRoutes } from '../../mockData';

export function UpcomingRoutesSection() {
  const upcoming = initialRoutes.filter(r => r.status === 'Planned').slice(0, 2);

  return (
    <div className="-mx-4 bg-white px-4 pb-5 pt-[20px] border-b border-black/5">
      <div className="flex items-center justify-between mb-3 mt-2">
        <Link to="/home?tab=schedule" className="flex items-center gap-1 decoration-none active:opacity-70">
          <h3 className="text-[20px] font-bold text-[#2B3B63] m-0 font-['Google_Sans_Flex']">
            Upcoming
          </h3>
          <ChevronRight size={22} strokeWidth={2.5} className="text-[#2B3B63] mt-[2px]" />
        </Link>
      </div>
      
      <div className="flex flex-col gap-2">
        {upcoming.map(route => {
          const totalWOs = route.stops?.reduce((sum, stop) => sum + (stop.workOrders ? stop.workOrders.length : 0), 0) || 0;
          const startDate = route.startDate || 'Jun 26';
          const startParts = startDate.split(' ');
          const dayDisplay = startParts[1] || startDate;
          const monthDisplay = startParts[0] || 'Jun';
          return (
            <Link key={route.id} to={`/route/${route.id}`} state={{ from: '/home?tab=home' }} className="w-full bg-[#E4E6EC] rounded-[16px] p-[12px] flex justify-between items-center decoration-none active:scale-[0.98] transition-transform border border-transparent">
              <div className="flex items-center gap-[12px]">
                <div className="w-[54px] py-[8px] self-stretch bg-white/60 overflow-hidden rounded-[10px] flex flex-col items-center justify-center gap-[4px] border-t-[3px] shrink-0" style={{ borderTopColor: route.stripeColor || '#3B82F6' }}>
                   <span className="text-[#2B3B63] text-[15px] font-bold font-['Google_Sans_Flex'] leading-none">{dayDisplay}</span>
                   <span className="text-[#71727A] text-[12px] font-semibold font-['Google_Sans_Flex'] leading-none">{monthDisplay}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-[#2B3B63] font-bold text-[16px] m-0 font-['Google_Sans_Flex']">{route.id} - {route.name}</h4>
                  <span className="text-[#71727A] text-[13px] font-['Google_Sans_Flex']">
                    {totalWOs} work orders &middot; {route.stops?.length || route.stopsCount} stops
                  </span>
                </div>
              </div>
              <div className="bg-white size-[32px] rounded-full flex items-center justify-center shrink-0 shadow-sm ml-2">
                <ChevronRight size={18} className="text-[#2B3B63]"/>
              </div>
            </Link>
          );
        })}
      </div>

      
    </div>
  );
}
