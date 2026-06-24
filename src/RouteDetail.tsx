import { ChevronLeft, MapPin, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router";
import { useDriver } from "./DriverContext";
import { cn } from "./lib/utils";
import { StopCard } from "./components/StopCard";

const getRemainingDistance = (routeId: string, stops: any[]) => {
  const completedCount = stops.filter(s => s.status === 'Done').length;
  const totalCount = stops.length;
  const remaining = totalCount - completedCount;
  if (remaining <= 0) return '0.0 mi';
  
  if (routeId === 'R-001') {
    const distances = ['0.0 mi', '3.8 mi', '8.5 mi', '13.2 mi', '18.4 mi', '24.5 mi'];
    return distances[remaining] || '0.0 mi';
  } else if (routeId === 'R-002') {
    const distances = ['0.0 mi', '6.4 mi', '12.8 mi'];
    return distances[remaining] || '0.0 mi';
  }
  
  return `${(remaining * 4.2).toFixed(1)} mi`;
};

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { routes, startRoute } = useDriver();

  const route = routes.find(r => r.id === routeId);

  if (!route) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-[#F2F4F7] font-sans">
        <span className="text-3xl mb-2">⚠️</span>
        <h2 className="text-base font-bold text-[#2f3036] font-['Google_Sans_Flex']">Route Not Found</h2>
        <p className="text-xs text-[#71727a] mt-1 font-['Google_Sans_Flex']">This route does not exist or was removed.</p>
        <button 
          onClick={() => navigate('/home?tab=routes')}
          className="mt-4 px-5 py-2.5 bg-[#ff7048] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-[#E05B36] border-none font-['Google_Sans_Flex']"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Calculate stops details
  const stops = route.stops;
  const totalStops = stops.length;
  const completedStops = stops.filter(s => s.status === 'Done').length;
  const progressPercentage = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;
  
  const estCompletion = route.id === 'R-001' ? '05:00 PM' : route.id === 'R-002' ? '04:30 PM' : '04:00 PM';
  const remainingDistance = getRemainingDistance(route.id, stops);

  // Check if another route is already active
  const activeRoute = routes.find(r => r.status === 'En Route');
  const hasActiveRoute = activeRoute !== undefined && activeRoute.id !== route.id;

  const handleStartRoute = () => {
    if (hasActiveRoute) return;
    startRoute(route.id);
    navigate('/home');
  };

  const getFirstServicingOrPendingStopId = () => {
    const activeOrPending = stops.find(s => s.status === 'Servicing') || stops.find(s => s.status === 'Pending');
    return activeOrPending ? activeOrPending.id : null;
  };

  const nextStopId = getFirstServicingOrPendingStopId();

  return (
    <div className="relative flex-1 flex flex-col bg-transparent overflow-y-auto select-none h-full pb-32 no-scrollbar">
      {/* Dark Header */}
      <header className="bg-[#1F2024] pt-12 pb-6 px-4 rounded-b-[32px] text-white shadow-xl shrink-0 z-10">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/home?tab=routes')}
            className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0 border-none cursor-pointer text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center pr-11 truncate font-['Google_Sans_Flex']">Route Details</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-2xl font-bold truncate leading-tight font-['Google_Sans_Flex']">
                {route.id} - {route.name}
              </span>
              <div className="flex items-center gap-1.5 text-[#C5C6CC] text-[15px] mt-1">
                <MapPin size={14} className="text-[#FF7048] shrink-0" />
                <span className="truncate">{stops[0]?.address || 'No stops'}</span>
              </div>
            </div>
            <div 
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold shrink-0 mt-1 uppercase tracking-wider font-['Google_Sans_Flex'] text-white",
                route.status === "En Route" ? "bg-[#2FA301]" : route.status === "Completed" ? "bg-[#6366f1]" : "bg-[#3B82F6]"
              )}
              style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}
            >
              {route.status}
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#FF7048] rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
            <div className="flex justify-end text-[12px] font-bold text-[#C5C6CC] font-['Google_Sans_Flex']">
              {completedStops}/{totalStops}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 select-none">
            <div className="flex-1 border-r border-white/10 text-center px-1">
              <div className="text-[12px] text-[#C5C6CC] font-medium font-['Google_Sans_Flex']">Stops done</div>
              <div className="text-lg font-bold text-white mt-0.5 font-['Google_Sans_Flex']">{completedStops}/{totalStops}</div>
            </div>
            <div className="flex-1 border-r border-white/10 text-center px-1">
              <div className="text-[12px] text-[#C5C6CC] font-medium font-['Google_Sans_Flex']">Remaining</div>
              <div className="text-lg font-bold text-white mt-0.5 font-['Google_Sans_Flex']">{remainingDistance}</div>
            </div>
            <div className="flex-1 text-center px-1">
              <div className="text-[12px] text-[#C5C6CC] font-medium font-['Google_Sans_Flex']">Est. done</div>
              <div className="text-lg font-bold text-white mt-0.5 font-['Google_Sans_Flex']">{estCompletion}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Stops Timeline */}
      <main className="px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[#2F3036] tracking-tight font-['Google_Sans_Flex']">Stops</h2>
          <div className="bg-[#2F3036] text-white text-[12px] font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center font-['Google_Sans_Flex']">
            {totalStops}
          </div>
        </div>

        {totalStops > 0 ? (
          <div className="flex flex-col gap-3 relative">
            {/* Timeline Line */}
            <div className="absolute left-[30px] top-6 bottom-6 w-[2px] bg-[#E8E9F1] -z-0" />

            {stops.map((stop, idx) => (
              <Link key={stop.id} to={`/stop/${stop.id}`} className="relative z-10 block decoration-none">
                <StopCard 
                  number={idx + 1}
                  address={stop.address}
                  type={stop.type}
                  userName={stop.customerName}
                  status={stop.status === 'Servicing' ? 'Arrived' : stop.status}
                  isCompleted={stop.status === 'Done'}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl text-center border border-[#E8E9F1]">
            <p className="text-sm font-medium text-[#71727A] font-['Google_Sans_Flex']">No stops assigned to this route.</p>
          </div>
        )}

        {/* Start Route Button & Warning Banner (Sticky Frame Area) */}
        <div className="fixed bottom-[96px] left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 z-40 select-none">
          {route.status === 'Planned' && (
            <div className="space-y-3 w-full">
              {/* Warning Banner */}
              {hasActiveRoute && activeRoute && (
                <div className="bg-[#FEF08A] border border-[#FDE047] text-[#713F12] px-4 py-3 rounded-2xl flex items-start gap-2.5 shadow-sm text-xs font-semibold leading-normal font-['Google_Sans_Flex']">
                  <AlertTriangle size={18} className="shrink-0 text-[#A16207]" />
                  <div>
                    Active Route is already running: <strong>{activeRoute.name}</strong>.<br />
                    Complete or pause it before starting this route.
                  </div>
                </div>
              )}

              <button 
                onClick={handleStartRoute}
                disabled={hasActiveRoute}
                className={cn(
                  "w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-[20px] shadow-xl transition-all border font-['Google_Sans_Flex'] text-base cursor-pointer",
                  hasActiveRoute 
                    ? "bg-[#D4D6DD] border-[#D4D6DD] text-[#8E90A6] cursor-not-allowed shadow-none" 
                    : "bg-[#FF7048] hover:bg-[#FF8563] border-[#FAA087] shadow-[#FF70484D] active:scale-95"
                )}
              >
                Start Route <ChevronRight size={18} />
              </button>
            </div>
          )}

          {route.status === 'En Route' && nextStopId && (
            <button 
              onClick={() => navigate(`/stop/${nextStopId}`)}
              className="w-full flex items-center justify-center gap-2 bg-[#2FA301] hover:bg-[#34B302] text-white font-bold py-4 rounded-[20px] shadow-xl shadow-[#2FA3014D] border border-[#7CD155] transition-all active:scale-95 font-['Google_Sans_Flex'] text-base cursor-pointer"
            >
              Resume Active Stop <ChevronRight size={18} />
            </button>
          )}

          {route.status === 'Completed' && (
            <button 
              disabled
              className="w-full flex items-center justify-center gap-2 bg-[#6366f1] text-white font-bold py-4 rounded-[20px] border border-[#8183f4] opacity-80 cursor-not-allowed font-['Google_Sans_Flex'] text-base"
            >
              Route Completed ✓
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
