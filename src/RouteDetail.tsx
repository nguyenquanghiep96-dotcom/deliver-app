import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Phone, MapPin, Navigation, ListFilter, Info, House, X, Check, WandSparkles, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useDriver } from "./DriverContext";
import { cn } from "./lib/utils";
import { StopCard } from "./components/StopCard";
import { RouteUpdateNotice } from "./components/RouteUpdateNotice";

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
  const { routes, routeUpdates, acknowledgeRouteUpdate, startRoute } = useDriver();
  
  const [isRearranging, setIsRearranging] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [orderedStopIds, setOrderedStopIds] = useState<string[]>([]);
  const [showOwnerEntities, setShowOwnerEntities] = useState(false);
  const [showRouteNoteSheet, setShowRouteNoteSheet] = useState(false);
  const [showStartRouteConfirm, setShowStartRouteConfirm] = useState(false);
  const [showStickyStart, setShowStickyStart] = useState(false);
  const [rearrangeMessage, setRearrangeMessage] = useState('');
  const inlineStartRef = useRef<HTMLButtonElement>(null);
  const pageScrollRef = useRef<HTMLDivElement>(null);

  const route = routes.find((r) => r.id === routeId);
  const routeUpdate = routeUpdates.find(update => update.routeId === routeId && !update.acknowledged);

  useEffect(() => {
    const scrollContainer = pageScrollRef.current;
    if (!scrollContainer || !route || route.status !== 'Planned') {
      setShowStickyStart(false);
      return;
    }
    const updateStickyState = () => {
      const button = inlineStartRef.current;
      if (!button) return;
      const containerRect = scrollContainer.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setShowStickyStart(buttonRect.bottom < containerRect.top + 8);
    };
    scrollContainer.addEventListener('scroll', updateStickyState, { passive: true });
    updateStickyState();
    return () => scrollContainer.removeEventListener('scroll', updateStickyState);
  }, [route?.status, routeId]);

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
  const ownerEntities = route.ownerEntities?.length
    ? route.ownerEntities
    : [route.ownerEntity || route.dealerName].filter(Boolean);
  const completedStopsCount = actualStops.filter(stop => stop.status === 'Done').length;
  const progressPercentage = totalStops > 0 ? (completedStopsCount / totalStops) * 100 : 0;
  const activeRoute = routes.find(candidate => candidate.status === 'En Route');
  const hasAnotherActiveRoute = Boolean(activeRoute && activeRoute.id !== route.id);

  const remainingDistance = getRemainingDistance(route.id, actualStops);

  const buildMapsUrl = () => {
    if (actualStops.length === 0) return "#";
    const addresses = actualStops.map((s) => encodeURIComponent(s.address));
    const destination = encodeURIComponent(route.endAddress || actualStops[actualStops.length - 1].address);
    const waypoints = (route.endAddress ? addresses : addresses.slice(0, -1)).join("|");
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    if (route.startingAddress) {
      url += `&origin=${encodeURIComponent(route.startingAddress)}`;
    }
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    return url;
  };

  const displayStops = orderedStopIds.length > 0
    ? orderedStopIds.map(id => actualStops.find(stop => stop.id === id)).filter(Boolean) as typeof actualStops
    : [...actualStops];

  const respectsWorkOrderSequence = (stopIds: string[]) => {
    const positions = new Map(stopIds.map((id, index) => [id, index]));
    const pickupPositions = new Map<string, number[]>();
    const dropoffPositions = new Map<string, number[]>();

    actualStops.forEach(routeStop => {
      routeStop.workOrders.forEach(wo => {
        const position = positions.get(routeStop.id);
        if (position === undefined) return;
        if (wo.action === 'Pickup') pickupPositions.set(wo.id, [...(pickupPositions.get(wo.id) || []), position]);
        if (wo.action === 'Dropoff') dropoffPositions.set(wo.id, [...(dropoffPositions.get(wo.id) || []), position]);
      });
    });

    return [...dropoffPositions.entries()].every(([woId, drops]) => {
      const pickups = pickupPositions.get(woId);
      if (!pickups?.length) return true;
      return Math.max(...pickups) < Math.min(...drops);
    });
  };

  const getMovedStopIds = (stopId: string, direction: -1 | 1) => {
    const ids = displayStops.map(stop => stop.id);
    const currentIndex = ids.indexOf(stopId);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= ids.length) return null;
    [ids[currentIndex], ids[targetIndex]] = [ids[targetIndex], ids[currentIndex]];
    return ids;
  };

  const canMoveStop = (stopId: string, direction: -1 | 1) => {
    const candidate = getMovedStopIds(stopId, direction);
    return Boolean(candidate && respectsWorkOrderSequence(candidate));
  };

  const getMoveBlockReason = (stopId: string, direction: -1 | 1) => {
    const candidate = getMovedStopIds(stopId, direction);
    if (!candidate || respectsWorkOrderSequence(candidate)) return '';
    const positions = new Map(candidate.map((id, index) => [id, index]));
    const workOrderIds = new Set(actualStops.flatMap(routeStop => routeStop.workOrders.map(wo => wo.id)));

    for (const workOrderId of workOrderIds) {
      const pickupStop = actualStops.find(routeStop => routeStop.workOrders.some(wo => wo.id === workOrderId && wo.action === 'Pickup'));
      const dropoffStop = actualStops.find(routeStop => routeStop.workOrders.some(wo => wo.id === workOrderId && wo.action === 'Dropoff'));
      if (!pickupStop || !dropoffStop) continue;
      const pickupPosition = positions.get(pickupStop.id);
      const dropoffPosition = positions.get(dropoffStop.id);
      if (pickupPosition !== undefined && dropoffPosition !== undefined && pickupPosition >= dropoffPosition) {
        return `Stop ${dropoffStop.num} contains the Dropoff for ${workOrderId}. It must stay after its Pickup at Stop ${pickupStop.num}.`;
      }
    }

    return 'This Stop cannot move because Pickup must remain before Dropoff.';
  };

  const moveStop = (stopId: string, direction: -1 | 1) => {
    const candidate = getMovedStopIds(stopId, direction);
    if (!candidate) return;
    if (!respectsWorkOrderSequence(candidate)) {
      setRearrangeMessage(getMoveBlockReason(stopId, direction));
      return;
    }
    setOrderedStopIds(candidate);
    setRearrangeMessage('');
  };

  const optimizeStopOrder = () => {
    const nearestFirst = [...actualStops].sort((a, b) => {
      if (a.status === 'Servicing') return -1;
      if (b.status === 'Servicing') return 1;
      const aDistance = Number.parseFloat(a.distance || '') || a.num;
      const bDistance = Number.parseFloat(b.distance || '') || b.num;
      return aDistance - bDistance;
    });

    const optimized: typeof actualStops = [];
    const remaining = [...nearestFirst];
    while (remaining.length) {
      const nextIndex = remaining.findIndex(candidate => {
        const candidateIds = [...optimized, candidate, ...remaining.filter(stop => stop.id !== candidate.id)].map(stop => stop.id);
        const candidatePosition = optimized.length;
        return candidate.workOrders.every(wo => {
          if (wo.action !== 'Dropoff') return true;
          const pickupStop = actualStops.find(routeStop => routeStop.workOrders.some(task => task.id === wo.id && task.action === 'Pickup'));
          return !pickupStop || pickupStop.id === candidate.id || candidateIds.indexOf(pickupStop.id) < candidatePosition;
        });
      });
      optimized.push(...remaining.splice(nextIndex >= 0 ? nextIndex : 0, 1));
    }
    setOrderedStopIds(optimized.map(stop => stop.id));
    setRearrangeMessage('');
  };

  return (
    <div ref={pageScrollRef} className="relative flex-1 flex flex-col overflow-y-auto select-none h-full pb-[148px] no-scrollbar bg-[#F4F5F8] font-['Google_Sans_Flex']">
      {/* Sticky top bar */}
        <header className="sticky top-0 z-50 bg-white px-4 pt-4 md:pt-[66px] pb-3 flex items-center gap-3 border-b border-[#ECEEF2]">
          <button
            onClick={() => navigate(backUrl)}
            className="size-11 bg-[#F4F5F8] rounded-full flex items-center justify-center border-none cursor-pointer active:scale-95 transition-all shrink-0 text-[#2B3B63]"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[17px] font-semibold m-0 text-[#2B3B63]">
            Route Details
          </h1>
          <button className="h-11 ml-auto px-3 bg-[#F4F5F8] rounded-full flex items-center justify-center gap-1.5 border-none text-[#2B3B63] cursor-pointer active:scale-95" aria-label="Call Dispatcher">
            <Phone size={17} strokeWidth={2} className="text-[#2FA301]" />
            <span className="text-[11px] font-semibold">Call Dispatcher</span>
          </button>
        </header>

      {/* Route overview */}
      <div className="bg-white px-4 pt-2 pb-5 rounded-b-[28px] text-[#2B3B63] relative z-10 shadow-[0_6px_24px_rgba(43,59,99,0.06)]">

        {/* Route Name & Status */}
        <div className="flex items-center gap-2.5 mb-3 min-w-0">
          <h2 className="text-[30px] font-bold leading-tight m-0 text-[#2B3B63] tracking-tight truncate">
            {route.name}
          </h2>
            <div className={cn(
              "h-6 px-2.5 rounded-full text-[11px] font-semibold shrink-0 flex items-center",
              route.status === 'Completed' ? "bg-[#2FA301] text-white" :
              route.status === 'En Route' ? "bg-[#2563eb] text-white" :
              "bg-[#7C3AED] text-white"
            )}>
              {route.status === 'En Route' ? 'In Progress' : route.status === 'Planned' ? 'Scheduled' : 'Completed'}
            </div>
            {route.routeNote && (
              <button
                type="button"
                onClick={() => setShowRouteNoteSheet(true)}
                className="relative size-10 ml-auto rounded-full bg-[#F1F3F7] border border-[#E1E4E9] text-[#71727A] flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                aria-label="View Route note"
              >
                <Info size={19} />
                <span className="absolute top-1 right-1 size-2.5 rounded-full bg-[#FF7048] border-2 border-[#F1F3F7]" />
              </button>
            )}
        </div>

        {route.routeNote && !bannerDismissed && (
          <div className={cn("mb-3 bg-[#FFF7F3] border border-[#FF7048]/15 rounded-[14px] px-1.5 py-1.5 flex gap-1.5", noteExpanded ? "items-start" : "items-center min-h-[36px]")}>
            <Info size={16} className="text-[#FF7048] shrink-0" />
            <div className="min-w-0 flex-1 text-[12px] leading-relaxed text-[#4B5563]">
              {noteExpanded ? (
                <p className="m-0">
                  {route.routeNote}{' '}
                  <button type="button" onClick={() => setNoteExpanded(false)} className="inline text-[11px] font-semibold text-[#E85D35] bg-transparent border-none p-0 cursor-pointer">See less</button>
                </p>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate flex-1">{route.routeNote}</span>
                  <button type="button" onClick={() => setNoteExpanded(true)} className="text-[11px] font-semibold text-[#E85D35] bg-transparent border-none p-0 shrink-0 cursor-pointer">See more</button>
                </div>
              )}
            </div>
            <button type="button" onClick={() => setBannerDismissed(true)} className="size-7 rounded-full bg-transparent border-none text-[#9CA3AF] flex items-center justify-center shrink-0 cursor-pointer" aria-label="Dismiss Route note"><X size={15} /></button>
          </div>
        )}

        {/* Compact route summary */}
        <div className="grid grid-cols-3 py-1.5">
          <div className="pr-2 min-w-0">
            <span className="block text-[11px] text-[#8A909D] mb-1">Scheduled</span>
            <span className="block text-[14px] font-semibold text-[#2B3B63] truncate">{route.startDate || route.date}</span>
            <span className="block text-[11px] text-[#71727A] truncate">{route.startTime}</span>
          </div>
          <button type="button" onClick={() => ownerEntities.length > 1 && setShowOwnerEntities(true)} className="px-2 min-w-0 border-0 border-l border-r border-solid border-y-0 border-[#E5E7EB] bg-transparent text-left cursor-pointer">
            <span className="block text-[11px] text-[#8A909D] mb-1">Owner</span>
            <span className="block text-[14px] font-semibold text-[#2B3B63] truncate">{ownerEntities[0]}</span>
            {ownerEntities.length > 1 && <span className="block text-[11px] font-semibold text-[#FF7048]">+{ownerEntities.length - 1} more</span>}
          </button>
          <div className="pl-2 min-w-0">
            <span className="block text-[11px] text-[#8A909D] mb-1">Progress</span>
            <span className="block text-[14px] font-semibold text-[#2B3B63]">{completedStopsCount}/{totalStops} Stops</span>
            <div
              className="w-full bg-[#D9DDE5] h-1 rounded-full overflow-hidden mt-2"
              role="progressbar"
              aria-label="Route progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercentage)}
            >
              <div className="h-full bg-[#FF7048] rounded-full" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Distance and route navigation */}
        <div className="min-h-[52px] mt-[6px] border-t border-[#E5E7EB] flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-baseline gap-1.5">
            <span className="text-[12px] text-[#71727A] whitespace-nowrap">Total Distance</span>
            <span className="text-[15px] font-bold text-[#2B3B63] truncate">{route.totalDistance || remainingDistance}</span>
          </div>
          <a href={buildMapsUrl()} target="_blank" rel="noreferrer" className="h-10 px-3 rounded-[12px] bg-white border border-[#D9DDE5] text-[#2B3B63] text-[13px] font-semibold flex items-center justify-center gap-1.5 decoration-none shrink-0 active:scale-[0.98]">
            <MapPin size={16} className="text-[#FF7048]" />
            Open Maps
          </a>
        </div>

        {route.status === 'Planned' && !hasAnotherActiveRoute && (
          <button
            ref={inlineStartRef}
            type="button"
            onClick={() => setShowStartRouteConfirm(true)}
            className="w-full min-h-[52px] mt-3 rounded-[14px] border-none bg-[#FF7048] text-white text-[16px] font-semibold cursor-pointer active:scale-[0.98] transition-transform"
          >
            Start Route
          </button>
        )}
      </div>

      {/* Note and dispatcher action */}
      <div className="px-4 pt-2 pb-0 flex flex-col gap-3 relative z-0">
        {routeUpdate && (
          <RouteUpdateNotice update={routeUpdate} onAcknowledge={acknowledgeRouteUpdate} />
        )}
        {route.status === 'Planned' && hasAnotherActiveRoute && (
          <div className="rounded-[14px] bg-[#FFF7ED] border border-[#F3C987] px-3.5 py-3 flex items-start gap-2.5" role="status">
            <AlertTriangle size={18} className="text-[#C67A00] shrink-0 mt-0.5" />
            <p className="m-0 text-[13px] font-medium leading-relaxed text-[#765019]">You’re currently working on {activeRoute?.name}. Complete that Route before starting this one.</p>
          </div>
        )}
      </div>

      {/* Stops and route actions */}
      <div id="route-stops" className="px-4 pt-3 pb-6 flex flex-col gap-3 relative z-0">
        {route.status === 'Completed' && (
          <button
            type="button"
            onClick={() => navigate(`/route/${route.id}/summary`)}
            className="w-full min-h-[52px] rounded-[14px] bg-[#EFFAF0] border border-[#2FA301]/20 text-[#287C18] text-[15px] font-bold cursor-pointer"
          >
            View Route Summary
          </button>
        )}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-bold text-[#2B3B63] m-0">Stops</h3>
              <span className="min-w-6 h-6 px-1.5 rounded-full bg-[#2B3B63] text-white text-[12px] font-bold flex items-center justify-center">
                {actualStops.length}
              </span>
            </div>
            {false && <button
              onClick={() => {
                setIsRearranging(!isRearranging);
                setRearrangeMessage('');
              }}
              className={cn("flex items-center gap-1.5 px-3 py-2 rounded-full border text-[12px] font-semibold transition-colors cursor-pointer", isRearranging ? "bg-[#2B3B63] border-[#2B3B63] text-white" : "bg-white border-[#DFE2E7] text-[#2B3B63]")}
            >
              {isRearranging ? <Check size={14} /> : <ListFilter size={14} />}
              {isRearranging ? 'Done' : 'Rearrange'}
            </button>}
          </div>
          {isRearranging ? (
            <div>
              <button
                onClick={optimizeStopOrder}
                className="w-full bg-[#FFF4F0] text-[#E85D35] px-4 py-3 rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer border border-[#FF7048]/20"
              >
                <WandSparkles size={18} />
                Optimize Route by Nearest Stops
              </button>
              <p className="m-0 mt-1.5 text-center text-[11px] font-medium text-[#8A909D]">Pickup always stays before its dropoff.</p>
              {rearrangeMessage && (
                <div className="mt-2.5 rounded-[12px] bg-[#FFF7ED] border border-[#F09A11]/25 px-3 py-2.5 flex items-start gap-2 text-left" role="status">
                  <AlertTriangle size={16} className="text-[#C67A00] shrink-0 mt-0.5" />
                  <p className="m-0 text-[11px] font-semibold leading-relaxed text-[#7A4A00]">{rearrangeMessage}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5 -mt-1.5">
          {/* Start Card */}
          <div className="py-3 border-b border-[#D9DDE4] flex gap-2.5 items-center">
            <div className="size-7 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#9AA0AC]" style={{ fontSize: 19 }}>location_on</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[#8A909D] text-[10px] font-bold uppercase tracking-wider mb-0.5">Start</span>
              <span className="text-[#5F6572] text-[14px] font-medium font-['Google_Sans_Flex'] leading-tight">{route.startingAddress || "123 Main St, Dallas, TX 75201"}</span>
            </div>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(route.startingAddress || "123 Main St, Dallas, TX 75201")}`} target="_blank" rel="noreferrer" className="size-10 rounded-[12px] bg-white border border-[#D5D9E0] text-[#FF7048] flex items-center justify-center shrink-0 decoration-none active:scale-95" aria-label="Navigate to Route start"><Navigation size={17} fill="currentColor" /></a>
          </div>

          {displayStops.map((stop) => {
            const upCandidate = getMovedStopIds(stop.id, -1);
            const downCandidate = getMovedStopIds(stop.id, 1);
            const upBlockedBySequence = Boolean(upCandidate && !canMoveStop(stop.id, -1));
            const downBlockedBySequence = Boolean(downCandidate && !canMoveStop(stop.id, 1));
            return (
            <div key={stop.id} className={cn("transition-all duration-300 relative", isRearranging ? "pl-[52px]" : "")}>
              {isRearranging && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  <button
                    onClick={() => moveStop(stop.id, -1)}
                    disabled={!upCandidate}
                    aria-disabled={!upCandidate}
                    className={cn("size-11 rounded-[12px] border bg-white flex items-center justify-center disabled:opacity-25 cursor-pointer active:scale-95 transition-transform", upBlockedBySequence ? "border-[#F09A11]/40 text-[#C67A00] opacity-60" : "border-[#D7DAE0] text-[#2B3B63]")}
                    aria-label={upBlockedBySequence ? `Cannot move stop ${stop.num} up. Pickup must remain before Dropoff` : `Move stop ${stop.num} up`}
                  >
                    <ArrowUp size={20} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => moveStop(stop.id, 1)}
                    disabled={!downCandidate}
                    aria-disabled={!downCandidate}
                    className={cn("size-11 rounded-[12px] border bg-white flex items-center justify-center disabled:opacity-25 cursor-pointer active:scale-95 transition-transform", downBlockedBySequence ? "border-[#F09A11]/40 text-[#C67A00] opacity-60" : "border-[#D7DAE0] text-[#2B3B63]")}
                    aria-label={downBlockedBySequence ? `Cannot move stop ${stop.num} down. Pickup must remain before Dropoff` : `Move stop ${stop.num} down`}
                  >
                    <ArrowDown size={20} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              <div className="block no-underline">
                <StopCard
                  stop={stop} 
                  routeId={route.id}
                  hideAction={true} 
                  className={cn(
                    "rounded-[18px] shadow-[0_2px_8px_rgba(43,59,99,0.05)]",
                    stop.status === "Done" ? "overflow-hidden" : stop.status === 'Servicing' ? "border-2 border-[#2563EB]" : "border border-[#E3E5EA]"
                  )}
                  inlineActionLabel={route.status === 'En Route' && stop.status === 'Servicing' ? 'Continue Stop' : route.status === 'En Route' && stop.status === 'Pending' ? 'View Stop' : undefined}
                />
              </div>
            </div>
          )})}

          {/* End Card */}
          <div className="py-3 border-t border-[#D9DDE4] flex gap-2.5 items-center">
            <div className="size-7 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#9AA0AC]" style={{ fontSize: 20 }}>flag</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[#8A909D] text-[10px] font-bold uppercase tracking-wider mb-0.5">End</span>
              <span className="text-[#5F6572] text-[14px] font-medium font-['Google_Sans_Flex'] leading-tight">{route.endAddress || route.startingAddress || 'Route end address'}</span>
            </div>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(route.endAddress || route.startingAddress || 'Route end address')}`} target="_blank" rel="noreferrer" className="size-10 rounded-[12px] bg-white border border-[#D5D9E0] text-[#FF7048] flex items-center justify-center shrink-0 decoration-none active:scale-95" aria-label="Navigate to Route end"><Navigation size={17} fill="currentColor" /></a>
          </div>
        </div>
      </div>

      {route.status === 'Planned' && !hasAnotherActiveRoute && showStickyStart && (
        <div className="fixed left-4 right-4 bottom-[82px] md:left-1/2 md:right-auto md:w-[345px] md:-translate-x-1/2 z-[55]">
          <button
            type="button"
            onClick={() => setShowStartRouteConfirm(true)}
            className="w-full min-h-[52px] rounded-[14px] border-none bg-[#FF7048] text-white text-[16px] font-semibold cursor-pointer shadow-[0_6px_18px_rgba(43,59,99,0.18)] active:scale-[0.98]"
          >
            Start Route
          </button>
        </div>
      )}

      {showOwnerEntities && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end">
          <button
            className="flex-1 bg-transparent border-none cursor-default"
            onClick={() => setShowOwnerEntities(false)}
            aria-label="Close owner entities"
          />
          <div className="bg-white rounded-t-[28px] px-4 pt-4 pb-8 max-h-[45%] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF2] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-[#FF7048]/10 flex items-center justify-center">
                  <House size={18} className="text-[#FF7048]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#2B3B63] m-0">Owner Entities</h2>
                  <p className="text-[11px] text-[#8A909D] m-0">{ownerEntities.length} assigned to this route</p>
                </div>
              </div>
              <button
                onClick={() => setShowOwnerEntities(false)}
                className="size-9 rounded-full bg-[#F2F4F7] text-[#71727A] border-none flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-2 no-scrollbar">
              {ownerEntities.map((entity, index) => (
                <div key={entity} className="flex items-center gap-3 px-3 py-3 rounded-[14px] bg-[#F7F8FA]">
                  <span className="size-7 rounded-full bg-white text-[#FF7048] text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">{index + 1}</span>
                  <span className="text-[14px] font-semibold text-[#2B3B63]">{entity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRouteNoteSheet && route.routeNote && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex flex-col justify-end">
          <button
            className="flex-1 bg-transparent border-none cursor-default"
            onClick={() => setShowRouteNoteSheet(false)}
            aria-label="Close route note"
          />
          <div className="h-[50%] min-h-[50%] max-h-[50%] bg-white rounded-t-[28px] px-4 pt-4 pb-6 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF2] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-[#FF7048]/10 flex items-center justify-center">
                  <Info size={18} className="text-[#FF7048]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#2B3B63] m-0">Route Note</h2>
                  <p className="text-[11px] text-[#8A909D] m-0">Information from Dispatcher</p>
                </div>
              </div>
              <button
                onClick={() => setShowRouteNoteSheet(false)}
                className="size-9 rounded-full bg-[#F2F4F7] text-[#71727A] border-none flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto py-4 no-scrollbar overscroll-contain">
              <p className="text-[15px] text-[#2B3B63] leading-relaxed m-0 whitespace-pre-wrap">
                {route.routeNote}
              </p>
            </div>
            <button
              onClick={() => setShowRouteNoteSheet(false)}
              className="w-full min-h-[50px] rounded-[14px] bg-white border border-[#D9DDE4] text-[#2B3B63] text-[15px] font-bold cursor-pointer active:scale-[0.98] transition-transform shrink-0"
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}

      {showStartRouteConfirm && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex flex-col justify-end">
          <button className="flex-1 bg-transparent border-none" onClick={() => setShowStartRouteConfirm(false)} aria-label="Cancel starting route" />
          <div className="bg-white rounded-t-[28px] px-4 pt-5 pb-7 shadow-2xl">
            <div className="size-11 rounded-full bg-[#FFF0EB] flex items-center justify-center mb-3">
              <AlertTriangle size={21} className="text-[#FF7048]" />
            </div>
            <h2 className="m-0 text-[20px] font-bold text-[#2B3B63]">Start {route.name}?</h2>
            <p className="m-0 mt-2 text-[14px] leading-relaxed text-[#71727A]">The Route status will change to In Progress. Confirm only when you are ready to begin this Route.</p>
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <button type="button" onClick={() => setShowStartRouteConfirm(false)} className="min-h-[52px] rounded-[14px] bg-white border border-[#D9DDE4] text-[#2B3B63] text-[16px] font-semibold">Not Yet</button>
              <button type="button" onClick={() => { startRoute(route.id); setShowStartRouteConfirm(false); }} className="min-h-[52px] rounded-[14px] bg-[#FF7048] border-none text-white text-[16px] font-semibold">Start Route</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
