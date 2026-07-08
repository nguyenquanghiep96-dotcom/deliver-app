import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import { useDriver } from './DriverContext';
import { StopCard } from './components/StopCard';
import { Bell, ChevronRight, User, Info, Clock, LogOut, CheckCircle2, AlertCircle, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { cn, cleanStopType, getStopHeader } from './lib/utils';
import { TagBadge, StatusBadge } from './components/Badges';

import imgUserImage from './assets/3271fc3a53481ca6ba5eb96b8724359f747c54a3.png';
import imgCompanyLogo from '../icon/Logo/Powered by ShedPro.svg';
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

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'home';

  // State inside Routes Tab: "Schedule" | "Completed"
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
    <div className="relative min-h-full bg-[#E8E9F1] font-sans">

      {/* ── 1. HOME TAB VIEW ────────────────────────────────────────────────── */}
      {currentTab === 'home' && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#f8f9fe]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
            <h1 className="text-[34px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">My Routes</h1>
            
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-white flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
              style={{ boxShadow: '0px 0px 10px rgba(0,0,0,0.08)' }}
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 left-[30px]" />
            </button>
          </header>

          <main className="px-4 pb-28 flex flex-col gap-[24px]">
            <div>
              
              {activeRoute ? (
                (() => {
                  const stops = activeRoute.stops;
                  const totalStops = stops.length;
                  const completedStopsCount = stops.filter(s => s.status === 'Done').length;
                  const progressPercentage = totalStops > 0 ? (completedStopsCount / totalStops) * 100 : 0;
                  const estCompletion = activeRoute.id === 'R-001' ? '24 June' : activeRoute.id === 'R-002' ? '24 June' : 'TBD';
                  const remainingDistanceStr = getRemainingDistance(activeRoute.id, stops);

                  return (
                    /* Active Route Card — Figma: current-stop-container */
                    <div 
                      className="w-full bg-white rounded-[24px] overflow-hidden"
                      style={{
                        boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)',
                        outline: '2px solid white',
                        outlineOffset: '-2px',
                      }}
                    >
                      {/* Dark inner card — Figma: current-stop-details */}
                      <div 
                        className="bg-[#2f3036] rounded-[24px] overflow-hidden flex flex-col items-start p-[16px] gap-[10px]"
                        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)' }}
                      >
                        {/* Route Name + Status — Figma: current-stop-info-container */}
                        <div className="self-stretch flex items-center gap-[6px]">
                          <div className="flex-1 flex flex-col items-start justify-center min-w-0">
                            <div className="font-semibold text-[22px] text-white font-['Google_Sans_Flex'] flex items-center truncate">{activeRoute.id} - {activeRoute.name}</div>
                          </div>
                          <div className="bg-[#2fa301] rounded-[6px] overflow-hidden flex items-center justify-center px-[6px] py-[2px] shrink-0">
                            <span className="text-[12px] font-medium text-white font-['Google_Sans_Flex'] whitespace-nowrap">En Route</span>
                          </div>
                        </div>

                        {/* Progress Bar — Figma: progress-container */}
                        <div className="self-stretch flex items-center gap-[10px]">
                          <div className="flex-1 flex flex-col items-end">
                            <div className="self-stretch h-[6px] relative">
                              <div className="absolute top-0 left-0 rounded-[10px] bg-white w-full h-[6px]" />
                              <div className="absolute top-0 left-0 rounded-[10px] bg-[#ff7048] h-[6px] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                            </div>
                          </div>
                          <span className="text-[12px] font-medium text-white text-center font-['Google_Sans_Flex']">{completedStopsCount}/{totalStops}</span>
                        </div>

                        {/* Stats — Figma: stats-container */}
                        <div className="self-stretch flex items-start text-center text-[12px] text-[#c5c6cc]">
                          <div className="flex-1 border-r border-[#71727a] flex flex-col items-start">
                            <div className="self-stretch font-['Google_Sans_Flex']">Stops done</div>
                            <div className="self-stretch text-[18px] font-semibold text-white font-['Google_Sans_Flex']">{completedStopsCount}/{totalStops}</div>
                          </div>
                          <div className="flex-1 border-r border-[#71727a] flex flex-col items-start">
                            <div className="self-stretch font-['Google_Sans_Flex']">Remaining</div>
                            <div className="self-stretch text-[18px] font-semibold text-white font-['Google_Sans_Flex']">{remainingDistanceStr}</div>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="self-stretch font-['Google_Sans_Flex']">Est. done</div>
                            <div className="self-stretch text-[18px] font-semibold text-white font-['Google_Sans_Flex']">{estCompletion}</div>
                          </div>
                        </div>

                        {/* CTA — Figma: buttonfilled */}
                        <div className="self-stretch flex flex-col items-start text-[16px] gap-[8px]">
                          <Link 
                            to={`/route/${activeRoute.id}`} 
                            className="self-stretch rounded-[16px] overflow-hidden flex items-center justify-center py-[15.5px] px-[30px] gap-[6px] cursor-pointer decoration-none text-white font-['Google_Sans_Flex'] active:scale-[0.98] transition-transform"
                            style={{
                              background: '#ff7048',
                              outline: '1px solid #faa087',
                              outlineOffset: '-1px',
                            }}
                          >
                            <span className="font-semibold">Continue Route</span>
                            <svg width="16" height="16" viewBox="0 0 10.3833 10.1087" fill="none"><path d="M5.3833 0.108643L4.4758 1.01614L8.5008 5.04114H0.383301V6.29114H8.5008L4.4758 10.3161L5.3833 11.2236L10.9389 5.66802L5.3833 0.108643Z" fill="white"/></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Empty Route State */
                <div className="bg-white rounded-[28px] p-6 text-center border border-black/5 shadow-sm select-none">
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

            {/* Upcoming Routes — Figma: next-stops-container */}
            {upcomingRoutes.length > 0 && (
              <section className="self-stretch flex flex-col items-start gap-[10px] text-left text-[16px] text-[#2f3036]">
                <div className="self-stretch flex items-start">
                  <h2 className="flex-1 font-semibold text-[16px] font-['Google_Sans_Flex']">Upcoming Routes</h2>
                </div>
                
                <div className="self-stretch flex flex-col items-start gap-[16px]">
                  <div className="self-stretch flex flex-col items-start gap-[10px]">
                    {upcomingRoutes.slice(0, 2).map((route, index) => {
                      const borderColors = ['#3B82F6', '#F8A2C3', '#2FA301', '#FF7048'];
                      const topBorderColor = borderColors[index % borderColors.length];

                      let startStr = route.startDate;
                      let endStr = route.endDate;
                      
                      // Fallback mappings
                      if (!startStr) {
                        if (route.id === 'R-001') { startStr = 'Jun 23'; endStr = 'Jun 24'; }
                        else if (route.id === 'R-002') { startStr = 'Jun 23'; endStr = 'Jun 23'; }
                        else if (route.id === 'R-003') { startStr = 'Jun 22'; endStr = 'Jun 22'; }
                        else if (route.id === 'R-004') { startStr = 'Jun 25'; endStr = 'Jun 25'; }
                        else if (route.id === 'R-005') { startStr = 'Jun 23'; endStr = 'Jun 23'; }
                        else if (route.date === 'Today') { startStr = 'Jun 23'; endStr = 'Jun 23'; }
                        else if (route.date === 'Tomorrow') { startStr = 'Jun 24'; endStr = 'Jun 24'; }
                        else { startStr = route.date; endStr = route.date; }
                      }
                      if (!endStr) endStr = startStr;

                      let dayStr = '';
                      let monthStr = route.monthName || 'Jun';
                      let timeRangeStr = '';

                      if (startStr && endStr) {
                        const startParts = startStr.split(' ');
                        const endParts = endStr.split(' ');
                        if (startParts.length === 2) {
                          monthStr = startParts[0];
                          if (startStr !== endStr && endParts.length === 2) {
                            dayStr = `${startParts[1]}-${endParts[1]}`;
                            timeRangeStr = `${startStr}, ${route.startTime || '09:00 AM'} - ${endStr}, ${route.endTime || '07:00 PM'}`;
                          } else {
                            dayStr = startParts[1];
                            timeRangeStr = `${route.startTime || '09:00 AM'} - ${route.endTime || '07:00 PM'}`;
                          }
                        } else {
                          dayStr = route.dayOfMonth || '29';
                          timeRangeStr = `${route.startTime || '09:00 AM'} - ${route.endTime || '07:00 PM'}`;
                        }
                      } else {
                        dayStr = route.dayOfMonth || '29';
                        timeRangeStr = `${route.startTime || '09:00 AM'} - ${route.endTime || '07:00 PM'}`;
                      }

                      return (
                      <Link 
                        key={route.id} 
                        to={`/route/${route.id}`} 
                        className="self-stretch bg-white rounded-[24px] flex items-start p-[12px] gap-[16px] decoration-none active:scale-[0.98] transition-transform"
                        style={{
                          boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)',
                          outline: '2px solid white',
                          outlineOffset: '-2px',
                        }}
                      >
                        {/* Left Date Tag */}
                        <div 
                          className="w-[54px] self-stretch px-[2px] py-[12px] bg-[#E8E9F1] overflow-hidden rounded-[11px] flex flex-col items-center justify-center gap-[8px]"
                          style={{ borderTop: `3px ${topBorderColor} solid` }}
                        >
                          <div className="flex flex-col items-center justify-start gap-[4px] self-stretch">
                            <div className="flex flex-col items-center justify-start">
                              <span className="text-[#2F3036] text-[16px] font-semibold font-['Google_Sans_Flex'] break-words text-center leading-tight">
                                {dayStr}
                              </span>
                              <span className="text-[#71727A] text-[12px] font-normal font-['Google_Sans_Flex'] break-words text-center leading-tight">
                                {monthStr}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Route Info */}
                        <div className="flex-1 flex flex-col items-start gap-[10px]">
                          <div className="self-stretch flex flex-col items-start gap-[4px]">
                            <div className="self-stretch flex flex-col items-start gap-[2px]">
                              {/* Route Name */}
                              <div className="self-stretch flex items-center justify-end gap-[6px] min-w-0">
                                <span className="flex-1 text-[#2F3036] text-[16px] font-semibold font-['Google_Sans_Flex'] truncate">
                                  {route.id} - {route.name}
                                </span>
                              </div>
                              {/* Address */}
                              <div className="self-stretch flex items-center justify-start gap-[5px] min-w-0">
                                <span className="flex-1 text-[#71727A] text-[14px] font-normal font-['Google_Sans_Flex'] truncate">
                                  {route.stops[0]?.address || 'No stops assigned'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Meta info lines */}
                            <div className="self-stretch flex flex-col items-start justify-start">
                              <div className="self-stretch h-[18px] text-[#71727A] text-[12px] font-normal font-['Google_Sans_Flex'] break-words flex flex-col justify-center">
                                {timeRangeStr}
                              </div>
                              <div className="self-stretch h-[18px] text-[#71727A] text-[12px] font-normal font-['Google_Sans_Flex'] break-words flex flex-col justify-center">
                                {route.stops.length} stops • {route.dealerName || 'Store A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )})}
                  </div>
                </div>
              </section>
            )}

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
          <header className={`flex items-center justify-between px-4 pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#f8f9fe]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
            <div className="flex-1 flex flex-col justify-center text-[34px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">Routes</div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-white flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
              style={{ boxShadow: '0px 0px 10px rgba(0,0,0,0.08)' }}
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 left-[30px]" />
            </button>
          </header>

          {/* Segment Tabs Control */}
          <div className="flex mx-4 select-none" style={{ borderBottom: '1px solid #D4D6DD' }}>
            {(['Assigned', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRoutesTab(tab)}
                className="flex-1 py-[10px] bg-transparent border-none cursor-pointer flex justify-center items-center"
                style={{ borderBottom: activeRoutesTab === tab ? '4px solid #FF7048' : '4px solid transparent', marginBottom: '-1px' }}
              >
                <span style={{ color: activeRoutesTab === tab ? '#FF7048' : '#2F3036', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{tab}</span>
              </button>
            ))}
          </div>

          <main className="px-4 py-6 space-y-6 pb-28">
            
            {/* Assigned View */}
            {activeRoutesTab === 'Assigned' && (
              <>
                {/* Upcoming Schedule */}
                <section className="space-y-[10px]">
                  
                  <div className="space-y-[10px] pt-2">
                    {upcomingRoutes.map(route => {
                      let topBorderColor = '#3B82F6';
                      if (route.status === 'En Route') topBorderColor = '#2FA301';
                      else if (route.status === 'Completed') topBorderColor = '#2FA301';
                      const startDate = route.startDate || 'Jun 26';
                      const endDate = route.endDate || startDate;
                      const startParts = startDate.split(' ');
                      const endParts = endDate.split(' ');
                      const dayDisplay = startDate !== endDate && startParts.length === 2 && endParts.length === 2
                        ? `${startParts[1]}-${endParts[1]}` : (startParts[1] || startDate);
                      const monthDisplay = startParts[0] || 'Jun';
                      return (
                        <Link 
                          key={route.id} 
                          to={`/route/${route.id}`} 
                          className="self-stretch bg-white rounded-[24px] flex items-start p-[12px] gap-[16px] decoration-none active:scale-[0.98] transition-transform"
                          style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.10)', outline: '2px solid white', outlineOffset: '-2px' }}
                        >
                          <div 
                            className="w-[54px] self-stretch px-[2px] py-[12px] bg-[#E8E9F1] overflow-hidden rounded-[11px] flex flex-col items-center justify-center gap-[8px]"
                            style={{ borderTop: `3px ${topBorderColor} solid` }}
                          >
                            <div className="flex flex-col items-center justify-start gap-[4px] self-stretch">
                              <div className="flex flex-col items-center justify-start">
                                <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{dayDisplay}</span>
                                <span style={{ color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', marginTop: 2 }}>{monthDisplay}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col items-start gap-[10px]">
                            <div className="self-stretch flex flex-col items-start gap-[4px]">
                              <div className="self-stretch flex flex-col items-start gap-[2px]">
                                <div className="self-stretch flex items-center gap-[6px]">
                                  <span style={{ flex: 1, color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{route.id} - {route.name}</span>
                                </div>
                                <div className="self-stretch flex items-center justify-start gap-[5px]">
                                  <span style={{ flex: 1, color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex' }} className="truncate">{route.stops[0]?.address || 'No stops assigned'}</span>
                                </div>
                              </div>
                              <div className="self-stretch flex flex-col items-start">
                                <div style={{ alignSelf: 'stretch', height: 18, color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  {startDate !== endDate ? `${startDate}, ${route.startTime || '09:00 AM'} - ${endDate}, ${route.endTime || '07:00 PM'}` : `${route.startTime || '09:00 AM'} - ${route.endTime || '07:00 PM'}`}
                                </div>
                                <div style={{ alignSelf: 'stretch', height: 18, color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  {route.stops.length} stops • {route.dealerName || 'Store A'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {/* Completed Routes View */}
            {activeRoutesTab === 'Completed' && (
              <section className="space-y-[10px] pt-2">
                <div className="space-y-[10px]">
                  {[
                    {
                      id: 'R-004',
                      name: 'Dallas TX (North)',
                      startDate: 'Jun 25',
                      endDate: 'Jun 25',
                      stopsCount: 3,
                      firstStopAddress: '304 North St, Dallas TX',
                      startTime: '8:00 AM',
                      endTime: '3:30 PM',
                      borderColor: '#2FA301'
                    },
                    {
                      id: 'R-005',
                      name: 'Houston TX (Express)',
                      startDate: 'Jun 24',
                      endDate: 'Jun 24',
                      stopsCount: 2,
                      firstStopAddress: '121 South Ave, Houston TX',
                      startTime: '9:00 AM',
                      endTime: '1:15 PM',
                      borderColor: '#2FA301'
                    }
                  ].map(route => {
                    const startParts = route.startDate.split(' ');
                    return (
                      <Link 
                        key={route.id} 
                        to={`/route/${route.id}`} 
                        className="self-stretch bg-white rounded-[24px] flex items-start p-[12px] gap-[16px] decoration-none active:scale-[0.98] transition-transform"
                        style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.10)', outline: '2px solid white', outlineOffset: '-2px' }}
                      >
                        <div 
                          className="w-[54px] self-stretch px-[2px] py-[12px] bg-[#E8E9F1] overflow-hidden rounded-[11px] flex flex-col items-center justify-center gap-[8px]"
                          style={{ borderTop: `3px ${route.borderColor} solid` }}
                        >
                          <div className="flex flex-col items-center justify-start gap-[4px] self-stretch">
                            <div className="flex flex-col items-center justify-start">
                              <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{startParts[1]}</span>
                              <span style={{ color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', marginTop: 2 }}>{startParts[0]}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-start gap-[10px]">
                          <div className="self-stretch flex flex-col items-start gap-[4px]">
                            <div className="self-stretch flex flex-col items-start gap-[2px]">
                              <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{route.id} - {route.name}</span>
                              <span style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex' }} className="truncate self-stretch">{route.firstStopAddress}</span>
                            </div>
                            <div className="self-stretch flex flex-col items-start">
                              <div style={{ alignSelf: 'stretch', height: 18, color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {route.startTime} - {route.endTime}
                              </div>
                              <div style={{ alignSelf: 'stretch', height: 18, color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {route.stopsCount} stops
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

          </main>
        </div>
      )}

      {/* ── 3. CALENDAR TAB VIEW ────────────────────────────────────────────── */}
      {currentTab === 'calendar' && (() => {

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
            {/* Header */}
            <header className={`flex items-center justify-between px-4 pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#E8E9F1]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
              <div className="flex-1 flex flex-col justify-center text-[34px] font-semibold text-[#2F3036] font-['Google_Sans_Flex'] break-words">Calendar</div>
              <button 
                onClick={() => setShowNotifications(true)}
                className="bg-white flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none shadow-[0px_0px_10px_rgba(0,0,0,0.05)]"
              >
                <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
                <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 left-[30px]" />
              </button>
            </header>

            {/* Month / Week View Mode Toggle Selector — Month first */}
            <div className="flex mx-4 shrink-0 mt-2 mb-4" style={{ borderBottom: '1px solid #D4D6DD' }}>
              <button 
                onClick={() => setCalendarViewMode('month')}
                className="flex-1 py-[10px] bg-transparent border-none cursor-pointer flex justify-center items-center"
                style={{ borderBottom: calendarViewMode === 'month' ? '4px solid #FF7048' : '4px solid transparent', marginBottom: '-1px' }}
              >
                <span style={{ color: calendarViewMode === 'month' ? '#FF7048' : '#2F3036', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Month</span>
              </button>
              <button 
                onClick={() => setCalendarViewMode('week')}
                className="flex-1 py-[10px] bg-transparent border-none cursor-pointer flex justify-center items-center"
                style={{ borderBottom: calendarViewMode === 'week' ? '4px solid #FF7048' : '4px solid transparent', marginBottom: '-1px' }}
              >
                <span style={{ color: calendarViewMode === 'week' ? '#FF7048' : '#2F3036', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Week</span>
              </button>
            </div>

            {/* Month Header Dropdown */}
            <div className="flex items-center gap-[10px] px-4 select-none cursor-pointer shrink-0 mb-4">
              <div className="flex flex-col justify-center text-[#2F3036] text-[26px] font-semibold font-['Google_Sans_Flex'] break-words">{calendarMonthLabel}</div>
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
                          background: (isActive || isToday) ? '#2F3036' : 'white',
                          boxShadow: (isActive || isToday) ? 'none' : '0px 4px 15px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div className="w-[32px] h-[4px] bg-transparent rounded-[4px]" />
                        <div className="self-stretch flex flex-col items-center justify-start">
                          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Google Sans Flex', textAlign: 'center', textTransform: 'uppercase', color: (isActive || isToday) ? '#D4D6DD' : '#71727A' }}>
                            {day.dayName}
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex', textAlign: 'center', color: (isActive || isToday) ? 'white' : '#2F3036', marginTop: 2 }}>
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
                                    background: isActive ? '#2F3036' : 'white',
                                    color: isActive ? 'white' : '#2F3036',
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
                <span style={{ fontSize: 16, fontWeight: 600, color: '#2F3036', fontFamily: 'Google Sans Flex' }}>Schedule</span>
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
                        to={`/route/${route.id}`} 
                        className="self-stretch bg-white rounded-[24px] flex items-start p-[12px] gap-[16px] decoration-none active:scale-[0.98] transition-transform"
                        style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.10)', outline: '2px solid white', outlineOffset: '-2px' }}
                      >
                        <div 
                          className="w-[54px] self-stretch px-[2px] py-[12px] bg-[#E8E9F1] overflow-hidden rounded-[11px] flex flex-col items-center justify-center gap-[8px]"
                          style={{ borderTop: `3px ${route.stripeColor} solid` }}
                        >
                          <div className="flex flex-col items-center justify-start">
                            <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{dayStr}</span>
                            <span style={{ color: '#71727A', fontSize: 12, fontWeight: 400, fontFamily: 'Google Sans Flex', marginTop: 2 }}>{monthStr}</span>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-start gap-[4px]">
                          <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>{route.id} - {route.name}</span>
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
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#2F3036', fontFamily: 'Google Sans Flex' }}>No Routes Scheduled</p>
                  <p style={{ fontSize: 12, color: '#71727A', fontFamily: 'Google Sans Flex', maxWidth: 200 }}>There are no routes scheduled for this date.</p>
                </div>
              )}
            </main>
          </div>
        );
      })()}





      {/* ── 3. PROFILE TAB VIEW ──────────────────────────────────────────────── */}
      {currentTab === 'profile' && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`flex items-center justify-between px-4 pt-[66px] pb-3 select-none shrink-0 sticky top-0 z-50 transition-all duration-150 ${isScrolled ? 'bg-[#f8f9fe]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
            <div className="flex-1 flex flex-col justify-center text-[34px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">Profile</div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="bg-[#e8e9f1] flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 left-[30px]" />
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
