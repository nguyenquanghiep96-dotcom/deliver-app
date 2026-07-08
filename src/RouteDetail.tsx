import { ChevronLeft, ChevronRight, Play, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router";
import { useDriver } from "./DriverContext";
import { cn, cleanStopType } from "./lib/utils";

// ─── Custom SVG Icons ────────────────────────────────────────────────────────

const IconLocation = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.475 14.9094C7.3 14.8491 7.14375 14.7585 7.00625 14.6378C6.19375 13.9133 5.475 13.207 4.85 12.5188C4.225 11.8305 3.70313 11.1634 3.28438 10.5175C2.86563 9.8715 2.54688 9.24968 2.32812 8.65201C2.10938 8.05433 2 7.48383 2 6.94049C2 5.12937 2.60312 3.6865 3.80938 2.6119C5.01563 1.5373 6.4125 1 8 1C9.5875 1 10.9844 1.5373 12.1906 2.6119C13.3969 3.6865 14 5.12937 14 6.94049C14 7.48383 13.8906 8.05433 13.6719 8.65201C13.4531 9.24968 13.1344 9.8715 12.7156 10.5175C12.2969 11.1634 11.775 11.8305 11.15 12.5188C10.525 13.207 9.80625 13.9133 8.99375 14.6378C8.85625 14.7585 8.7 14.8491 8.525 14.9094C8.35 14.9698 8.175 15 8 15C7.825 15 7.65 14.9698 7.475 14.9094ZM9.05938 7.81889C9.35313 7.53514 9.5 7.19405 9.5 6.7956C9.5 6.39715 9.35313 6.05606 9.05938 5.77232C8.76563 5.48857 8.4125 5.3467 8 5.3467C7.5875 5.3467 7.23438 5.48857 6.94063 5.77232C6.64688 6.05606 6.5 6.39715 6.5 6.7956C6.5 7.19405 6.64688 7.53514 6.94063 7.81889C7.23438 8.10263 7.5875 8.2445 8 8.2445C8.4125 8.2445 8.76563 8.10263 9.05938 7.81889Z" fill="#2F3036"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33333 14.6663C2.96667 14.6663 2.65278 14.5358 2.39167 14.2747C2.13056 14.0136 2 13.6997 2 13.333V3.99967C2 3.63301 2.13056 3.31912 2.39167 3.05801C2.65278 2.7969 2.96667 2.66634 3.33333 2.66634H4V1.99967C4 1.81079 4.06389 1.65245 4.19167 1.52467C4.31944 1.3969 4.47778 1.33301 4.66667 1.33301C4.85556 1.33301 5.01389 1.3969 5.14167 1.52467C5.26944 1.65245 5.33333 1.81079 5.33333 1.99967V2.66634H10.6667V1.99967C10.6667 1.81079 10.7306 1.65245 10.8583 1.52467C10.9861 1.3969 11.1444 1.33301 11.3333 1.33301C11.5222 1.33301 11.6806 1.3969 11.8083 1.52467C11.9361 1.65245 12 1.81079 12 1.99967V2.66634H12.6667C13.0333 2.66634 13.3472 2.7969 13.6083 3.05801C13.8694 3.31912 14 3.63301 14 3.99967V13.333C14 13.6997 13.8694 14.0136 13.6083 14.2747C13.3472 14.5358 13.0333 14.6663 12.6667 14.6663H3.33333ZM3.33333 13.333H12.6667V6.66634H3.33333V13.333Z" fill="#2F3036"/>
  </svg>
);

