import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useDriver } from '../../DriverContext';

export function UpcomingRoutesSection() {
  const { routes } = useDriver();
  const activeRoute = routes.find(route => route.status === 'En Route') || routes.find(route => route.status === 'Planned' && route.date === 'Today');
  
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const parseRouteDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Today') return dateStr === 'Today' ? todayStart : null;
    const [monthText, dayText] = dateStr.split(' ');
    const month = MONTHS.indexOf(monthText);
    const day = Number.parseInt(dayText, 10);
    return month >= 0 && Number.isFinite(day) ? new Date(today.getFullYear(), month, day) : null;
  };

  const upcoming = routes
    .filter(route => {
      if (route.status !== 'Planned' || route.id === activeRoute?.id) return false;
      const routeDate = parseRouteDate(route.startDate || route.date);
      return routeDate && routeDate.getTime() >= todayStart.getTime();
    })
    .sort((a, b) => {
      const dateA = parseRouteDate(a.startDate || a.date);
      const dateB = parseRouteDate(b.startDate || b.date);
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
    })
    .slice(0, 2);

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
          const businessStops = route.stops?.filter(stop => !stop.workOrders?.some(wo => wo.action === 'Start' || wo.action === 'End')) || [];
          const stopsCount = businessStops.length || route.stopsCount || 0;
          const startDate = route.startDate || 'Jun 26';
          const startParts = startDate.split(' ');
          const dayDisplay = startParts[1] || startDate;
          const monthDisplay = startParts[0] || 'Jun';
          return (
            <Link key={route.id} to={`/route/${route.id}`} state={{ from: '/home?tab=home' }} className="w-full min-h-[76px] bg-white rounded-[18px] p-[12px] flex justify-between items-center decoration-none active:scale-[0.98] transition-transform border border-[#E1E4E9]">
              <div className="flex items-center gap-[12px]">
                <div className="size-[52px] bg-[#2B3B63] rounded-[13px] flex flex-col items-center justify-center shrink-0 text-white">
                   <span className="text-[17px] font-bold font-['Google_Sans_Flex'] leading-5">{dayDisplay}</span>
                   <span className="text-white/80 text-[11px] font-semibold font-['Google_Sans_Flex']">{monthDisplay}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-[#2B3B63] font-bold text-[16px] m-0 font-['Google_Sans_Flex']">{route.name}</h4>
                  <span className="text-[#71727A] text-[13px] font-['Google_Sans_Flex']">
                    {route.startTime || 'Time TBD'} &middot; {stopsCount} {stopsCount === 1 ? 'Stop' : 'Stops'}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9CA3AF] shrink-0 ml-2"/>
            </Link>
          );
        })}
      </div>

      
    </div>
  );
}
