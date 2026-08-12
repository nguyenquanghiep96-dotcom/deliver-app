import { Link } from 'react-router';

interface CompletedRouteStateProps {
  routeId: string;
}

export function CompletedRouteState({ routeId }: CompletedRouteStateProps) {
  return (
    <div className="completed-route-state -mx-4 bg-white px-4 py-8 text-center flex flex-col items-center gap-3 border-y border-black/5 flex-1 justify-center">
       <div className="size-[48px] bg-[#2fa301]/20 rounded-full flex items-center justify-center">
         <span className="text-[24px]">🎉</span>
       </div>
       <h2 className="text-[#2B3B63] font-bold text-[20px] m-0 font-['Google_Sans_Flex']">
         Route Completed!
       </h2>
       <Link 
         to={`/route/${routeId}`}
         className="bg-[#2B3B63] text-white px-[20px] py-[12px] rounded-[16px] font-semibold decoration-none font-['Google_Sans_Flex'] text-[14px] mt-2 active:scale-95 transition-transform"
       >
         View Route Summary
       </Link>
    </div>
  );
}