const IconNote = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.47467 11.1413C8.60245 11.0136 8.66634 10.8552 8.66634 10.6663V7.99967C8.66634 7.81079 8.60245 7.65245 8.47467 7.52467C8.3469 7.3969 8.18856 7.33301 7.99967 7.33301C7.81079 7.33301 7.65245 7.3969 7.52467 7.52467C7.3969 7.65245 7.33301 7.81079 7.33301 7.99967V10.6663C7.33301 10.8552 7.3969 11.0136 7.52467 11.1413C7.65245 11.2691 7.81079 11.333 7.99967 11.333C8.18856 11.333 8.3469 11.2691 8.47467 11.1413ZM8.47467 5.80801C8.60245 5.68023 8.66634 5.5219 8.66634 5.33301C8.66634 5.14412 8.60245 4.98579 8.47467 4.85801C8.3469 4.73023 8.18856 4.66634 7.99967 4.66634C7.81079 4.66634 7.65245 4.73023 7.52467 4.85801C7.3969 4.98579 7.33301 5.14412 7.33301 5.33301C7.33301 5.5219 7.3969 5.68023 7.52467 5.80801C7.65245 5.93579 7.81079 5.99967 7.99967 5.99967C8.18856 5.99967 8.3469 5.93579 8.47467 5.80801ZM7.99967 14.6663C7.07745 14.6663 6.21079 14.4913 5.39967 14.1413C4.58856 13.7913 3.88301 13.3163 3.28301 12.7163C2.68301 12.1163 2.20801 11.4108 1.85801 10.5997C1.50801 9.78856 1.33301 8.9219 1.33301 7.99967C1.33301 7.07745 1.50801 6.21079 1.85801 5.39967C2.20801 4.58856 2.68301 3.88301 3.28301 3.28301C3.88301 2.68301 4.58856 2.20801 5.39967 1.85801C6.21079 1.50801 7.07745 1.33301 7.99967 1.33301C8.9219 1.33301 9.78856 1.50801 10.5997 1.85801C11.4108 2.20801 12.1163 2.68301 12.7163 3.28301C13.3163 3.88301 13.7913 4.58856 14.1413 5.39967C14.4913 6.21079 14.6663 7.07745 14.6663 7.99967C14.6663 8.9219 14.4913 9.78856 14.1413 10.5997C13.7913 11.4108 13.3163 12.1163 12.7163 12.7163C12.1163 13.3163 11.4108 13.7913 10.5997 14.1413C9.78856 14.4913 8.9219 14.6663 7.99967 14.6663ZM7.99967 13.333C9.48856 13.333 10.7497 12.8163 11.783 11.783C12.8163 10.7497 13.333 9.48856 13.333 7.99967C13.333 6.51079 12.8163 5.24967 11.783 4.21634C10.7497 3.18301 9.48856 2.66634 7.99967 2.66634C6.51079 2.66634 5.24967 3.18301 4.21634 4.21634C3.18301 5.24967 2.66634 6.51079 2.66634 7.99967C2.66634 9.48856 3.18301 10.7497 4.21634 11.783C5.24967 12.8163 6.51079 13.333 7.99967 13.333Z" fill="#FF7048"/>
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6953 9.33301H5.30467C4.42854 9.33396 3.5886 9.64762 2.96908 10.2052C2.34957 10.7627 2.00106 11.5187 2 12.3072V15.333H14V12.3072C13.9989 11.5187 13.6504 10.7627 13.0309 10.2052C12.4114 9.64762 11.5715 9.33396 10.6953 9.33301Z" fill="#71727A"/>
    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#71727A"/>
  </svg>
);

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.22101 11.045C9.35869 11.1082 9.51381 11.1227 9.6608 11.086C9.8078 11.0493 9.9379 10.9636 10.0297 10.843L10.2663 10.533C10.3905 10.3674 10.5516 10.233 10.7367 10.1404C10.9219 10.0479 11.126 9.99967 11.333 9.99967H13.333C13.6866 9.99967 14.0258 10.1402 14.2758 10.3902C14.5259 10.6402 14.6663 10.9794 14.6663 11.333V13.333C14.6663 13.6866 14.5259 14.0258 14.2758 14.2758C14.0258 14.5259 13.6866 14.6663 13.333 14.6663C10.1504 14.6663 7.09816 13.4021 4.84773 11.1516C2.59729 8.90119 1.33301 5.84894 1.33301 2.66634C1.33301 2.31272 1.47348 1.97358 1.72353 1.72353C1.97358 1.47348 2.31272 1.33301 2.66634 1.33301H4.66634C5.01996 1.33301 5.3591 1.47348 5.60915 1.72353C5.8592 1.97358 5.99967 2.31272 5.99967 2.66634V4.66634C5.99967 4.87333 5.95148 5.07749 5.85891 5.26263C5.76634 5.44777 5.63194 5.60881 5.46634 5.73301L5.15434 5.96701C5.03195 6.06046 4.94569 6.1934 4.9102 6.34324C4.87472 6.49308 4.8922 6.65059 4.95967 6.78901C5.8708 8.63959 7.36929 10.1362 9.22101 11.045Z" fill="#71727A"/>
  </svg>
);

