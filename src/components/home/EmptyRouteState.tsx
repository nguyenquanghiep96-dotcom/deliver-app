import { Link } from 'react-router';
import { CalendarDays } from 'lucide-react';

export function EmptyRouteState() {
  return (
    <div className="empty-route-state bg-white rounded-[24px] p-5 text-center border border-[#E1E4E9] select-none">
      <span className="size-12 rounded-full bg-[#EEF1F6] text-[#2B3B63] flex items-center justify-center mx-auto mb-3">
        <CalendarDays size={23} />
      </span>
      <h3 className="m-0 text-[18px] font-bold text-[#2B3B63] font-['Google_Sans_Flex']">No Route Today</h3>
      <p className="text-[13px] text-[#71727A] mt-1.5 mb-0 leading-relaxed">
        You have no assigned routes for today.<br />View your schedule to plan ahead.
      </p>
      <Link 
        to="/home?tab=schedule"
        className="mt-5 w-full min-h-[52px] flex items-center justify-center bg-[#FF7048] text-white px-5 rounded-[14px] text-[16px] font-semibold active:scale-[0.98] transition-transform decoration-none box-border"
      >
        View Schedule
      </Link>
    </div>
  );
}
