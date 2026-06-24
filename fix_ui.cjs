const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// Replace Header component
content = content.replace(/function Header\(\{ stop, currentRoute, navigate \}: any\) \{[\s\S]*?<\/div>\s*\n\s*\);\s*\n\}/, `function Header({ stop, currentRoute, navigate }: any) {
  return (
    <div className="h-[127px] px-4 pt-[64px] flex justify-between items-center w-full shrink-0 z-20 font-['Google_Sans_Flex'] relative">
      <button 
        onClick={() => navigate(-1)}
        className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 active:scale-90 transition-transform shrink-0 cursor-pointer text-[#2F3036]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <span className="text-[18px] font-bold text-[#2F3036] truncate px-2 absolute left-1/2 -translate-x-1/2">
        Stop {stop.num}/{currentRoute?.stops?.length}
      </span>

      <div 
        className={
          "border px-[10px] py-[4px] rounded-[6px] font-semibold shrink-0 tracking-wide text-[12px] font-['Google_Sans_Flex'] " +
          (stop.status === 'Done' 
            ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" 
            : stop.status === 'Servicing' 
              ? "bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]"
              : "bg-[#FFF5E5] text-[#F59E0B] border-[#FDE68A]")
        }
      >
        {stop.status === 'Done' ? 'Completed' : stop.status === 'Servicing' ? 'Arrived' : 'Pending'}
      </div>
    </div>
  );
}`);

// Add font family to the root container of StopDetail
content = content.replace(/className="bg-\[#f8f9fe\] relative flex flex-col min-h-full font-sans overflow-x-hidden overflow-y-auto no-scrollbar"/, 'className="bg-[#f8f9fe] relative flex flex-col min-h-full font-sans font-[\\'Google_Sans_Flex\\'] overflow-x-hidden overflow-y-auto no-scrollbar"');

// Fix Buttons
// ButtonFilled (Navigate)
content = content.replace(/function ButtonFilled\(\{ stop \}: any\) \{[\s\S]*?<\/a>\s*\n\s*\);\s*\n\}/, `function ButtonFilled({ stop }: any) {
  return (
    <a href={\`https://www.google.com/maps/dir/?api=1&destination=\${encodeURIComponent(stop.address)}\`} target="_blank" 
       className="flex-1 bg-[#ff7048] text-white font-semibold py-[14px] px-[24px] rounded-[16px] transition-all active:scale-95 text-[16px] flex items-center justify-center gap-[6px] shadow-[0_4px_15px_rgba(255,112,72,0.3)] font-['Google_Sans_Flex'] decoration-none truncate">
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
       <span>Navigate</span>
    </a>
  );
}`);

// ButtonFilled1 (Mark Stop Done)
content = content.replace(/function ButtonFilled1\(\) \{[\s\S]*?<\/div>\s*\n\s*\);\s*\n\}/, `function ButtonFilled1() {
  return (
    <div onClick={() => window.submitStopDone?.()} 
         className="flex-1 bg-[#ff7048] text-white font-semibold py-[14px] px-[24px] rounded-[16px] transition-all active:scale-95 text-[16px] flex items-center justify-center gap-[6px] shadow-[0_4px_15px_rgba(255,112,72,0.3)] font-['Google_Sans_Flex'] cursor-pointer">
       <span>Mark Stop Done</span>
    </div>
  );
}`);

// ButtonFilled2 (Call)
content = content.replace(/function ButtonFilled2\(\{ stop \}: any\) \{[\s\S]*?<\/a>\s*\n\s*\);\s*\n\}/, `function ButtonFilled2({ stop }: any) {
  return (
    <a href={\`tel:\${stop.customerPhone}\`} 
       className="bg-[#ff7048] hover:bg-[#FF8563] text-white px-6 py-3 rounded-full font-bold text-[14px] flex items-center gap-2 shrink-0 active:scale-95 transition-all shadow-md shadow-[#FF704833] decoration-none font-['Google_Sans_Flex']">
       Call <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </a>
  );
}`);

// ButtonFilled3 (Call Customer Floating)
content = content.replace(/function ButtonFilled3\(\{ stop \}: any\) \{[\s\S]*?<\/a>\s*\n\s*\);\s*\n\}/, `function ButtonFilled3({ stop }: any) {
  return null; // The Call customer float isn't needed anymore as we have a Call button in the card itself
}`);

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('UI Fixed');