const IconNavigate = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.03858 13.743L2.26469 12.846C2.07472 12.8095 1.92113 12.7343 1.80392 12.6203C1.68671 12.5064 1.61033 12.3729 1.57477 12.2198C1.53921 12.0668 1.55076 11.9103 1.60942 11.7505C1.66807 11.5907 1.77461 11.4525 1.92902 11.336L13.5311 3.46842C13.6782 3.36368 13.8357 3.3145 14.0035 3.32088C14.1713 3.32726 14.3201 3.37084 14.4498 3.45162C14.5794 3.5324 14.6841 3.64671 14.7639 3.79456C14.8436 3.9424 14.8688 4.10541 14.8397 4.28359L12.8923 18.1658C12.8558 18.3558 12.7787 18.5123 12.6611 18.6354C12.5435 18.7585 12.4082 18.8378 12.2552 18.8734C12.1021 18.909 11.9486 18.8992 11.7947 18.8443C11.6407 18.7893 11.5055 18.6846 11.389 18.5302L8.03858 13.743Z" fill="white"/>
  </svg>
);

// ─── helpers ────────────────────────────────────────────────────────────────

const getRemainingDistance = (routeId: string, stops: any[]) => {
  const completedCount = stops.filter((s) => s.status === "Done").length;
  const totalCount = stops.length;
  const remaining = totalCount - completedCount;
  if (remaining <= 0) return "0.0 mi";

  if (routeId === "R-001") {
    const distances = ["0.0 mi", "3.8 mi", "8.5 mi", "13.2 mi", "18.4 mi", "24.5 mi"];
    return distances[remaining] || "0.0 mi";
  } else if (routeId === "R-002") {
    const distances = ["0.0 mi", "6.4 mi", "12.8 mi"];
    return distances[remaining] || "0.0 mi";
  }

  return `${(remaining * 4.2).toFixed(1)} mi`;
};

// ─── Inline Stop Card ────────────────────────────────────────────────────────

