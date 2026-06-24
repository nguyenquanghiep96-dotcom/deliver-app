import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import { useDriver } from './DriverContext';
import { StopCard } from './components/StopCard';
import { Bell, ChevronRight, User, Info, Clock, LogOut, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { cn, cleanStopType } from './lib/utils';

import imgUserImage from './assets/3271fc3a53481ca6ba5eb96b8724359f747c54a3.png';
import imgCompanyLogo from '../icon/Logo/Powered by shedpro.svg';
import imgNotificationIcon from '../icon/ic-notification.svg';
import imgNavigateIcon from '../icon/ic-navigate.svg';
import imgPhoneCallIcon from '../icon/ic-phone-call.svg';
import imgUserIcon from '../icon/ic-user.svg';
import imgNoteIcon from '../icon/Note Icon.svg';

import imgNavHome from '../icon/ic-home.svg';
import imgNavCalendar from '../icon/ic-calendar.svg';
import imgNavRoutes from '../icon/ic-routes.svg';
import imgNavProfile from '../icon/ic-user.svg';

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

export default function Home() {
  const location = useLocation();
  const {
    activeDriver,
    drivers,
    routes,
    switchDriver,
    resetData
  } = useDriver();

  // Get active tab from query parameters
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const mainEl = document.getElementById('scroll-container');
    if (!mainEl) return;
    const handleScroll = (e) => {
      setIsScrolled(e.target.scrollTop > 10);
    };
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'home';

  // State inside Routes Tab: "Schedule" | "Completed"
  const [activeRoutesTab, setActiveRoutesTab] = useState<'Assigned' | 'Completed'>('Assigned');

  // Modals & expanders states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDriverMenu, setShowDriverMenu] = useState(false);
  const [upcomingStopsExpanded, setUpcomingStopsExpanded] = useState(false);

  // Settings states
  const [gpsPrecision, setGpsPrecision] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);

  // Find active route (En Route or Today's Planned route)
  const activeRoute = routes.find(r => r.status === 'En Route') || routes.find(r => r.status === 'Planned' && r.date === 'Today');

  // Filter routes for the Routes Tab
  const upcomingRoutes = routes.filter(
    route => route.status === 'Planned' && route.id !== activeRoute?.id
  );
  
  const completedRoutesStops = routes
    .filter(r => r.status === 'Completed' || r.status === 'En Route')
    .flatMap(r => r.stops.filter(s => s.status === 'Done'));

  // Notifications list
  const mockNotifications = [
    { id: 1, title: 'Route Updated', body: 'Fort Worth route sequence updated by dispatch.', time: '10m ago', type: 'update' },
    { id: 2, title: 'Stop Canceled', body: 'Stop 6 (1323 Bedford Ave) has been canceled by customer.', time: '1h ago', type: 'alert' },
    { id: 3, title: 'Weather Alert', body: 'Heavy rains expected along Fort Worth corridor.', time: '3h ago', type: 'info' }
  ];

  return (
    <div className="relative min-h-full bg-transparent font-sans">

      {/* ── 1. HOME TAB VIEW ────────────────────────────────────────────────── */}
      {currentTab === 'home' && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-[60px] pb-4 select-none h-[110px] shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-transparent border-transparent'}`}>
            <h1 className="text-[34px] font-semibold text-[#2F3036] tracking-tight font-['Google_Sans_Flex']">Route Today</h1>
            
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-[#e8e9f1] flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 right-0 border-2 border-[#e8e9f1]" />
            </button>
          </header>

          <main className="px-4 pb-28 space-y-6">
            {/* Route Today Header */}
            <div className="space-y-4">
              
              {activeRoute ? (
                (() => {
                  const stops = activeRoute.stops;
                  const totalStops = stops.length;
                  const completedStopsCount = stops.filter(s => s.status === 'Done').length;
                  const progressPercentage = totalStops > 0 ? (completedStopsCount / totalStops) * 100 : 0;
                  const estCompletion = activeRoute.id === 'R-001' ? '~5:00 PM' : activeRoute.id === 'R-002' ? '~4:30 PM' : 'TBD';

                  // Determine active stop (Current Stop)
                  const activeStop = stops.find(s => s.status === 'Servicing') || stops.find(s => s.status === 'Pending');
                  const activeStopId = activeStop ? activeStop.id : null;

                  // Filter next, upcoming, and completed stops
                  const nextStopsList = stops.filter(s => s.status === 'Pending' || s.status === 'Servicing');
                  const immediateNextStop = nextStopsList.find(s => s.id !== activeStopId);
                  
                  // Upcoming stops: everything pending after the immediate next stop
                  const upcomingStopsList = nextStopsList.filter(s => s.id !== activeStopId && s.id !== immediateNextStop?.id);
                  const completedStopsList = stops.filter(s => s.status === 'Done');

                  // Format distance values
                  const remainingDistanceStr = getRemainingDistance(activeRoute.id, stops);

                  return (
                    <div className="space-y-[10px]">
                      
                      {/* Active Route Summary Card */}
                      <div className="relative rounded-[24px] shrink-0 w-full drop-shadow-xl" style={{ backgroundImage: "linear-gradient(246.205deg, rgb(73, 74, 80) 2.3104%, rgb(31, 32, 36) 100.9%)" }}>
                        <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
                          
                          {/* Top part: Current Stop Details */}
                          <div className="bg-[#494a50] relative rounded-[24px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
                            <div className="overflow-clip rounded-[inherit] size-full">
                              <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative size-full">
                                
                                {/* Info details */}
                                <div className="flex gap-[6px] items-center justify-between w-full">
                                  <div className="font-semibold text-[18px] text-white font-['Google_Sans_Flex'] truncate">{activeRoute.id} - {activeRoute.name}</div>
                                  <div className="bg-[#2fa301] px-[6px] py-[2px] rounded-[6px] text-[12px] font-medium text-white whitespace-nowrap font-['Google_Sans_Flex'] shrink-0 animate-pulse">En Route</div>
                                </div>

                                {/* Progress Bar Layout */}
                                <div className="flex gap-[10px] items-center w-full mt-1">
                                  <div className="flex-1 h-[6px] bg-white rounded-[10px] relative">
                                    <div className="bg-[#ff7048] absolute top-0 left-0 h-full rounded-[10px] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                                  </div>
                                  <div className="text-[12px] font-medium text-white text-center whitespace-nowrap font-['Google_Sans_Flex']">{completedStopsCount}/{totalStops}</div>
                                </div>

                                {/* Stops summary stats grid */}
                                <div className="flex items-start w-full pt-1 pb-2">
                                  <div className="flex-1 text-center border-r border-[#71727a] px-1">
                                    <div className="text-[12px] text-[#c5c6cc] font-normal">Stops done</div>
                                    <div className="text-[18px] font-semibold text-white mt-0.5">{completedStopsCount}/{totalStops}</div>
                                  </div>
                                  <div className="flex-1 text-center border-r border-[#71727a] px-1">
                                    <div className="text-[12px] text-[#c5c6cc] font-normal">Remaining</div>
                                    <div className="text-[18px] font-semibold text-white mt-0.5">{remainingDistanceStr}</div>
                                  </div>
                                  <div className="flex-1 text-center px-1">
                                    <div className="text-[12px] text-[#c5c6cc] font-normal">Est. done</div>
                                    <div className="text-[18px] font-semibold text-white mt-0.5">{estCompletion}</div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>

                          {/* Bottom part: Stop Card */}
                          {activeStop && (
                            <div className="content-stretch flex flex-col items-start p-[16px] relative w-full gap-[10px]">
                              
                              <div className="flex items-center gap-[6px] pb-[10px] w-full border-b border-[#494a50]">
                                <div className="bg-[#71727a] w-[36px] h-[36px] rounded-[21px] flex items-center justify-center text-white font-bold text-[14px] shrink-0 font-['Proxima_Nova']">
                                  {activeStop.num}
                                </div>
                                <span className="text-[16px] font-semibold text-white truncate flex-1 font-['Google_Sans_Flex']">{activeStop.address}</span>
                              </div>
                              
                              <div className="flex items-center gap-[8px] flex-wrap select-none w-full">
                                <div className="bg-[#e8e9f1] px-[8px] py-[3px] rounded-[6px] text-[11px] font-semibold text-[#2f3036] shrink-0 font-['Proxima_Nova'] border border-[#e8e9f1]">
                                  {cleanStopType(activeStop.type)}
                                </div>
                                <div className="flex items-center gap-[2px] truncate text-white text-[12px] font-medium font-['Google_Sans_Flex'] max-w-[130px]">
                                  <img src={imgUserIcon} className="w-[12px] h-[12px] filter brightness-0 invert" alt="user" /> {activeStop.customerName}
                                </div>
                                <div className="ml-auto bg-[rgba(59,130,246,0.2)] text-[#3b82f6] px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium shrink-0 font-['Google_Sans_Flex'] border border-[#3b82f6]">
                                  Arrived
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-[6px] opacity-60 rounded-[5px] w-full mt-1">
                                <img src={imgNoteIcon} className="w-[20px] h-[20px] shrink-0 filter brightness-0 invert" alt="note" />
                                <span className="text-[14px] font-normal text-white font-['Google_Sans_Flex'] leading-snug">{activeStop.notes}</span>
                              </div>
                              
                              <Link to={`/stop/${activeStop.id}`} className="flex items-center justify-center gap-[6px] bg-[#ff7048] hover:bg-[#FF8563] text-white font-semibold py-[15.5px] px-[30px] rounded-[16px] transition-colors active:scale-[0.98] decoration-none text-[16px] w-full border border-[#faa087] font-['Google_Sans_Flex'] mt-2">
                                Continue execute this stop <svg width="16" height="16" viewBox="0 0 10.3833 10.1087" fill="none"><path d="M5.3833 0.108643L4.4758 1.01614L8.5008 5.04114H0.383301V6.29114H8.5008L4.4758 10.3161L5.3833 11.2236L10.9389 5.66802L5.3833 0.108643Z" fill="white"/></svg>
                              </Link>
                            </div>
                          )}

                        </div>
                        <div aria-hidden className="absolute border-2 border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.1)]" />
                      </div>

                      {/* Next Stops */}
                      {immediateNextStop && (
                        <section className="space-y-[10px] pt-4">
                          <div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Next Stops</h2>
                            <span className="text-[14px] font-normal text-[#71727A] font-['Google_Sans_Flex']">2.5 mi</span>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <div className="bg-white rounded-[24px] p-[12px] w-full border border-transparent shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
                              <div className="flex flex-col gap-[10px]">
                                
                                {/* Info */}
                                <div className="flex gap-[6px] items-center pb-[10px] border-b border-[#e8e9f1]">
                                  <div className="bg-[#e8e9f1] w-[36px] h-[36px] rounded-[21px] flex items-center justify-center text-[#71727a] font-bold text-[14px] shrink-0 font-['Proxima_Nova']">
                                    {immediateNextStop.num}
                                  </div>
                                  <span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex']">{immediateNextStop.address}</span>
                                  <Link to={`/stop/${immediateNextStop.id}`} className="text-[#71727a] hover:text-[#2f3036] shrink-0 w-[16px] h-[16px] flex items-center justify-center">
                                    <ChevronRight size={16} strokeWidth={3} />
                                  </Link>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-[8px] flex-wrap select-none w-full">
                                  <div className="bg-[#e8e9f1] px-[8px] py-[3px] rounded-[6px] text-[11px] font-semibold text-[#2f3036] shrink-0 font-['Proxima_Nova'] border border-[#e8e9f1]">
                                    {cleanStopType(immediateNextStop.type)}
                                  </div>
                                  <div className="flex items-center gap-[2px] truncate text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex'] flex-1">
                                    <img src={imgUserIcon} className="w-[12px] h-[12px]" alt="user" /> {immediateNextStop.customerName}
                                  </div>
                                  <div className="bg-[rgba(240,154,17,0.2)] text-[#f09a11] px-[8px] py-[3px] rounded-[6px] text-[10px] font-semibold shrink-0 font-['Google_Sans_Flex'] border border-[rgba(240,154,17,0.2)]">
                                    Pending
                                  </div>
                                </div>

                                {/* Note */}
                                <div className="bg-white flex gap-[6px] items-start pb-[10px] w-full border-b border-[#d4d6dd] mt-1">
                                  <img src={imgNoteIcon} className="w-[20px] h-[20px] shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(12%) saturate(541%) hue-rotate(189deg) brightness(97%) contrast(89%)' }} alt="note" />
                                  <span className="text-[14px] font-normal text-[#71727a] font-['Google_Sans_Flex'] leading-snug">{immediateNextStop.notes || "Call before arrival. Use south gate. Place shed on gravel pad behind barn."}</span>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-[10px] pt-1 w-full">
                                  <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(immediateNextStop.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#d4d6dd] text-[#2f3036] font-medium py-[14px] px-[30px] rounded-[16px] transition-all active:scale-95 text-[16px] flex items-center justify-center gap-[6px] font-['Google_Sans_Flex'] decoration-none"
                                  >
                                    <img src={imgNavigateIcon} className="w-[16px] h-[16px]" alt="navigate" /> Navigate
                                  </a>
                                  <a 
                                    href={`tel:${immediateNextStop.customerPhone}`}
                                    className="flex-1 bg-[#d4d6dd] text-[#2f3036] font-medium py-[14px] px-[30px] rounded-[16px] transition-all active:scale-95 text-[16px] flex items-center justify-center gap-[6px] font-['Google_Sans_Flex'] decoration-none"
                                  >
                                    <img src={imgPhoneCallIcon} className="w-[16px] h-[16px]" alt="call" /> Call
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Upcoming Stops */}
                      {upcomingStopsList.length > 0 && (
                        <section className="space-y-[10px] pt-4">
                          <div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Upcoming Stops</h2>
                            <Link to="/upcoming-stops" className="text-[14px] font-semibold text-[#71727A] font-['Google_Sans_Flex'] decoration-none">View All</Link>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            {upcomingStopsList.map((stop) => (
                              <div key={stop.id} className="bg-white rounded-[24px] p-[12px] w-full border border-transparent shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
                                <div className="flex flex-col gap-[10px]">
                                  
                                  {/* Info */}
                                  <div className="flex gap-[6px] items-center pb-[10px] border-b border-[#e8e9f1]">
                                    <div className="bg-[#e8e9f1] w-[36px] h-[36px] rounded-[21px] flex items-center justify-center text-[#71727a] font-bold text-[14px] shrink-0 font-['Proxima_Nova']">
                                      {stop.num}
                                    </div>
                                    <span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex']">{stop.address}</span>
                                    <Link to={`/stop/${stop.id}`} className="text-[#71727a] hover:text-[#2f3036] shrink-0 w-[16px] h-[16px] flex items-center justify-center">
                                      <ChevronRight size={16} strokeWidth={3} />
                                    </Link>
                                  </div>

                                  {/* Status */}
                                  <div className="flex items-center gap-[8px] flex-wrap select-none w-full">
                                    <div className="bg-[#e8e9f1] px-[8px] py-[3px] rounded-[6px] text-[11px] font-semibold text-[#2f3036] shrink-0 font-['Proxima_Nova'] border border-[#e8e9f1]">
                                      {cleanStopType(stop.type)}
                                    </div>
                                    <div className="flex items-center gap-[2px] truncate text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex'] flex-1">
                                      <img src={imgUserIcon} className="w-[12px] h-[12px]" alt="user" /> {stop.customerName}
                                    </div>
                                    <div className="bg-[rgba(240,154,17,0.2)] text-[#f09a11] px-[8px] py-[3px] rounded-[6px] text-[10px] font-semibold shrink-0 font-['Google_Sans_Flex'] border border-[rgba(240,154,17,0.2)]">
                                      Pending
                                    </div>
                                  </div>

                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Recent Completed */}
                      {completedStopsList.length > 0 && (
                        <section className="space-y-[10px] pt-4 pb-4">
                          <div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Recent Completed</h2>
                            <Link to="/completed-stops" className="text-[14px] font-semibold text-[#71727A] font-['Google_Sans_Flex'] decoration-none">View All</Link>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            {completedStopsList.map((stop) => (
                              <div key={stop.id} className="bg-white rounded-[24px] p-[12px] w-full border border-transparent shadow-[0px_4px_15px_rgba(0,0,0,0.05)] opacity-80">
                                <div className="flex flex-col gap-[10px]">
                                  
                                  {/* Info */}
                                  <div className="flex gap-[6px] items-center pb-[10px] border-b border-[#e8e9f1]">
                                    <div className="bg-[#DCFCE7] w-[36px] h-[36px] rounded-[21px] flex items-center justify-center text-[#16A34A] font-bold text-[14px] shrink-0 font-['Proxima_Nova']">
                                      {stop.num}
                                    </div>
                                    <span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex'] text-opacity-80">{stop.address}</span>
                                    <Link to={`/stop/${stop.id}`} className="text-[#71727a] hover:text-[#2f3036] shrink-0 w-[16px] h-[16px] flex items-center justify-center">
                                      <ChevronRight size={16} strokeWidth={3} />
                                    </Link>
                                  </div>

                                  {/* Status */}
                                  <div className="flex items-center gap-[8px] flex-wrap select-none w-full">
                                    <div className="bg-[#F2F4F7] px-[8px] py-[3px] rounded-[6px] text-[11px] font-semibold text-[#2f3036] shrink-0 font-['Proxima_Nova'] border border-[#F2F4F7]">
                                      {cleanStopType(stop.type)}
                                    </div>
                                    <div className="flex items-center gap-[2px] truncate text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex'] max-w-[130px]">
                                      <img src={imgUserIcon} className="w-[12px] h-[12px]" alt="user" /> {stop.customerName}
                                    </div>
                                    <div className="bg-[#DCFCE7] text-[#16A34A] px-[8px] py-[3px] rounded-[6px] text-[10px] font-semibold shrink-0 font-['Google_Sans_Flex'] border border-[#BBF7D0]/50 ml-auto">
                                      Done
                                    </div>
                                    <span className="text-[12px] font-normal text-[#A1A2A9] font-['Google_Sans_Flex']">{stop.id === 'S-001' ? '10:26 AM' : '09:45 AM'}</span>
                                  </div>

                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                    </div>
                  );
                })()
              ) : (
                /* Empty Route State */
                <div className="mx-4 bg-white rounded-[28px] p-6 text-center border border-black/5 shadow-sm select-none">
                  <span className="text-3xl block mb-2">✨</span>
                  <h3 className="text-base font-bold text-[#2F3036] font-['Google_Sans_Flex']">No Active Route</h3>
                  <p className="text-xs text-[#71727A] mt-1.5 leading-relaxed">You have no active routes today.<br />Click the tab below to view your assigned routes.</p>
                  <Link 
                    to="/home?tab=routes"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 bg-[#FF7048] hover:bg-[#FF8563] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#FF704833] decoration-none"
                  >
                    Go to Routes ➜
                  </Link>
                </div>
              )}
            </div>

            {/* Brand Logo */}
            <div className="flex justify-center py-6 select-none">
              <img alt="ShedPro Logo" className="w-[100px] h-[38px] object-contain" src={imgCompanyLogo} />
            </div>
          </main>
        </div>
      )}

      {/* ── 2. ROUTES TAB VIEW ──────────────────────────────────────────────── */}
      {currentTab === 'routes' && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-[60px] pb-4 select-none h-[110px] shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-transparent border-transparent'}`}>
            <h1 className="text-[34px] font-semibold text-[#2F3036] tracking-tight font-['Google_Sans_Flex']">Routes</h1>
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-[#e8e9f1] flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 right-0 border-2 border-[#e8e9f1]" />
            </button>
          </header>

          {/* Segment Tabs Control */}
          <div className="flex px-4 gap-6 select-none">
            {(['Assigned', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRoutesTab(tab)}
                className={cn(
                  "py-3 text-[18px] font-[600] transition-all relative font-['Google_Sans_Flex'] cursor-pointer border-none bg-transparent",
                  activeRoutesTab === tab ? "text-[#FF7048]" : "text-[#2F3036]"
                )}
              >
                {tab}
                {activeRoutesTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#FF7048]" />
                )}
              </button>
            ))}
          </div>

          <main className="px-4 py-6 space-y-6 pb-28">
            
            {/* Assigned View */}
            {activeRoutesTab === 'Assigned' && (
              <>
                {/* Upcoming Schedule */}
                <section className="space-y-[10px]">
                  
                  <div className="space-y-4 pt-2">
                    {upcomingRoutes.map(route => (
                      <Link 
                        key={route.id} 
                        to={`/route/${route.id}`} 
                        className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center gap-4 active:scale-[0.98] transition-transform border border-black/[0.02] decoration-none"
                      >
                        {/* iOS Date Badge */}
                        <div className="w-[60px] h-[60px] bg-[#E8E9F1] rounded-[16px] flex flex-col items-center justify-center shrink-0 select-none">
                          <span className="text-[18px] font-extrabold text-[#2F3036] leading-none uppercase">
                            {route.date === 'Tomorrow' ? '22' : '26'}
                          </span>
                          <span className="text-[10px] font-semibold text-[#71727A] mt-1.5 uppercase">
                            {route.date === 'Tomorrow' ? 'APR' : 'APR'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[15px] font-bold text-[#2F3036] truncate font-['Google_Sans_Flex']">
                              {route.id} - {route.name}
                            </span>
                            <div className="bg-[#3B82F6] px-2 py-0.5 rounded-md text-[10px] font-bold text-white tracking-wider shrink-0 font-['Google_Sans_Flex']">
                              Planned
                            </div>
                          </div>
                          
                          <p className="text-[13px] text-[#71727A] truncate font-medium mt-[2px]">{route.stops[0]?.address || 'No stops'}</p>
                          
                          <div className="flex items-center gap-1 text-[11px] text-[#71727A] mt-1.5 font-medium select-none">
                            <span className="truncate">{route.startTime} • {route.stops.length} stops • Store A</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Completed Routes View */}
            {activeRoutesTab === 'Completed' && (
              <section className="space-y-[10px] pt-2">
                <div className="space-y-4">
                  {[
                    {
                      id: 'R-004',
                      name: 'Dallas TX (North)',
                      date: 'Yesterday',
                      stopsCount: 3,
                      firstStopAddress: '304 North St, Dallas TX',
                      startTime: '8:00 AM',
                      endTime: '3:30 PM'
                    },
                    {
                      id: 'R-005',
                      name: 'Houston TX (Express)',
                      date: 'Apr 24',
                      stopsCount: 2,
                      firstStopAddress: '121 South Ave, Houston TX',
                      startTime: '9:00 AM',
                      endTime: '1:15 PM'
                    }
                  ].map(route => (
                    <Link 
                      key={route.id} 
                      to={`/route/${route.id}`} 
                      className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center gap-4 active:scale-[0.98] transition-transform border border-black/[0.02] decoration-none opacity-80"
                    >
                      {/* iOS Date Badge */}
                      <div className="w-[60px] h-[60px] bg-[#E8E9F1] rounded-[16px] flex flex-col items-center justify-center shrink-0 select-none">
                        <span className="text-[18px] font-extrabold text-[#2F3036] leading-none uppercase">
                          {route.date === 'Yesterday' ? '25' : '24'}
                        </span>
                        <span className="text-[10px] font-semibold text-[#71727A] mt-1.5 uppercase">
                          APR
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[15px] font-bold text-[#2F3036] truncate font-['Google_Sans_Flex']">
                            {route.id} - {route.name}
                          </span>
                          <div className="bg-[#DCFCE7] px-2 py-0.5 rounded-md text-[10px] font-bold text-[#16A34A] tracking-wider shrink-0 font-['Google_Sans_Flex']">
                            Done
                          </div>
                        </div>
                        
                        <p className="text-[13px] text-[#71727A] truncate font-medium mt-[2px]">{route.firstStopAddress}</p>
                        
                        <div className="flex items-center gap-1 text-[11px] text-[#71727A] mt-1.5 font-medium select-none">
                          <span className="truncate">{route.startTime} - {route.endTime} • {route.stopsCount} stops</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </main>
        </div>
      )}

      {/* ── 3. CALENDAR TAB VIEW ────────────────────────────────────────────── */}
      {currentTab === 'calendar' && (
        <div className="flex-1 flex flex-col">
          <header className={`flex items-center justify-between px-4 pt-[60px] pb-4 select-none h-[110px] shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-transparent border-transparent'}`}>
            <h1 className="text-[34px] font-semibold text-[#2F3036] tracking-tight font-['Google_Sans_Flex']">Calendar</h1>
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-[#e8e9f1] flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 right-0 border-2 border-[#e8e9f1]" />
            </button>
          </header>
          <main className="px-4 pb-28 space-y-6 pt-2">
            <p className="text-[17px] font-bold text-[#2F3036] font-['Google_Sans_Flex']">Coming Soon!</p>
          </main>
        </div>
      )}

      {/* ── 3. PROFILE TAB VIEW ──────────────────────────────────────────────── */}
      {currentTab === 'profile' && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-[60px] pb-4 select-none h-[110px] shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-transparent border-transparent'}`}>
            <h1 className="text-[34px] font-semibold text-[#2F3036] tracking-tight font-['Google_Sans_Flex']">Profile</h1>
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-[#e8e9f1] flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 right-0 border-2 border-[#e8e9f1]" />
            </button>
          </header>

          <main className="px-4 py-2 space-y-6 pb-28">
            {/* Driver Info Card */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm flex items-center gap-4 border border-black/[0.02]">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-black/5 bg-gray-200">
                <img alt="Driver" className="w-full h-full object-cover" src={imgUserImage} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#2F3036] truncate font-['Google_Sans_Flex']">{activeDriver.name}</h2>
                <p className="text-[13px] text-[#71727A] font-semibold truncate mt-0.5">Driver ID: SHD-4890</p>
                <p className="text-[12px] text-[#FF7048] font-bold truncate mt-0.5">Vehicle: Ford F-550 (Plate: 83A-4927)</p>
              </div>
            </div>

            {/* Today's Stats Card */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.02] space-y-4">
              <h3 className="text-[14px] font-bold text-[#71727A] uppercase tracking-wider">Today's Performance</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#F2F4F7] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#71727A] font-bold uppercase block">Hours</span>
                  <span className="text-[18px] font-extrabold text-[#2F3036] mt-0.5 block">6.2h</span>
                </div>
                <div className="bg-[#F2F4F7] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#71727A] font-bold uppercase block">Miles</span>
                  <span className="text-[18px] font-extrabold text-[#2F3036] mt-0.5 block">142 mi</span>
                </div>
                <div className="bg-[#F2F4F7] p-3 rounded-2xl">
                  <span className="text-[11px] text-[#71727A] font-bold uppercase block">Stops</span>
                  <span className="text-[18px] font-extrabold text-[#2F3036] mt-0.5 block">2/5</span>
                </div>
              </div>
            </div>

            {/* Settings Toggles */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.02] space-y-4">
              <h3 className="text-[14px] font-bold text-[#71727A] uppercase tracking-wider">System Configuration</h3>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="text-[15px] font-bold text-[#2F3036]">GPS High Precision</span>
                  <span className="text-[12px] text-[#71727A] font-semibold">Increase real-time location accuracy</span>
                </div>
                <button
                  onClick={() => setGpsPrecision(!gpsPrecision)}
                  className={cn(
                    "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border-none",
                    gpsPrecision ? "bg-[#ff7048]" : "bg-gray-200"
                  )}
                >
                  <div className={cn("bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200", gpsPrecision ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="text-[15px] font-bold text-[#2F3036]">Push Notifications</span>
                  <span className="text-[12px] text-[#71727A] font-semibold">Receive route updates from Dispatcher</span>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={cn(
                    "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border-none",
                    pushNotifications ? "bg-[#ff7048]" : "bg-gray-200"
                  )}
                >
                  <div className={cn("bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200", pushNotifications ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="text-[15px] font-bold text-[#2F3036]">Offline Sync Mode</span>
                  <span className="text-[12px] text-[#71727A] font-semibold">Auto save and sync data when offline</span>
                </div>
                <button
                  onClick={() => setOfflineSync(!offlineSync)}
                  className={cn(
                    "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border-none",
                    offlineSync ? "bg-[#ff7048]" : "bg-gray-200"
                  )}
                >
                  <div className={cn("bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200", offlineSync ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>
            </div>

            {/* Logout and data action buttons */}
            <div className="space-y-3 pt-4">
              <button 
                onClick={resetData}
                className="w-full bg-[#E8E9F1] hover:bg-gray-200 text-[#2F3036] font-bold py-3.5 rounded-2xl text-[14px] transition active:scale-[0.99] cursor-pointer border-none"
              >
                Reset App Data Sync
              </button>
              
              <button 
                onClick={() => { alert('Logout logic triggered'); }}
                className="w-full bg-red-500/10 hover:bg-red-500/15 text-red-600 font-bold py-3.5 rounded-2xl text-[14px] transition active:scale-[0.99] cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                <LogOut size={16} /> Logout Account
              </button>
            </div>
          </main>
        </div>
      )}


      {/* ── 4. NOTIFICATIONS SLIDING OVERLAY PANEL ──────────────────────────── */}
      {showNotifications && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end select-none">
          {/* Dismiss Click Area */}
          <div className="flex-1" onClick={() => setShowNotifications(false)} />
          
          {/* Notification Card Panel */}
          <div className="bg-white rounded-t-[32px] p-5 max-h-[75%] flex flex-col space-y-4 border-t border-gray-150 animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#2F3036] flex items-center gap-2 font-['Google_Sans_Flex']">
                <span>🔔</span> Notifications Inbox
              </h2>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-6 no-scrollbar">
              {mockNotifications.map(notification => (
                <div key={notification.id} className="p-4 bg-[#F2F4F7] rounded-[20px] flex gap-3 items-start border border-black/[0.01]">
                  <div className={cn(
                    "p-2 rounded-full shrink-0",
                    notification.type === 'update' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                    notification.type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  )}>
                    {notification.type === 'update' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bold text-[#2F3036] text-[14px] font-['Google_Sans_Flex']">{notification.title}</span>
                      <span className="text-[11px] text-[#71727A] font-semibold">{notification.time}</span>
                    </div>
                    <p className="text-[12px] text-[#71727A] font-medium leading-relaxed mt-1 font-sans">{notification.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. DRIVER PROFILE SELECTION SWITCH OVERLAY ───────────────────────── */}
      {showDriverMenu && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end select-none">
          {/* Dismiss Click Area */}
          <div className="flex-1" onClick={() => setShowDriverMenu(false)} />
          
          {/* Active Switcher Card Panel */}
          <div className="bg-white rounded-t-[32px] p-5 max-h-[75%] flex flex-col space-y-4 border-t border-gray-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#2F3036] flex items-center gap-1.5 font-['Google_Sans_Flex']">
                <span>👤</span> Switch Active Driver
              </h2>
              <button 
                onClick={() => setShowDriverMenu(false)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pb-6 no-scrollbar">
              {drivers.map(drv => (
                <div 
                  key={drv.id} 
                  onClick={() => {
                    switchDriver(drv.id);
                    setShowDriverMenu(false);
                  }}
                  className={cn(
                    "p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition border",
                    drv.id === activeDriver.id 
                      ? "bg-[#ff7048]/10 border-[#ff7048] text-[#ff7048]" 
                      : "bg-[#F2F4F7] hover:bg-gray-200 border-transparent text-[#2F3036]"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-black/5 bg-gray-200 select-none">
                    <img alt={drv.name} className="w-full h-full object-cover" src={imgUserImage} />
                  </div>
                  <span className="font-bold text-[14px] flex-1 truncate font-['Google_Sans_Flex']">{drv.name}</span>
                  {drv.id === activeDriver.id && <span className="font-bold text-xs uppercase tracking-wide bg-[#ff7048] text-white px-2 py-0.5 rounded-md font-sans">Active</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
