import { Link } from 'react-router';

export function EmptyRouteState() {
  return (
    <div className="empty-route-state bg-white rounded-[28px] p-6 text-center border border-black/5 shadow-sm select-none">
      <span className="text-3xl block mb-2">✨</span>
      <h3 className="text-base font-bold text-[#2B3B63] font-['Google_Sans_Flex']">No Active Route</h3>
      <p className="text-xs text-[#71727A] mt-1.5 leading-relaxed">
        You have no active routes today.<br />Click the tab below to view your assigned routes.
      </p>
      <Link 
        to="/home?tab=routes"
        className="mt-4 inline-flex items-center justify-center gap-1.5 bg-[#FF7048] hover:bg-[#FF8563] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#FF704833] decoration-none"
      >
        Go to Routes ➜
      </Link>
    </div>
  );
}