function StopCard({ stop }: { stop: any }) {
  const isServicing = stop.status === "Servicing";
  const isCompleted = stop.status === "Done";

  // Status badge
  let statusBg = "rgba(239,154,16,0.2)";
  let statusText = "#F09A11";
  let statusBorder = "1px solid rgba(239,154,16,0.2)";
  let statusLabel = "Pending";

  if (isServicing) {
    statusBg = "rgba(59,130,246,0.2)";
    statusText = "#3B82F6";
    statusBorder = "1px solid #3B82F6";
    statusLabel = "Arrived";
  } else if (isCompleted) {
    statusBg = "rgba(47,163,1,0.2)";
    statusText = "#2FA301";
    statusBorder = "1px solid rgba(47,163,1,0.2)";
    statusLabel = "Done";
  }

  // Stop circle
  let circleBg = "#E8E9F1";
  let circleColor = "#71727A";
  let circleOutline = "none";

  if (isServicing) {
    circleBg = "#FF7048";
    circleColor = "#FFFFFF";
    circleOutline = "2px solid #FFAC95";
  } else if (isCompleted) {
    circleBg = "rgba(47,163,1,0.2)";
    circleColor = "#2FA301";
  }

  return (
    <div
      className="bg-white rounded-[24px] p-[12px] flex flex-col gap-[9px] active:scale-[0.98] transition-transform"
      style={{ boxShadow: "0px 8px 40px rgba(0,0,0,0.10)", outline: "2px solid white", outlineOffset: "-2px" }}
    >
      {/* Card Header */}
      <div className="pb-[10px] border-b border-[#E8E9F1] flex items-center gap-[8px]">
        <div
          className="flex items-center justify-center shrink-0 size-[32px] rounded-full font-bold text-[14px] font-['Google_Sans_Flex']"
          style={{ background: circleBg, color: circleColor, outline: circleOutline, outlineOffset: "2px" }}
        >
          {stop.num}
        </div>
        <div className="flex-1 flex items-center gap-[12px] min-w-0">
          <span className="font-semibold text-[14px] text-[#2F3036] font-['Google_Sans_Flex'] truncate">
            {cleanStopType(stop.type)}
          </span>
          <div
            className="px-[6px] py-[3px] rounded-[6px] flex items-center justify-center shrink-0"
            style={{ background: statusBg, outline: statusBorder, outlineOffset: "-1px" }}
          >
            <span className="text-[10px] font-semibold font-['Google_Sans_Flex']" style={{ color: statusText }}>
              {statusLabel}
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="text-[#71727A] shrink-0" />
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-[8px]">
        {/* Address — single line truncate */}
        <div className="flex items-center gap-[5px]">
          <div className="shrink-0"><IconLocation /></div>
          <span className="flex-1 text-[16px] font-semibold text-[#2F3036] font-['Google_Sans_Flex'] truncate">
            {stop.address}
          </span>
        </div>

        {/* Unit info */}
        {stop.unitInfo && (stop.unitInfo.serial || stop.unitInfo.size) && (
          <span className="text-[14px] font-semibold text-[#FF7048] font-['Google_Sans_Flex'] truncate">
            #{stop.unitInfo.serial}{stop.unitInfo.size ? ` • ${stop.unitInfo.size}` : ""}
          </span>
        )}

        {/* Notes */}
        {stop.notes && (
          <div className="bg-[#FFF7EE] rounded-[16px] px-[10px] py-[8px] flex items-start gap-[6px]">
            <div className="shrink-0 mt-[1px]"><IconNote /></div>
            <p className="flex-1 text-[14px] text-[#71727A] font-['Google_Sans_Flex'] leading-[1.4] line-clamp-2">
              {stop.notes}
            </p>
          </div>
        )}

        {/* Footer: customer + phone + navigate */}
        <div className="flex items-center gap-[16px] pt-1">
          <div className="flex-1 flex items-center gap-[6px] min-w-0">
            <div className="shrink-0"><IconUser /></div>
            <span className="flex-1 font-medium text-[12px] text-[#71727A] font-['Google_Sans_Flex'] truncate">
              {stop.customerName}
            </span>
          </div>
          {stop.customerPhone && (
            <a
              href={`tel:${stop.customerPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="px-[8px] py-[8px] rounded-[10px] flex items-center justify-center gap-[6px] shrink-0 no-underline"
              style={{ outline: "1px solid #C5C6CC", outlineOffset: "-1px" }}
            >
              <IconPhone />
              <span className="font-medium text-[12px] text-[#71727A] font-['Google_Sans_Flex']">
                {stop.customerPhone}
              </span>
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="size-[40px] bg-[#2F3036] rounded-[46px] flex items-center justify-center shrink-0 no-underline active:scale-95 transition-transform"
          >
            <IconNavigate />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { routes, startRoute } = useDriver();

  const route = routes.find((r) => r.id === routeId);

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (!route) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none"
        style={{ background: "#E8E9F1", fontFamily: "'Google Sans Flex', sans-serif" }}
      >
        <span className="text-3xl mb-2">⚠️</span>
        <h2 className="text-base font-bold text-[#2f3036]">Route Not Found</h2>
        <p className="text-xs text-[#71727a] mt-1">This route does not exist or was removed.</p>
        <button
          onClick={() => navigate("/home?tab=routes")}
          className="mt-4 px-5 py-2.5 bg-[#FF7048] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-[#E05B36] border-none"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const stops = route.stops;
  const totalStops = stops.length;
  const completedStops = stops.filter((s) => s.status === "Done").length;
  const progressPercentage = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;

  const estCompletion =
    route.endTime ||
    (route.id === "R-001" ? "05:00 PM" : route.id === "R-002" ? "04:30 PM" : "04:00 PM");
  const remainingDistance = getRemainingDistance(route.id, stops);

  const activeRoute = routes.find((r) => r.status === "En Route");
  const hasActiveRoute = activeRoute !== undefined && activeRoute.id !== route.id;

  const handleStartRoute = () => {
    if (hasActiveRoute) return;
    startRoute(route.id);
    navigate("/home");
  };

  const getFirstServicingOrPendingStopId = () => {
    const activeOrPending =
      stops.find((s) => s.status === "Servicing") || stops.find((s) => s.status === "Pending");
    return activeOrPending ? activeOrPending.id : null;
  };

  const nextStopId = getFirstServicingOrPendingStopId();

  const buildScheduleString = () => {
    const { startDate, endDate, startTime, endTime } = route;
    if (startDate && endDate && endTime) {
      if (startDate === endDate) {
        return `${startDate}, ${startTime} - ${endTime}`;
      }
      return `${startDate}, ${startTime} - ${endDate}, ${endTime}`;
    }
    if (startDate && startTime) {
      return `${startDate}, ${startTime}`;
    }
    return startTime;
  };

  const buildMapsUrl = () => {
    if (stops.length === 0) return "#";
    const addresses = stops.map((s) => encodeURIComponent(s.address));
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

  const routeStatusLabel =
    route.status === "En Route" ? "En Route" : route.status === "Completed" ? "Completed" : "Planned";

  const activeStops = stops.filter((s) => s.status !== "Done");
  const completedStopsList = stops.filter((s) => s.status === "Done");

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex-1 flex flex-col overflow-y-auto select-none h-full pb-32 no-scrollbar"
      style={{ background: "#E8E9F1", fontFamily: "'Google Sans Flex', sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-[66px] pb-3 shrink-0 sticky top-0 z-50" style={{ background: "#E8E9F1" }}>
        <button
          onClick={() => navigate("/home?tab=routes")}
          className="size-[44px] bg-white rounded-full flex items-center justify-center border-none cursor-pointer active:scale-95 transition-transform shrink-0"
          style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.12)" }}
        >
          <ChevronLeft size={20} color="#5E6578" />
        </button>
        <h1 className="text-[18px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">
          Route Details
        </h1>
        {/* spacer to balance header */}
        <div className="size-[44px]" />
      </header>

      {/* ── Scrollable Content ──────────────────────────────────────────── */}
      <main className="px-4 pb-28 flex flex-col gap-[20px] mt-[4px]">

        {/* Status Row */}
        <div className="flex items-center gap-[10px]">
          <div
            className="rounded-[6px] px-[6px] py-[2px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: route.status === "En Route" || route.status === "Completed" ? "#2FA301" : "#3B82F6" }}
          >
            <span className="text-[12px] font-medium text-white font-['Google_Sans_Flex']">
              {routeStatusLabel}
            </span>
          </div>
          <span className="font-semibold text-[16px] text-[#FF7048] font-['Google_Sans_Flex']">
            # {route.id}
          </span>
        </div>

        {/* Route name */}
        <h2 className="text-[26px] font-semibold text-[#2F3036] leading-[1.25] font-['Google_Sans_Flex'] -mt-[10px] truncate">
          {route.name}
        </h2>

        {/* Progress bar + fraction */}
        <div className="flex items-center gap-[10px] -mt-[10px]">
          <div className="flex-1 h-[6px] relative rounded-[10px] overflow-hidden bg-[#C5C6CC]">
            <div
              className="absolute top-0 left-0 h-full rounded-[10px] bg-[#FF7048] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[12px] font-medium text-[#2F3036] font-['Google_Sans_Flex'] shrink-0">
            {completedStops}/{totalStops}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="flex items-start text-center -mt-[10px]">
          <div className="flex-1 border-r border-[#C5C6CC] flex flex-col items-start pr-3">
            <span className="text-[12px] text-[#71727A] font-['Google_Sans_Flex']">Stops done</span>
            <span className="text-[18px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">
              {completedStops}/{totalStops}
            </span>
          </div>
          <div className="flex-1 border-r border-[#C5C6CC] flex flex-col items-start px-3">
            <span className="text-[12px] text-[#71727A] font-['Google_Sans_Flex']">Remaining</span>
            <span className="text-[18px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">
              {remainingDistance}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-start pl-3">
            <span className="text-[12px] text-[#71727A] font-['Google_Sans_Flex']">Est. done</span>
            <span className="text-[18px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">
              {estCompletion}
            </span>
          </div>
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-[4px] -mt-[8px]">
          {route.startingAddress && (
            <div className="flex items-start gap-[5px]">
              <div className="shrink-0 mt-[1px]"><IconLocation /></div>
              <span className="text-[14px] text-[#2F3036] font-['Google_Sans_Flex'] leading-[1.4]">
                <strong>Starting Point: </strong><span className="text-[#71727A]">{route.startingAddress}</span>
              </span>
            </div>
          )}
          <div className="flex items-start gap-[5px]">
            <div className="shrink-0 mt-[1px]"><IconCalendar /></div>
            <span className="text-[14px] text-[#2F3036] font-['Google_Sans_Flex'] leading-[1.4]">
              <strong>Est. </strong><span className="text-[#71727A]">{buildScheduleString()}</span>
            </span>
          </div>
        </div>

        {/* Map Preview Card */}
        <div
          className="rounded-[16px] overflow-hidden relative cursor-pointer active:scale-[0.99] transition-transform"
          style={{
            height: 132,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          {/* Google Maps thumbnail */}
          <img
            src="/map-thumbnail.jpg"
            alt="Route map"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* dark overlay for readability */}
          <div className="absolute inset-0 bg-black/20" />
          {/* overlay button */}
          <a
            href={buildMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center no-underline"
          >
            <div
              className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-full"
              style={{ background: "rgba(31,32,36,0.80)" }}
            >
              <IconNavigate />
              <span className="text-[14px] font-semibold text-white font-['Google_Sans_Flex']">
                View Full Maps
              </span>
            </div>
          </a>
        </div>

        {/* Route Note */}
        {route.routeNote && (
          <div className="bg-[#FFF7EE] rounded-[16px] p-[10px] flex items-start gap-[6px]">
            <div className="shrink-0 mt-[1px]"><IconNote /></div>
            <p className="flex-1 text-[14px] text-[#71727A] font-['Google_Sans_Flex'] leading-[1.5]">
              {route.routeNote}
            </p>
          </div>
        )}

        {/* Active/Pending Stops */}
        {activeStops.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            <h3 className="font-semibold text-[16px] text-[#2F3036] font-['Google_Sans_Flex']">Stops</h3>
            <div className="flex flex-col gap-[16px]">
              {activeStops.map((stop) => (
                <Link key={stop.id} to={`/stop/${stop.id}`} className="block no-underline">
                  <StopCard stop={stop} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Warning banner when another route is active */}
        {hasActiveRoute && activeRoute && route.status === "Planned" && (
          <div className="bg-[#FEF08A] border border-[#FDE047] text-[#713F12] px-4 py-3 rounded-2xl flex items-start gap-2.5 shadow-sm">
            <AlertTriangle size={18} className="shrink-0 text-[#A16207] mt-0.5" />
            <div className="text-xs font-semibold leading-normal font-['Google_Sans_Flex']">
              Active Route is already running: <strong>{activeRoute.name}</strong>.<br />
              Complete or pause it before starting this route.
            </div>
          </div>
        )}

        {/* Completed Stops */}
        {completedStopsList.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            <h3 className="font-semibold text-[16px] text-[#2F3036] font-['Google_Sans_Flex']">Completed</h3>
            <div className="flex flex-col gap-[16px]">
              {completedStopsList.map((stop) => (
                <Link key={stop.id} to={`/stop/${stop.id}`} className="block no-underline">
                  <StopCard stop={stop} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Floating Action Button ──────────────────────────────────────── */}
      {route.status !== "Completed" && (
        <div className="fixed bottom-[100px] right-[16px] z-50">
          {route.status === "Planned" ? (
            <button
              onClick={handleStartRoute}
              disabled={hasActiveRoute}
              title="Start Route"
              className={cn(
                "size-[54px] rounded-full flex items-center justify-center border-none cursor-pointer shadow-xl active:scale-95 transition-transform",
                hasActiveRoute
                  ? "bg-[#D4D6DD] cursor-not-allowed"
                  : "bg-[#FF7048] hover:bg-[#FF8563]"
              )}
              style={{ boxShadow: hasActiveRoute ? "none" : "0px 8px 24px rgba(255,112,72,0.45)" }}
            >
              <Play size={24} fill="white" className="text-white" />
            </button>
          ) : route.status === "En Route" ? (
            <Link
              to={nextStopId ? `/stop/${nextStopId}` : "#"}
              className="size-[54px] rounded-full bg-[#FF7048] flex items-center justify-center no-underline shadow-xl active:scale-95 transition-transform"
              style={{ boxShadow: "0px 8px 24px rgba(255,112,72,0.45)" }}
            >
              <ChevronRight size={28} className="text-white" />
            </Link>
          ) : (
            <div
              className="size-[54px] rounded-full bg-[#2FA301] flex items-center justify-center shadow-xl"
              style={{ boxShadow: "0px 8px 24px rgba(47,163,1,0.4)" }}
            >
              <CheckCircle size={28} className="text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
