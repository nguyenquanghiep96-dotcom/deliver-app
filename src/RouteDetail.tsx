import { useState } from "react";
import { ChevronLeft, Phone, MapPin, ListFilter, Calendar as CalendarIcon, FileText, Info } from "lucide-react";
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
  
  const [isRearranging, setIsRearranging] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

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

  return (
    <div className="relative flex-1 flex flex-col overflow-y-auto select-none h-full pb-0 no-scrollbar bg-white font-['Google_Sans_Flex']">
      
      {/* ── Dark Header Section ────────────────────────────────────────────── */}
      <div className="bg-white px-4 pt-[66px] pb-6 rounded-b-[32px] text-[#2B3B63] relative z-10 shadow-sm border-b border-[#E5E7EB]">
        
        {/* Top bar */}
        <header className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(backUrl)}
            className="size-[40px] bg-white rounded-full flex items-center justify-center border border-[#E5E7EB] cursor-pointer active:scale-95 transition-all shrink-0 text-[#2B3B63] hover:bg-gray-50 shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[18px] font-semibold m-0 tracking-wide text-[#2B3B63]">
            Route Details
          </h1>
        </header>

        {/* Status Badge & Route ID */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5",
              route.status === 'Completed' ? "bg-[#2FA301]/20 text-[#4ADE80]" :
              route.status === 'En Route' ? "bg-[#2563eb] text-white" :
              "bg-[#F09A11]/20 text-[#F09A11]"
            )}>
              {route.status === 'En Route' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
              {route.status === 'En Route' ? 'In Progress' : route.status === 'Planned' ? 'Scheduled' : 'Completed'}
            </div>
            <span className="font-bold text-[14px] text-[#FF7048]">
              # {route.id}
            </span>
          </div>
        </div>

        {/* Route Name */}
        <h2 className="text-[32px] font-bold leading-tight m-0 mb-3 text-[#2B3B63] tracking-tight">
          {route.name}
        </h2>

        {/* Starting Point & Schedule */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-[#9CA3AF] mt-0.5 shrink-0" />
            <span className="text-[14px] leading-tight text-[#71727A]">
              {route.startingAddress || "123 Main St, Dallas, TX 75201"}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CalendarIcon size={16} className="text-[#9CA3AF] mt-0.5 shrink-0" />
            <span className="text-[14px] leading-tight text-[#71727A]">
              {route.startDate ? `Est. ${route.startDate}, ${route.startTime || "10:42 AM"}` : "Est. Aug 12, 10:42 AM"}
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-[#F8F9FB] rounded-[24px] p-4 flex flex-col gap-3 border border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[13px] font-['Google_Sans_Flex']">
            <span className="text-[#71727A]">Progress</span>
            <span className="font-semibold text-[#2B3B63]">{completedWOsCount}/{totalWOs} Work Orders</span>
          </div>
          <div className="w-full bg-[#E5E7EB] h-[8px] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF7048] transition-all duration-500 rounded-full" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[#71727A] text-[13px] font-['Google_Sans_Flex']">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#9CA3AF]"/>
              <span>{remainingDistance} remaining</span>
            </div>
            <button 
              className="text-[#71727A] bg-white border border-[#E5E7EB] rounded-full p-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <Info size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>

      {/* ── Action Buttons & Notes ────────────────────────────────────────── */}
      <div className="px-4 py-6 flex flex-col gap-4 relative z-0">
        <div className="flex flex-col gap-3">
          <button className="w-full bg-[#2FA301]/10 text-[#2FA301] px-4 py-3.5 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform border-none cursor-pointer">
            <Phone size={18} />
            Call Dispatcher
          </button>
        </div>

        {route.routeNote && !bannerDismissed && (
          <div className="bg-[#FFF8F1] border border-[#FF7048]/20 rounded-[16px] p-4 flex items-start gap-3 relative shadow-sm">
            <Info size={20} className="text-[#FF7048] shrink-0 mt-0.5" />
            <div className="flex-1 pr-6">
              <h3 className="text-[14px] font-bold text-[#FF7048] m-0 mb-1">Route Note</h3>
              <p className="text-[13px] text-[#2F3036] m-0 leading-snug">
                {route.routeNote}
              </p>
            </div>
            <button 
              onClick={() => setBannerDismissed(true)}
              className="absolute top-3 right-3 text-[#FF7048] bg-transparent border-none cursor-pointer p-1 active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Stops List ── */}
      <div className="px-4 pb-28 flex flex-col gap-4 relative z-0 mt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-[#2B3B63] m-0">Stops ({actualStops.length})</h3>
            <button 
              onClick={() => setIsRearranging(!isRearranging)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E7EB] text-[12px] font-semibold transition-colors cursor-pointer", isRearranging ? "bg-[#2B3B63] text-white" : "bg-white text-[#2B3B63]")}
            >
              <ListFilter size={14} />
              Rearrange
            </button>
          </div>
          <a
            href={buildMapsUrl()}
            target="_blank"
            rel="noreferrer"
            className="w-full mt-2 bg-[#2B3B63] text-white px-4 py-3.5 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform decoration-none cursor-pointer border border-[#2B3B63]"
          >
            <MapPin size={18} />
            Full Maps
          </a>
          <div className="text-[13px] text-[#71727A] font-medium mt-1 mb-2">Total distance: {route.totalDistance || remainingDistance}</div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Start Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-4 flex gap-3 items-center">
            <div className="bg-[#E8E9F1] rounded-full size-[40px] flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-[#2B3B63]" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[#71727A] text-[11px] font-bold uppercase tracking-wider mb-0.5">Start</span>
              <span className="text-[#2B3B63] text-[14px] font-bold font-['Google_Sans_Flex'] leading-tight">{route.startingAddress || "123 Main St, Dallas, TX 75201"}</span>
            </div>
          </div>

          {displayStops.map((stop) => (
            <div key={stop.id} className={cn("transition-all duration-300 relative", isRearranging ? "pl-10" : "")}>
              {isRearranging && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <span className="material-symbols-outlined">drag_handle</span>
                </div>
              )}
              <div className="block no-underline">
                <StopCard 
                  stop={stop} 
                  routeId={route.id}
                  hideAction={true} 
                  className={cn("rounded-[20px] shadow-sm border border-[#E5E7EB]", stop.status === "Done" ? "overflow-hidden" : "")}
                />
              </div>
            </div>
          ))}

          {/* End Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-4 flex gap-3 items-center">
            <div className="bg-[#E8E9F1] rounded-full size-[40px] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#2B3B63]">flag</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[#71727A] text-[11px] font-bold uppercase tracking-wider mb-0.5">End</span>
              <span className="text-[#2B3B63] text-[14px] font-bold font-['Google_Sans_Flex'] leading-tight">{actualStops.length > 0 ? actualStops[actualStops.length-1].address : '8999 Sunset Blvd, Austin, TX'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}