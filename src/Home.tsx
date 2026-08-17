import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';
import { StopCard } from './components/StopCard';
import { RouteSummaryCard } from './components/home/RouteSummaryCard';
import { EmptyRouteState } from './components/home/EmptyRouteState';
import { CompletedRouteState } from './components/home/CompletedRouteState';
import { UpcomingRoutesSection } from './components/home/UpcomingRoutesSection';
import { ScheduleView } from './components/schedule/ScheduleView';
import { RouteUpdateNotice } from './components/RouteUpdateNotice';
import { Bell, ChevronRight, User, Info, Clock, LogOut, CheckCircle2, AlertCircle, Phone, MapPin, Calendar as CalendarIcon, CircleUserRound, MessageSquare, X } from 'lucide-react';
import { cn, cleanStopType, getStopHeader } from './lib/utils';

import imgUserImage from './assets/3271fc3a53481ca6ba5eb96b8724359f747c54a3.png';
import imgCompanyLogo from '../icon/Logo/Powered by ShedPro.svg';
import imgNotificationIcon from '../icon/ic-notification.svg';
import imgNavigateIcon from '../icon/ic-navigate.svg';
import imgPhoneCallIcon from '../icon/ic-phone-call.svg';
import imgUserIcon from '../icon/ic-user.svg';
import imgNoteIcon from '../icon/Note Icon.svg';
import imgMapOverview from './assets/map-overview.jpg';

import imgNavHome from '../icon/ic-home.svg';
import imgNavCalendar from '../icon/ic-calendar.svg';
import imgNavRoutes from '../icon/ic-routes.svg';
import imgNavProfile from '../icon/ic-user.svg';

