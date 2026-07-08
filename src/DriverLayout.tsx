import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { cn } from './lib/utils';
import svgPaths from './imports/ButtonContainer/svg-tdy7ks0he1';
import imgAppBackground from './assets/app_background.jpg';

import imgNavHome from '../icon/ic-home.svg';
import imgNavCalendar from '../icon/ic-calendar.svg';
import imgNavRoutes from '../icon/ic-routes.svg';
import imgNavProfile from '../icon/ic-user.svg';

export default function DriverLayout() {
  const location = useLocation();
  const [time, setTime] = useState('1:47');

  // Real-time clock for the status bar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determine active tab based on path and search params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'home';
  
  // Decide which tab is active
  const isHomeActive = location.pathname === '/home' && currentTab === 'home';
  const isCalendarActive = location.pathname === '/home' && currentTab === 'calendar';
  const isRoutesActive = (location.pathname === '/home' && currentTab === 'routes') || location.pathname.includes('/route/') || location.pathname.includes('/stop/');
  const isProfileActive = location.pathname === '/home' && currentTab === 'profile';

  // Always show bottom nav
  const showBottomNav = true;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 select-none">
      {/* iPhone Simulator Frame Container */}
      <div className="w-[393px] h-[852px] bg-white rounded-[50px] shadow-2xl overflow-hidden relative border-[8px] border-black flex flex-col">
        
        {/* iOS Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-[54px] z-[60] flex items-center justify-between px-7 pointer-events-none">
          {/* Time */}
          <span 
            className="text-[16px] font-semibold text-black tracking-[-0.3px] mt-1 ml-1" 
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
          >
            {time}
          </span>
          
          {/* Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[125px] h-[37px] bg-black rounded-[18.5px]"></div>
          
          {/* System Icons */}
          <div className="flex items-center gap-[5px] mt-1 text-black mr-1">
            {/* Cellular Signal */}
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2255_1301)">
                <path opacity="0.2" d="M18.7058 15.1394H20.4453C20.9001 15.1394 21.2032 14.8218 21.2032 14.3526V12.8508C21.2032 12.3817 20.9001 12.0713 20.4453 12.0713H18.7058C18.251 12.0713 17.9479 12.3817 17.9479 12.8508V14.3526C17.9479 14.8218 18.251 15.1394 18.7058 15.1394Z" fill="currentColor"/>
                <path d="M18.7088 15.1395H20.4628C20.9103 15.1395 21.2134 14.8218 21.2134 14.3527V3.39566C21.2134 2.92648 20.9103 2.60889 20.4628 2.60889H18.7088C18.2613 2.60889 17.9509 2.92648 17.9509 3.39566V14.3527C17.9509 14.8218 18.2613 15.1395 18.7088 15.1395Z" fill="currentColor"/>
                <path opacity="0.2" d="M13.3057 15.1394H15.0453C15.5 15.1394 15.8032 14.8218 15.8032 14.3526V12.8508C15.8032 12.3817 15.5 12.0713 15.0453 12.0713H13.3057C12.851 12.0713 12.5479 12.3817 12.5479 12.8508V14.3526C12.5479 14.8218 12.851 15.1394 13.3057 15.1394Z" fill="currentColor"/>
                <path d="M13.3098 15.1394H15.0493C15.4968 15.1394 15.8072 14.8218 15.8072 14.3526V6.24673C15.8072 5.77755 15.4968 5.45996 15.0493 5.45996H13.3098C12.855 5.45996 12.5519 5.77755 12.5519 6.24673V14.3526C12.5519 14.8218 12.855 15.1394 13.3098 15.1394Z" fill="currentColor"/>
                <path opacity="0.2" d="M7.90572 15.1394H9.64528C10.1 15.1394 10.4032 14.8218 10.4032 14.3526V12.8508C10.4032 12.3817 10.1 12.0713 9.64528 12.0713H7.90572C7.45099 12.0713 7.14783 12.3817 7.14783 12.8508V14.3526C7.14783 14.8218 7.45099 15.1394 7.90572 15.1394Z" fill="currentColor"/>
                <path d="M7.9034 15.1398H9.64296C10.0977 15.1398 10.4009 14.8221 10.4009 14.353V8.86002C10.4009 8.39084 10.0977 8.07324 9.64296 8.07324H7.9034C7.44866 8.07324 7.14551 8.39084 7.14551 8.86002V14.353C7.14551 14.8221 7.44866 15.1398 7.9034 15.1398Z" fill="currentColor"/>
                <path opacity="0.2" d="M2.49703 15.1394H4.23659C4.69133 15.1394 4.99448 14.8218 4.99448 14.3526V12.8508C4.99448 12.3817 4.69133 12.0713 4.23659 12.0713H2.49703C2.04229 12.0713 1.73914 12.3817 1.73914 12.8508V14.3526C1.73914 14.8218 2.04229 15.1394 2.49703 15.1394Z" fill="currentColor"/>
                <path d="M2.49703 15.1398H4.23659C4.69133 15.1398 4.99448 14.8221 4.99448 14.353V11.1121C4.99448 10.6429 4.69133 10.3325 4.23659 10.3325H2.49703C2.04229 10.3325 1.73914 10.6429 1.73914 11.1121V14.353C1.73914 14.8221 2.04229 15.1398 2.49703 15.1398Z" fill="currentColor"/>
              </g>
              <defs>
                <clipPath id="clip0_2255_1301">
                  <rect width="19.4743" height="12.5378" fill="white" transform="translate(1.73914 2.60889)"/>
                </clipPath>
              </defs>
            </svg>
            {/* WiFi */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2255_1313)">
                <path d="M10.0482 15.4818C10.207 15.4818 10.3442 15.4096 10.6257 15.1354L12.3869 13.4463C12.4951 13.338 12.524 13.1792 12.423 13.0493C11.9538 12.443 11.066 11.9161 10.0482 11.9161C9.00161 11.9161 8.11379 12.4647 7.64461 13.0926C7.57244 13.2081 7.60131 13.338 7.7168 13.4463L9.47079 15.1354C9.75229 15.4024 9.88944 15.4818 10.0482 15.4818ZM5.82567 11.5552C5.98446 11.7067 6.17935 11.6851 6.32371 11.5263C7.18988 10.5663 8.60462 9.86612 10.0482 9.87334C11.5063 9.86612 12.921 10.5879 13.8017 11.5479C13.9316 11.6995 14.112 11.6923 14.2708 11.5479L15.3896 10.4364C15.5051 10.3209 15.5196 10.1621 15.4112 10.0321C14.3213 8.69679 12.3003 7.69349 10.0482 7.69349C7.7962 7.69349 5.77514 8.69679 4.68521 10.0321C4.57694 10.1621 4.58415 10.3064 4.70686 10.4364L5.82567 11.5552ZM2.83016 8.538C2.97453 8.67514 3.17663 8.67514 3.31377 8.53079C5.08942 6.64686 7.42808 5.65078 10.0482 5.65078C12.6828 5.65078 15.0359 6.65408 16.7971 8.538C16.9271 8.66792 17.1219 8.66071 17.2663 8.52357L18.2624 7.52747C18.3924 7.39754 18.3851 7.23875 18.2841 7.11604C16.5878 5.0228 13.3974 3.48535 10.0482 3.48535C6.70627 3.48535 3.50144 5.0228 1.81242 7.11604C1.71136 7.23875 1.71136 7.39754 1.83407 7.52747L2.83016 8.538Z" fill="currentColor"/>
              </g>
              <defs>
                <clipPath id="clip0_2255_1313">
                  <rect width="16.6208" height="12.0037" fill="white" transform="translate(1.73914 3.47803)"/>
                </clipPath>
              </defs>
            </svg>
            {/* Battery */}
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2255_1318)">
                <path opacity="0.4" d="M7.41077 15.6128H21.9153C23.6082 15.6128 24.8173 15.4228 25.6802 14.5598C26.5461 13.6967 26.7239 12.5093 26.7239 10.8106V8.29481C26.7239 6.59615 26.5461 5.40292 25.6802 4.5428C24.8143 3.67978 23.6082 3.49268 21.9153 3.49268H7.35735C5.73014 3.49268 4.51823 3.68267 3.65522 4.54859C2.7893 5.41161 2.60864 6.60838 2.60864 8.23494V10.8106C2.60864 12.5093 2.7864 13.6996 3.64943 14.5598C4.51823 15.4228 5.72145 15.6128 7.41077 15.6128ZM7.16436 14.4564C6.06324 14.4564 5.07178 14.2821 4.49619 13.713C3.92994 13.1374 3.76507 12.1611 3.76507 11.057V8.09893C3.76507 6.95017 3.92994 5.96226 4.49329 5.38667C5.06889 4.80818 6.07548 4.64621 7.22134 4.64621H22.1682C23.2693 4.64621 24.2608 4.82331 24.8271 5.38956C25.4026 5.96515 25.5675 6.93503 25.5675 8.03905V11.057C25.5675 12.1611 25.3998 13.1374 24.8271 13.713C24.2608 14.2851 23.2693 14.4564 22.1682 14.4564H7.16436ZM27.8061 11.8269C28.4977 11.7831 29.4328 10.8918 29.4328 9.54949C29.4328 8.21074 28.4977 7.31941 27.8061 7.27561V11.8269Z" fill="currentColor"/>
                <path d="M6.83727 13.4971H22.5047C23.3426 13.4971 23.8408 13.366 24.1573 13.0494C24.4739 12.7299 24.6114 12.2289 24.6114 11.3903V7.71166C24.6114 6.86732 24.4739 6.37206 24.1602 6.0526C23.8408 5.73893 23.3368 5.60498 22.5047 5.60498H6.89715C6.00228 5.60498 5.4861 5.73603 5.18176 6.0497C4.86809 6.36916 4.73059 6.88535 4.73059 7.76509V11.3903C4.73059 12.2376 4.86809 12.7299 5.18176 13.0494C5.50123 13.3631 6.00517 13.4971 6.83727 13.4971Z" fill="currentColor"/>
              </g>
              <defs>
                <clipPath id="clip0_2255_1318">
                  <rect width="26.8242" height="12.1346" fill="white" transform="translate(2.60864 3.47803)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div 
          id="scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative bg-[#E8E9F1] no-scrollbar"
        >
          <Outlet />
        </div>

        {/* Bottom Tab Navigation — Figma: button */}
        {showBottomNav && (
          <div className="absolute bottom-0 left-0 w-full bg-white flex gap-[5px] items-center px-[6px] pt-[6px] pb-[40px] z-40 select-none" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.16)' }}>
            
            {/* Home */}
            <Link
              to="/home?tab=home"
              className={cn(
                "flex-1 min-w-0 flex flex-col gap-[8px] items-center justify-center py-[10px] transition-all duration-200 decoration-none cursor-pointer",
                isHomeActive 
                  ? "px-[8px] rounded-[15px] text-white" 
                  : "px-[6px] rounded-[30px] text-[#71727A] hover:bg-gray-50"
              )}
              style={isHomeActive ? {
                background: '#FF7048',
                outline: '1px solid #FAA087',
                outlineOffset: '-1px',
              } : undefined}
            >
              <img src={imgNavHome} className="w-[16px] h-[16px] shrink-0" style={{ filter: isHomeActive ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(48%) sepia(8%) saturate(301%) hue-rotate(201deg) brightness(95%) contrast(87%)' }} alt="Home" />
              <span className="self-stretch text-center font-medium text-[11px] font-['Google_Sans_Flex']">Home</span>
            </Link>

            {/* Calendar */}
            <Link
              to="/home?tab=calendar"
              className={cn(
                "flex-1 min-w-0 flex flex-col gap-[8px] items-center justify-center py-[10px] transition-all duration-200 decoration-none cursor-pointer",
                isCalendarActive 
                  ? "px-[8px] rounded-[15px] text-white" 
                  : "px-[6px] rounded-[30px] text-[#71727A] hover:bg-gray-50"
              )}
              style={isCalendarActive ? {
                background: '#FF7048',
                outline: '1px solid #FAA087',
                outlineOffset: '-1px',
              } : undefined}
            >
              <img src={imgNavCalendar} className="w-[16px] h-[16px] shrink-0" style={{ filter: isCalendarActive ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(48%) sepia(8%) saturate(301%) hue-rotate(201deg) brightness(95%) contrast(87%)' }} alt="Calendar" />
              <span className="self-stretch text-center font-medium text-[11px] font-['Google_Sans_Flex']">Calendar</span>
            </Link>

            {/* Routes */}
            <Link
              to="/home?tab=routes"
              className={cn(
                "flex-1 min-w-0 flex flex-col gap-[8px] items-center justify-center py-[10px] transition-all duration-200 decoration-none cursor-pointer",
                isRoutesActive 
                  ? "px-[8px] rounded-[15px] text-white" 
                  : "px-[6px] rounded-[30px] text-[#71727A] hover:bg-gray-50"
              )}
              style={isRoutesActive ? {
                background: '#FF7048',
                outline: '1px solid #FAA087',
                outlineOffset: '-1px',
              } : undefined}
            >
              <img src={imgNavRoutes} className="w-[16px] h-[16px] shrink-0" style={{ filter: isRoutesActive ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(48%) sepia(8%) saturate(301%) hue-rotate(201deg) brightness(95%) contrast(87%)' }} alt="Routes" />
              <span className="self-stretch text-center font-medium text-[11px] font-['Google_Sans_Flex']">Routes</span>
            </Link>

            {/* Profile */}
            <Link
              to="/home?tab=profile"
              className={cn(
                "flex-1 min-w-0 flex flex-col gap-[8px] items-center justify-center py-[10px] transition-all duration-200 decoration-none cursor-pointer",
                isProfileActive 
                  ? "px-[8px] rounded-[15px] text-white" 
                  : "px-[6px] rounded-[30px] text-[#71727A] hover:bg-gray-50"
              )}
              style={isProfileActive ? {
                background: '#FF7048',
                outline: '1px solid #FAA087',
                outlineOffset: '-1px',
              } : undefined}
            >
              {/* Profile tab — inline SVG icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M10.6953 9.33301H5.30467C4.42854 9.33396 3.5886 9.64762 2.96908 10.2052C2.34957 10.7627 2.00106 11.5187 2 12.3072V15.333H14V12.3072C13.9989 11.5187 13.6504 10.7627 13.0309 10.2052C12.4114 9.64762 11.5715 9.33396 10.6953 9.33301Z" fill={isProfileActive ? 'white' : '#71727A'}/>
                <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill={isProfileActive ? 'white' : '#71727A'}/>
              </svg>
              <span className="self-stretch text-center font-medium text-[11px] font-['Google_Sans_Flex']">Profile</span>
            </Link>
          </div>
        )}

        {/* Virtual iOS Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[144px] h-[5px] bg-black rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
}
