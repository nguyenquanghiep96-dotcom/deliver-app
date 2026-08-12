import { useState } from "react";
import { ChevronLeft, Phone, MapPin, ListFilter, Calendar as CalendarIcon, FileText } from "lucide-react";
import { useNavigate, useParams, Link, useLocation } from "react-router";
import { useDriver } from "./DriverContext";
import { cn } from "./lib/utils";
import { StopCard } from "./components/StopCard";
import imgNotificationIcon from '../icon/ic-notification.svg';

const getRemainingDistance = (routeId: string, stops: any[]) => {
  const completedCount = stops.filter((s) => s.status === "Done").length;
  const totalCount = stops.length;
  const remaining = totalCount - completedCount;
  if (remaining <= 0) return "0.0 mi";

  if (routeId === "RT-006") {
    const distances = ["0.0 mi", "3.8 mi", "8.5 mi", "13.2 mi", "18.4 mi", "24.5 mi"];
    return distances[remaining] || "0.0 mi";
  }

  return `${(remaining * 4.2).toFixed(1)} mi`;
};

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const backUrl = location.state?.from || "/home?tab=home";
  const { routes } = useDriver();
  
  const [sortByNearest, setSortByNearest] = useState(false);

  const route = routes.find((r) => r.id === routeId);

  if (!route) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-white">
        <span className="text-3xl mb-2">⚠️</span>
        <h2 className="text-base font-bold text-[#2B3B63]">Route Not Found</h2>
        <p className="text-xs text-[#71727a] mt-1">This route does not exist or was removed.</p>
        <button
          onClick={() => navigate(backUrl)}
          className="mt-4 px-5 py-2.5 bg-[#FF7048] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-[#E05B36] border-none"
        >
          Go Back
        </button>
      </div>
    );
  }

  const stops = route.stops;
  const actualStops = stops.filter(s => !s.workOrders.some(wo => wo.action === 'Start' || wo.action === 'End'));
  const totalStops = actualStops.length;
  
  const allWOs = actualStops.flatMap(s => s.workOrders);
  const totalWOs = allWOs.length;
  const completedWOsCount = actualStops.filter(s => s.status === 'Done').flatMap(s => s.workOrders).length;
  const progressPercentage = totalWOs > 0 ? (completedWOsCount / totalWOs) * 100 : 0;

  const estCompletion = route.id === 'RT-006' ? '15 Aug' : 'TBD';
  const remainingDistance = getRemainingDistance(route.id, stops);

  const buildScheduleString = () => {
    const { startDate, endDate, startTime, endTime } = route;
    if (startDate && endDate && endTime) {
      if (startDate === endDate) {
        return `Est. ${startDate}, ${startTime} - ${endTime}`;
      }
      return `Est. ${startDate}, ${startTime} - ${endDate}, ${endTime}`;
    }
    if (startDate && startTime) {
      return `Est. ${startDate}, ${startTime}`;
    }
    return `Est. ${startTime}`;
  };

  const buildMapsUrl = () => {
    if (actualStops.length === 0) return "#";
    const addresses = actualStops.map((s) => encodeURIComponent(s.address));
    const destination = addresses[addresses.length - 1];
    const waypoints = addresses.slice(0, -1).join("|");
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    if (route.startingAddress) {
      url += `&origin=${encodeURIComponent(route.startingAddress)}`;
    }
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    return url;
  };

  const displayStops = [...actualStops];
  if (sortByNearest) {
    // Mock sort: just reverse for demo purposes
    displayStops.reverse();
  }

  return (
    <div className="relative flex-1 flex flex-col overflow-y-auto select-none h-full pb-0 no-scrollbar bg-[#F4F5F8] font-['Google_Sans_Flex']">
      
      {/* ── Dark Header Section ────────────────────────────────────────────── */}
      <div className="bg-[#2B3B63] px-4 pt-[66px] pb-6 rounded-b-[32px] text-white relative shadow-[0_8px_30px_rgba(43,59,99,0.3)] z-10">
        
        {/* Top bar */}
        <header className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(backUrl)}
            className="size-[40px] bg-white/10 rounded-full flex items-center justify-center border border-white/20 cursor-pointer active:scale-95 transition-all shrink-0 text-white hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[18px] font-semibold m-0 tracking-wide">
            Route Details
          </h1>
          <button 
            className="bg-white/10 flex gap-[10px] items-center justify-center p-[8px] relative rounded-full shrink-0 size-[40px] cursor-pointer border border-white/20 active:scale-95 transition-all hover:bg-white/20"
          >
            <img src={imgNotificationIcon} alt="Notifications" className="w-[18px] h-[18px] invert brightness-0" />
            <div className="absolute bg-[#f52525] rounded-[30px] size-[12px] top-[2px] right-[2px] border-2 border-[#2B3B63]" />
          </button>
        </header>

        {/* Status Badge & Route ID */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5",
              route.status === 'Completed' ? "bg-[#2FA301]/20 text-[#4ADE80]" :
              route.status === 'En Route' ? "bg-[#3B82F6]/20 text-[#60A5FA]" :
              "bg-[#F09A11]/20 text-[#FBBF24]"
            )}>
              {route.status === 'En Route' && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
              )}
              {route.status === 'En Route' ? 'In Progress' : route.status === 'Planned' ? 'Scheduled' : 'Completed'}
            </div>
            <span className="font-bold text-[14px] text-[#FF7048]">
              # {route.id}
            </span>
          </div>
        </div>

        {/* Route Name */}
        <h2 className="text-[32px] font-bold leading-tight m-0 mb-3 text-white tracking-tight">
          {route.name}
        </h2>

        {/* Starting Point & Schedule */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-[#9CA3AF] mt-0.5 shrink-0" />
            <span className="text-[14px] text-[#E5E7EB] font-medium leading-snug">
              Start: {route.startingAddress || 'N/A'}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CalendarIcon size={16} className="text-[#9CA3AF] mt-0.5 shrink-0" />
            <span className="text-[14px] text-[#E5E7EB] font-medium leading-snug">
              {buildScheduleString()}
            </span>
          </div>
        </div>

        {/* Progress & Stats */}
        <div className="bg-white/10 rounded-[20px] p-4 backdrop-blur-sm border border-white/10">
          <div className="flex justify-between items-center text-[13px] text-white/80 font-medium mb-2">
             <span>Progress</span>
             <span className="font-bold text-white">{completedWOsCount}/{totalWOs} Work Orders</span>
          </div>
          <div className="w-full bg-white/20 h-[8px] rounded-full overflow-hidden mb-4">
             <div 
               className="h-full bg-[#2FA301] transition-all duration-500 rounded-full" 
               style={{ width: `${progressPercentage}%` }} 
             />
          </div>
          
          {/* Stats Grid */}
          <div className="flex items-start text-center">
            <div className="flex-1 border-r border-white/20 flex flex-col items-start pr-2">
              <span className="text-[11px] text-white/70">WOs done</span>
              <span className="text-[16px] font-bold text-white">{completedWOsCount}/{totalWOs}</span>
            </div>
            <div className="flex-1 border-r border-white/20 flex flex-col items-start px-3">
              <span className="text-[11px] text-white/70">Remaining</span>
              <span className="text-[16px] font-bold text-white">{route.totalDistance || remainingDistance}</span>
            </div>
            <div className="flex-1 flex flex-col items-start pl-3">
              <span className="text-[11px] text-white/70">Est. done</span>
              <span className="text-[16px] font-bold text-white">{estCompletion}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Action Buttons & Notes ────────────────────────────────────────── */}
      <div className="px-4 py-6 flex flex-col gap-4 relative z-0">
        {/* Call & Map buttons */}
        <div className="flex gap-3">
          {route.dispatcherPhone && (
            <a 
              href={`tel:${route.dispatcherPhone}`}
              className="flex-1 bg-white border border-[#E5E7EB] text-[#2B3B63] py-[14px] rounded-[16px] flex items-center justify-center gap-[8px] font-bold text-[15px] decoration-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-all"
            >
              <Phone size={18} className="text-[#FF7048]" />
              Dispatcher
            </a>
          )}
          <a 
            href={buildMapsUrl()}
            target="_blank" rel="noreferrer"
            className="flex-1 bg-[#2B3B63] text-white py-[14px] rounded-[16px] flex items-center justify-center gap-[8px] font-bold text-[15px] decoration-none shadow-[0_8px_20px_rgba(43,59,99,0.3)] active:scale-95 transition-all border border-[#2B3B63]"
          >
            <MapPin size={18} />
            Full Maps
          </a>
        </div>

        {/* Route Note */}
        {route.routeNote && (
          <div className="bg-[#FFF7EE] border border-[#FFE4C4] rounded-[16px] p-4 flex items-start gap-3 shadow-sm mt-1">
            <div className="shrink-0 mt-0.5"><FileText size={20} className="text-[#FF7048]" /></div>
            <p className="flex-1 text-[14px] text-[#2B3B63] leading-[1.5] m-0 font-medium">
              {route.routeNote}
            </p>
          </div>
        )}
      </div>

      {/* ── Stops List ────────────────────────────────────────────────────── */}
      <div className="px-4 pb-28 flex flex-col gap-4 relative z-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[18px] text-[#2B3B63] m-0">
            Stops ({actualStops.length})
          </h3>
          <button 
            onClick={() => setSortByNearest(!sortByNearest)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-bold transition-colors cursor-pointer active:scale-95",
              sortByNearest 
                ? "bg-[#2B3B63] text-white border-[#2B3B63]" 
                : "bg-white text-[#71727A] border-[#E5E7EB] hover:bg-gray-50 shadow-sm"
            )}
          >
            <ListFilter size={14} />
            {sortByNearest ? "Nearest First" : "Sort by Nearest"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {displayStops.map((stop) => (
            <StopCard 
              key={stop.id}
              stop={stop} 
              routeId={route.id}
              hideAction={true} // HIDDEN FOR PLANNER TRACK
              className="rounded-[20px] shadow-sm border border-[#E5E7EB]"
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}