const getRemainingDistance = (routeId: string, stops: any[]) => {
  const completedCount = stops.filter(s => s.status === 'Done').length;
  const totalCount = stops.length;
  const remaining = totalCount - completedCount;
  if (remaining <= 0) return '0.0 mi';
  
  if (routeId === 'RT-006') {
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
  const navigate = useNavigate();
  const {
    activeDriver,
    drivers,
    routes,
    switchDriver,
    resetData,
    routeUpdates,
    acknowledgeRouteUpdate
  } = useDriver();

  // Get active tab from query parameters
  const [isScrolled, setIsScrolled] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'home';

  // State inside Schedule Tab
  const [scheduleViewMode, setScheduleViewMode] = useState<'list' | 'calendar'>('list');
  const [activeRoutesTab, setActiveRoutesTab] = useState<'Assigned' | 'Completed'>('Assigned');
  const todayDateKey = (() => {
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[now.getMonth()]} ${now.getDate()}`;
  })();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(todayDateKey);
  const [calendarViewMode, setCalendarViewMode] = useState<'week' | 'month'>('month');

  // Modals & expanders states
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [showDriverMenu, setShowDriverMenu] = useState(false);
  const [upcomingStopsExpanded, setUpcomingStopsExpanded] = useState(false);

  // Settings states
  const [gpsPrecision, setGpsPrecision] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);

  // Find active route (En Route or Today's Planned route)
  const activeRoute = routes.find(r => r.status === 'En Route') || routes.find(r => r.status === 'Planned' && r.date === 'Today');
  const activeRouteUpdate = routeUpdates.find(update => update.routeId === activeRoute?.id && !update.acknowledged);

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

  useEffect(() => {
    const mainEl = document.getElementById('scroll-container');
    if (!mainEl) return;
    const handleScroll = (e: any) => {
      setIsScrolled(e.target.scrollTop > 10);
    };
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  // Calendar helpers (computed once at component level)

  const calendarNow = new Date();
  const calendarMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const calendarMonthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const calendarWeekdaysShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const calendarYear = calendarNow.getFullYear();
  const calendarMonth = calendarNow.getMonth(); // 0-indexed
  const calendarMonthLabel = calendarMonthNames[calendarMonth];
  const calendarMonthKey = calendarMonthShort[calendarMonth];
  const calendarDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const calendarFirstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
  // Build week strip for current month
  const CALENDAR_DAYS_STRIP = Array.from({ length: calendarDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dayDate = new Date(calendarYear, calendarMonth, dayNum);
    const dayName = calendarWeekdaysShort[dayDate.getDay()];
    return { dayName, dayNum: String(dayNum), dateKey: `${calendarMonthKey} ${dayNum}` };
  });
  const daysInMonthArr = Array.from({ length: calendarDaysInMonth }, (_, i) => i + 1);

  return (
    <div className="driver-home-page relative min-h-full bg-[#f0f2f6] font-sans">

      {/* ── 1. HOME TAB VIEW ────────────────────────────────────────────────── */}
      {currentTab === 'home' && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-4 md:pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#f0f2f6]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
            <h1 className="text-[28px] font-semibold text-[#2B3B63] font-['Google_Sans_Flex'] m-0">My Route</h1>
            
            <div className="flex items-center gap-[10px]">
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative flex items-center justify-center shrink-0 size-[44px] cursor-pointer border-none bg-transparent active:scale-95 transition-transform"
              >
                <Bell size={24} strokeWidth={2.5} className="text-[#71727A]" />
                <div className="absolute bg-[#f52525] rounded-full size-[10px] top-[10px] right-[10px] border-2 border-[#f0f2f6]" />
              </button>
              
              <Link 
                to="/home?tab=profile"
                className="relative flex items-center justify-center shrink-0 size-[44px] cursor-pointer border-none bg-transparent active:scale-95 transition-transform text-[#2B3B63]"
              >
                <CircleUserRound size={24} strokeWidth={2.5} className="text-[#71727A]" />
              </Link>
            </div>
          </header>

          <main className="px-4 pb-0 flex flex-col flex-1">
            <div>
              
              {activeRoute ? (
                (() => {
                  const stops = activeRoute.stops;
                  const actualStops = stops.filter(s => !s.workOrders.some(wo => wo.action === 'Start' || wo.action === 'End'));
                  const totalStops = actualStops.length;
                  const completedStopsCount = actualStops.filter(s => s.status === 'Done').length;
                  
                  const progressPercentage = totalStops > 0 ? (completedStopsCount / totalStops) * 100 : 0;
                  const estCompletion = activeRoute.id === 'RT-006' ? '15 Aug' : 'TBD';
                  const remainingDistanceStr = getRemainingDistance(activeRoute.id, actualStops);

                  const nextStop = actualStops.find(s => s.status !== 'Done');
                  
                  return (
                    /* Section A & B */
                    <div className="flex flex-col gap-[20px] w-full">
                      
                      {/* Section A: Route Summary Card */}
                      <RouteSummaryCard 
                        route={activeRoute}
                        completedStopsCount={completedStopsCount}
                        totalStops={totalStops}
                        progressPercentage={progressPercentage}
                        remainingDistanceStr={remainingDistanceStr}
                        onInfoClick={(note) => setSelectedNote(note)}
                      />

                      {activeRouteUpdate && (
                        <RouteUpdateNotice update={activeRouteUpdate} onAcknowledge={acknowledgeRouteUpdate} />
                      )}

                      {/* Section B: Current Stop Detail and Upcoming */}
                      {nextStop ? (
                        <div className="flex flex-col">
                          <div className="pb-4">
                            <StopCard
                              stop={nextStop}
                              routeId={activeRoute.id}
                              title={nextStop.status === 'Servicing' ? 'Current Stop' : activeRoute.status === 'Planned' ? 'Suggested Stop' : 'Next Stop'}
                              hideAction={false}
                              className="rounded-[18px] border border-[#E3E5EA] shadow-[0_4px_14px_rgba(43,59,99,0.07)]"
                            />
                          </div>
                          <UpcomingRoutesSection />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <CompletedRouteState routeId={activeRoute.id} />
                          <UpcomingRoutesSection />
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                /* Empty Route State */
                <div className="flex flex-col gap-[24px]">
                  <EmptyRouteState />
                  <UpcomingRoutesSection />
                </div>
              )}
            </div>

            {/* Brand Logo */}
            <div className="-mx-4 bg-white flex justify-center pt-6 pb-28 select-none flex-1">
              <img alt="ShedPro Logo" className="w-[100px] h-[38px] object-contain" src={imgCompanyLogo} />
            </div>
          </main>
        </div>
      )}



      {/* ── 2. SCHEDULE TAB VIEW ──────────────────────────────────────────────── */}
      {currentTab === 'schedule' && (
        <div className="flex-1 flex flex-col bg-[#F4F5F8]">
          <header className="flex items-center px-4 pt-4 md:pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 bg-[#F4F5F8]/95 backdrop-blur-md">
            <h1 className="m-0 text-[28px] font-semibold text-[#2B3B63] font-['Google_Sans_Flex']">Schedule</h1>
          </header>
          <ScheduleView />
        </div>
      )}

      {/* Legacy schedule retained temporarily while the new unified views are validated. */}
      {false && currentTab === 'schedule' && (
        <div className="flex-1 flex flex-col bg-[#f8f9fe]">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-4 md:pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#f8f9fe]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
            <div className="flex-1 flex flex-col justify-center text-[28px] font-semibold text-[#2B3B63] font-['Google_Sans_Flex']">Schedule</div>
          </header>

          {/* Master View Toggle (List vs Calendar) */}
          <div className="flex mx-4 mb-2 bg-[#E8E9F1] rounded-full p-1 select-none">
            <button
              onClick={() => setScheduleViewMode('list')}
              className={`flex-1 py-1.5 rounded-full text-[14px] font-bold transition-all border-none cursor-pointer flex items-center justify-center gap-2 ${scheduleViewMode === 'list' ? 'bg-white shadow-sm text-[#2B3B63]' : 'bg-transparent text-[#71727A]'}`}
            >
              List
            </button>
            <button
              onClick={() => setScheduleViewMode('calendar')}
              className={`flex-1 py-1.5 rounded-full text-[14px] font-bold transition-all border-none cursor-pointer flex items-center justify-center gap-2 ${scheduleViewMode === 'calendar' ? 'bg-white shadow-sm text-[#2B3B63]' : 'bg-transparent text-[#71727A]'}`}
            >
              Calendar
            </button>
          </div>

          {scheduleViewMode === 'list' ? (
            <>
              {/* Segment Tabs Control for List View */}
              <div className="flex mx-4 select-none" style={{ borderBottom: '1px solid #D4D6DD' }}>
                {(['Assigned', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRoutesTab(tab)}
                className="flex-1 py-[10px] bg-transparent border-none cursor-pointer flex justify-center items-center"
                style={{ borderBottom: activeRoutesTab === tab ? '4px solid #FF7048' : '4px solid transparent', marginBottom: '-1px' }}
              >
                <span style={{ color: activeRoutesTab === tab ? '#FF7048' : '#2B3B63', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{tab}</span>
              </button>
            ))}
          </div>

          <main className="px-4 py-6 space-y-6 pb-28">
            

            {/* Assigned View */}
            {activeRoutesTab === 'Assigned' && (
              <section className="pt-2">
                {(() => {
                  const grouped = upcomingRoutes.reduce((acc, route) => {
                    const month = route.monthName || (route.startDate ? route.startDate.split(' ')[0] : 'Jun');
                    if (!acc[month]) acc[month] = [];
                    acc[month].push(route);
                    return acc;
                  }, {});
                  return Object.entries(grouped).map(([month, rts]) => (
                    <div key={month} className="mb-4">
                      <h3 className="text-[16px] font-bold text-[#2B3B63] m-0 font-['Google_Sans_Flex'] mb-3 px-1">{month}</h3>
                      <div className="flex flex-col gap-2">
                        {rts.map(route => {
                          const totalWOs = route.stops.reduce((sum, stop) => sum + (stop.workOrders ? stop.workOrders.length : 0), 0);
                          const startDate = route.startDate || 'Jun 26';
                          const startParts = startDate.split(' ');
                          const dayDisplay = startParts[1] || startDate;
                          const monthDisplay = startParts[0] || 'Jun';
                          return (
                            <Link 
                              key={route.id} 
                              to={`/route/${route.id}`} state={{ from: location.pathname + location.search }} 
                              className="w-full bg-[#E4E6EC] rounded-[16px] p-[12px] flex justify-between items-center decoration-none active:scale-[0.98] transition-transform border border-transparent"
                            >
                              <div className="flex items-center gap-[12px]">
                                <div className="w-[54px] py-[8px] self-stretch bg-white/60 overflow-hidden rounded-[10px] flex flex-col items-center justify-center gap-[4px] border-t-[3px] shrink-0" style={{ borderTopColor: route.stripeColor || '#3B82F6' }}>
                                   <span className="text-[#2B3B63] text-[15px] font-bold font-['Google_Sans_Flex'] leading-none">{dayDisplay}</span>
                                   <span className="text-[#71727A] text-[12px] font-semibold font-['Google_Sans_Flex'] leading-none">{monthDisplay}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h4 className="text-[#2B3B63] font-bold text-[16px] m-0 font-['Google_Sans_Flex']">{route.name}</h4>
                                  <span className="text-[#71727A] text-[13px] font-['Google_Sans_Flex']">
                                    {totalWOs} work orders &middot; {route.stops.length || route.stopsCount} stops
                                  </span>
                                </div>
                              </div>
                              <div className="bg-white size-[32px] rounded-full flex items-center justify-center shrink-0 shadow-sm ml-2">
                                <ChevronRight size={18} className="text-[#2B3B63]"/>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </section>
            )}

            {/* Completed Routes View */}
            {activeRoutesTab === 'Completed' && (
              <section className="pt-2">
                {(() => {
                  const completedRts = routes.filter(r => r.status === 'Completed');
                  const grouped = completedRts.reduce((acc, route) => {
                    const month = route.monthName || (route.startDate ? route.startDate.split(' ')[0] : 'Jun');
                    if (!acc[month]) acc[month] = [];
                    acc[month].push(route);
                    return acc;
                  }, {});
                  return Object.entries(grouped).map(([month, rts]) => (
                    <div key={month} className="mb-4">
                      <h3 className="text-[16px] font-bold text-[#2B3B63] m-0 font-['Google_Sans_Flex'] mb-3 px-1">{month}</h3>
                      <div className="flex flex-col gap-2">
                        {rts.map(route => {
                          const totalWOs = route.stops?.reduce((sum, stop) => sum + (stop.workOrders ? stop.workOrders.length : 0), 0) || 0;
                          const startDate = route.startDate || 'Jun 26';
                          const startParts = startDate.split(' ');
                          const dayDisplay = startParts[1] || startDate;
                          const monthDisplay = startParts[0] || 'Jun';
                          return (
                            <Link 
                              key={route.id} 
                              to={`/route/${route.id}`} state={{ from: location.pathname + location.search }} 
                              className="w-full bg-[#E4E6EC] rounded-[16px] p-[12px] flex justify-between items-center decoration-none active:scale-[0.98] transition-transform border border-transparent"
                            >
                              <div className="flex items-center gap-[12px]">
                                <div className="w-[54px] py-[8px] self-stretch bg-white/60 overflow-hidden rounded-[10px] flex flex-col items-center justify-center gap-[4px] border-t-[3px] shrink-0" style={{ borderTopColor: route.stripeColor || '#2FA301' }}>
                                   <span className="text-[#2B3B63] text-[15px] font-bold font-['Google_Sans_Flex'] leading-none">{dayDisplay}</span>
                                   <span className="text-[#71727A] text-[12px] font-semibold font-['Google_Sans_Flex'] leading-none">{monthDisplay}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h4 className="text-[#2B3B63] font-bold text-[16px] m-0 font-['Google_Sans_Flex']">{route.name}</h4>
                                  <span className="text-[#71727A] text-[13px] font-['Google_Sans_Flex']">
                                    {totalWOs} work orders &middot; {route.stops?.length || route.stopsCount} stops
                                  </span>
                                </div>
                              </div>
                              <div className="bg-white size-[32px] rounded-full flex items-center justify-center shrink-0 shadow-sm ml-2">
                                <ChevronRight size={18} className="text-[#2B3B63]"/>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </section>
            )}

          </main>
          </>
          ) : (
            <div className="flex-1 flex flex-col pb-28">
              {(() => {

        const getRouteRange = (route: any) => {
          const startStr = route.startDate || route.date || '';
          const endStr = route.endDate || startStr;
          return { startStr, endStr };
        };



        const isRouteActiveOnDate = (route: any, targetDate: string) => {
          const { startStr, endStr } = getRouteRange(route);
          if (!startStr || !endStr) return false;
          const parseDate = (str: string) => {
            const parts = str.split(' ');
            if (parts.length === 2) {
              const mIdx = calendarMonthShort.indexOf(parts[0]);
              const d = parseInt(parts[1], 10);
              if (mIdx >= 0 && !isNaN(d)) return new Date(calendarYear, mIdx, d).getTime();
            }
            return null;
          };
          const targetT = parseDate(targetDate);
          const startT = parseDate(startStr);
          const endT = parseDate(endStr);
          if (targetT !== null && startT !== null && endT !== null) {
            return targetT >= startT && targetT <= endT;
          }
          return startStr === targetDate;
        };

        // For a given dateKey, find the route active on that day and return its stripeColor
        const getRouteColorForDate = (dateKey: string): string | null => {
          const r = routes.find(route => isRouteActiveOnDate(route, dateKey));
          return r ? r.stripeColor : null;
        };

        const calendarRoutes = routes.filter(r => isRouteActiveOnDate(r, selectedCalendarDate));

        return (
          <div className="flex-1 flex flex-col bg-transparent">

            {/* Month / Week View Mode Toggle Selector — Month first */}
            <div className="flex mx-4 shrink-0 mt-2 mb-4" style={{ borderBottom: '1px solid #D4D6DD' }}>
              <button 
                onClick={() => setCalendarViewMode('month')}
                className="flex-1 py-[10px] bg-transparent border-none cursor-pointer flex justify-center items-center"
                style={{ borderBottom: calendarViewMode === 'month' ? '4px solid #FF7048' : '4px solid transparent', marginBottom: '-1px' }}
              >
                <span style={{ color: calendarViewMode === 'month' ? '#FF7048' : '#2B3B63', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Month</span>
              </button>
              <button 
                onClick={() => setCalendarViewMode('week')}
                className="flex-1 py-[10px] bg-transparent border-none cursor-pointer flex justify-center items-center"
                style={{ borderBottom: calendarViewMode === 'week' ? '4px solid #FF7048' : '4px solid transparent', marginBottom: '-1px' }}
              >
                <span style={{ color: calendarViewMode === 'week' ? '#FF7048' : '#2B3B63', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Week</span>
              </button>
            </div>

            {/* Month Header Dropdown */}
            <div className="flex items-center gap-[10px] px-4 select-none cursor-pointer shrink-0 mb-4">
              <div className="flex flex-col justify-center text-[#2B3B63] text-[26px] font-semibold font-['Google_Sans_Flex'] break-words">{calendarMonthLabel}</div>
              <div className="w-[16px] h-[16px] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.349 4L8.25456 8.94671L3.16013 4L1.58789 5.5266L8.25456 12L14.9212 5.5266L13.349 4Z" fill="#71727A"/>
                </svg>
              </div>
            </div>

            <main className="px-4 pb-28 flex flex-col gap-[20px]">
              {/* Top Selector Grid/Strip */}
              {calendarViewMode === 'week' ? (
                /* Horizontal Calendar strip — full bleed, no right margin gap */
                <div
                  id="calendar-week-strip"
                  className="flex items-center gap-[10px] overflow-x-auto no-scrollbar shrink-0 -mx-4 px-4 pb-4"
                  style={{ width: 'calc(100% + 32px)' }}
                >
                  {CALENDAR_DAYS_STRIP.map((day) => {
                    const isActive = selectedCalendarDate === day.dateKey;
                    const routeColor = getRouteColorForDate(day.dateKey);
                    const todayKey = `${calendarMonthKey} ${calendarNow.getDate()}`;
                    const isToday = day.dateKey === todayKey;

                    return (
                      <button
                        key={day.dateKey}
                        id={`week-day-${day.dateKey.replace(' ', '-')}`}
                        onClick={() => setSelectedCalendarDate(day.dateKey)}
                        className="flex flex-col items-center justify-center gap-[8px] border-none cursor-pointer select-none shrink-0 transition-all rounded-[11px]"
                        style={{
                          width: 64,
                          minWidth: 64,
                          height: 80,
                          paddingTop: 12,
                          paddingBottom: 12,
                          background: (isActive || isToday) ? '#2B3B63' : 'white',
                          boxShadow: (isActive || isToday) ? 'none' : '0px 4px 15px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div className="w-[32px] h-[4px] bg-transparent rounded-[4px]" />
                        <div className="self-stretch flex flex-col items-center justify-start">
                          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Google Sans Flex', textAlign: 'center', textTransform: 'uppercase', color: (isActive || isToday) ? '#D4D6DD' : '#71727A' }}>
                            {day.dayName}
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex', textAlign: 'center', color: (isActive || isToday) ? 'white' : '#2B3B63', marginTop: 2 }}>
                            {day.dayNum}
                          </span>
                        </div>
                        <div 
                          style={{
                            width: 32,
                            height: 4,
                            borderRadius: 4,
                            background: routeColor || 'transparent',
                            opacity: routeColor ? 1 : 0,
                            transition: 'opacity 0.2s'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Monthly grid calendar */
                <div className="bg-white rounded-[24px] p-4 shadow-[0px_8px_40px_rgba(0,0,0,0.10)] shrink-0 select-none flex flex-col gap-2">
                  {/* Weekday headers - Sun first */}
                  <div className="flex items-center justify-between pb-2">
                    {calendarWeekdaysShort.map(d => (
                      <div key={d} className="flex-1 text-center" style={{ fontSize: 12, fontWeight: 600, color: '#71727A', fontFamily: 'Google Sans Flex' }}>
                        {d.toUpperCase()}
                      </div>
                    ))}
                  </div>
                  {/* Rows of weeks */}
                  <div className="flex flex-col">
                    {(() => {
                      const cells: (number | null)[] = [
                        ...Array(calendarFirstDayOfWeek).fill(null),
                        ...daysInMonthArr
                      ];
                      // pad to full rows of 7
                      while (cells.length % 7 !== 0) cells.push(null);
                      const rows: (number | null)[][] = [];
                      for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
                      return rows.map((row, ri) => (
                        <div key={ri} className="flex items-center justify-between py-[10px]" style={{ borderBottom: ri < rows.length - 1 ? '1px solid #D4D6DD' : 'none' }}>
                          {row.map((dayNum, ci) => {
                            if (dayNum === null) {
                              return <div key={ci} className="flex-1 flex flex-col items-center gap-[4px]"><div style={{ width: 30, height: 30 }} /><div style={{ width: 32, height: 4 }} /></div>;
                            }
                            const dateKey = `${calendarMonthKey} ${dayNum}`;
                            const isActive = selectedCalendarDate === dateKey;
                            const routeColor = getRouteColorForDate(dateKey);
                            return (
                              <div key={dayNum} className="flex-1 flex flex-col items-center gap-[4px]">
                                <button
                                  onClick={() => setSelectedCalendarDate(dateKey)}
                                  style={{
                                    width: 30, height: 30, borderRadius: 26, border: 'none', cursor: 'pointer',
                                    background: isActive ? '#2B3B63' : 'white',
                                    color: isActive ? 'white' : '#2B3B63',
                                    fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                                  }}
                                >
                                  {dayNum}
                                </button>
                                <div style={{ width: 32, height: 4, borderRadius: 4, background: routeColor || 'transparent', opacity: routeColor ? 1 : 0, transition: 'opacity 0.2s' }} />
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Schedule header */}
              <div className="flex items-center justify-between mt-2">
                <span style={{ fontSize: 16, fontWeight: 600, color: '#2B3B63', fontFamily: 'Google Sans Flex' }}>Schedule</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#71727A', fontFamily: 'Google Sans Flex' }}>{calendarRoutes.length} {calendarRoutes.length === 1 ? 'Route' : 'Routes'}</span>
              </div>

              {/* Routes Schedule list */}
              {calendarRoutes.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
                  {calendarRoutes.map((route) => {
                    const { startStr, endStr } = getRouteRange(route);
                    const startParts = startStr.split(' ');
                    const endParts = endStr.split(' ');
                    const dayStr = (startStr !== endStr && startParts.length === 2 && endParts.length === 2)
                      ? `${startParts[1]}-${endParts[1]}` : (startParts[1] || startStr);
                    const monthStr = startParts[0] || calendarMonthKey;
                    return (
                      <Link 
                        key={route.id} 
                        to={`/route/${route.id}`} state={{ from: location.pathname + location.search }} 
                        className="self-stretch bg-white rounded-[24px] flex items-start p-[12px] gap-[16px] decoration-none active:scale-[0.98] transition-transform"
                        style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.10)', outline: '2px solid white', outlineOffset: '-2px' }}
                      >
                        <div 
                          className="w-[54px] self-stretch px-[2px] py-[12px] bg-[#E8E9F1] overflow-hidden rounded-[11px] flex flex-col items-center justify-center gap-[8px]"
                          style={{ borderTop: `3px ${route.stripeColor} solid` }}
                        >
                          <div className="flex flex-col items-center justify-start">
                            <span style={{ color: '#2B3B63', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{dayStr}</span>
                            <span style={{ color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', marginTop: 2 }}>{monthStr}</span>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-start gap-[4px]">
                          <span style={{ color: '#2B3B63', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{route.name}</span>
                          <span style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex' }} className="truncate self-stretch">{route.stops[0]?.address || route.startingAddress || 'No stops assigned'}</span>
                          <span style={{ color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex' }}>
                            {startStr !== endStr ? `${startStr}, ${route.startTime || '09:00 AM'} - ${endStr}, ${route.endTime || '07:00 PM'}` : `${route.startTime || '09:00 AM'} - ${route.endTime || '07:00 PM'}`}
                          </span>
                          <span style={{ color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex' }}>
                            {route.stops.length > 0 ? route.stops.length : route.stopsCount} stops • {route.dealerName || 'Store A'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white/40 rounded-[24px] border-2 border-dashed border-[#C5C6CC]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <CalendarIcon size={24} className="text-[#71727A]" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#2B3B63', fontFamily: 'Google Sans Flex' }}>No Routes Scheduled</p>
                  <p style={{ fontSize: 12, color: '#71727A', fontFamily: 'Google Sans Flex', maxWidth: 200 }}>There are no routes scheduled for this date.</p>
                </div>
              )}
            </main>
          </div>
        );
      })()}
            </div>
          )}
        </div>
      )}





      {/* ── 3. PROFILE TAB VIEW ──────────────────────────────────────────────── */}
      {currentTab === 'profile' && (
        <div className="flex-1 flex flex-col bg-[#f8f9fe]">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-4 md:pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#f8f9fe]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
            <div className="flex-1 flex flex-col justify-center text-[28px] font-semibold text-[#2B3B63] font-['Google_Sans_Flex']">Profile</div>
          </header>

          <main className="px-4 py-2 space-y-4 pb-28">
            {/* Driver Info & Performance Card */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.02]">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-black/5 bg-gray-200">
                    <img alt="Driver" className="w-full h-full object-cover" src={imgUserImage} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-[#2B3B63] truncate font-['Google_Sans_Flex']">{activeDriver.name}</h2>
                    <p className="text-[13px] text-[#71727A] font-semibold truncate mt-0.5">ID: SHD-4890 • Ford F-550</p>
                  </div>
                </div>
                <button className="text-[#FF7048] bg-[#FF7048]/10 rounded-full p-2 hover:bg-[#FF7048]/20 transition-colors border-none cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-[18px] font-extrabold text-[#2B3B63]">1,240</span>
                  <span className="text-[11px] text-[#71727A] font-bold mt-1 text-center leading-tight">Total<br/>Miles</span>
                </div>
                <div className="flex flex-col items-center border-x border-gray-100 px-2">
                  <span className="text-[18px] font-extrabold text-[#2B3B63]">145</span>
                  <span className="text-[11px] text-[#71727A] font-bold mt-1 text-center leading-tight">Completed<br/>Routes</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[18px] font-extrabold text-[#2B3B63]">892</span>
                  <span className="text-[11px] text-[#71727A] font-bold mt-1 text-center leading-tight">Completed<br/>WOs</span>
                </div>
              </div>
            </div>

            {/* List Actions */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-black/[0.02]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8E9F1] flex items-center justify-center">
                    <MessageSquare size={16} className="text-[#2B3B63]" />
                  </div>
                  <span className="text-[15px] font-bold text-[#2B3B63]">Feedback & Bug Report</span>
                </div>
                <ChevronRight size={18} className="text-[#9CA3AF]" />
              </div>
              <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8E9F1] flex items-center justify-center">
                    <Info size={16} className="text-[#2B3B63]" />
                  </div>
                  <span className="text-[15px] font-bold text-[#2B3B63]">App Information</span>
                </div>
                <ChevronRight size={18} className="text-[#9CA3AF]" />
              </div>
            </div>

            {/* Logout Section */}
            <button 
              onClick={() => navigate('/login', { replace: true })}
              className="w-full mt-4 bg-white shadow-sm border border-black/[0.02] text-[#ef4444] font-bold py-4 rounded-[24px] text-[15px] transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Log Out
            </button>
          </main>
        </div>
      )}


      {/* ── 4. NOTIFICATIONS SLIDING OVERLAY PANEL ──────────────────────────── */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end select-none">
          {/* Dismiss Click Area */}
          <div className="flex-1" onClick={() => setShowNotifications(false)} />
          
          {/* Notification Card Panel */}
          <div className="bg-white rounded-t-[32px] p-5 h-[50%] min-h-[50%] max-h-[50%] flex flex-col gap-4 border-t border-gray-150 animate-in slide-in-from-bottom duration-150 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-[#2B3B63] flex items-center gap-2 font-['Google_Sans_Flex']">
                <span>🔔</span> Notifications Inbox
              </h2>
              <button 
                onClick={() => setShowNotifications(false)}
                className="size-9 rounded-full bg-[#F2F4F7] text-[#71727A] hover:text-[#2B3B63] flex items-center justify-center cursor-pointer border-none active:scale-95 transition-transform"
                aria-label="Close notifications"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-6 no-scrollbar overscroll-contain">
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
                      <span className="font-bold text-[#2B3B63] text-[14px] font-['Google_Sans_Flex']">{notification.title}</span>
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
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end select-none">
          {/* Dismiss Click Area */}
          <div className="flex-1" onClick={() => setShowDriverMenu(false)} />
          
          {/* Active Switcher Card Panel */}
          <div className="bg-white rounded-t-[32px] p-5 max-h-[75%] flex flex-col space-y-4 border-t border-gray-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#2B3B63] flex items-center gap-1.5 font-['Google_Sans_Flex']">
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
                      : "bg-[#F2F4F7] hover:bg-gray-200 border-transparent text-[#2B3B63]"
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

      {/* ── 6. ROUTE NOTE OVERLAY ───────────────────────── */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-end select-none">
          <button
            className="flex-1 bg-transparent border-none cursor-default"
            onClick={() => setSelectedNote(null)}
            aria-label="Close route note"
          />

          <div className="h-[50%] min-h-[50%] max-h-[50%] bg-white rounded-t-[28px] px-4 pt-4 pb-6 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF2] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-[#FF7048]/10 flex items-center justify-center">
                  <Info size={18} className="text-[#FF7048]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#2B3B63] m-0 font-['Google_Sans_Flex']">Route Note</h2>
                  <p className="text-[11px] text-[#8A909D] m-0">Information from Dispatcher</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="size-9 rounded-full bg-[#F2F4F7] text-[#71727A] border-none flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto py-4 no-scrollbar overscroll-contain">
              <p className="text-[15px] text-[#2B3B63] font-['Google_Sans_Flex'] leading-relaxed m-0 whitespace-pre-wrap">
                {selectedNote}
              </p>
            </div>
            <button
              onClick={() => setSelectedNote(null)}
              className="w-full min-h-[50px] rounded-[14px] bg-white border border-[#D9DDE4] text-[#2B3B63] text-[15px] font-bold cursor-pointer active:scale-[0.98] transition-transform shrink-0"
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
