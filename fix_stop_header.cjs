const fs = require('fs');

let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// 1. Rewrite AddressContainer to include the badge
const oldAddress = `function AddressContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Address Container">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[30px] w-full">
        <p className="leading-[normal]">{stop.address}</p>
      </div>
      <StopStatusContainer stop={stop} />
    </div>
  );
}`;

const newAddress = `function AddressContainer({ stop }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Address Container">
      <div className={"px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium shrink-0 font-['Google_Sans_Flex'] border w-fit " + (stop.status === 'Done' ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" : stop.status === 'Servicing' ? "bg-[rgba(59,130,246,0.2)] text-[#3b82f6] border-[#3b82f6]" : "bg-[#FFF5E5] text-[#F59E0B] border-[#FDE68A]")}>
        {stop.status === 'Done' ? 'Completed' : stop.status === 'Servicing' ? 'Arrived' : 'Pending'}
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex'] font-semibold justify-center leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[30px] w-full">
        <p className="leading-[normal]">{stop.address}</p>
      </div>
      <StopStatusContainer stop={stop} />
    </div>
  );
}`;

content = content.replace(oldAddress, newAddress);

// 2. Rewrite Header
// Since Header was modified multiple times, we'll replace the whole function block.
const headerRegex = /function Header\(\{ stop, currentRoute, navigate, isScrolled \}: any\) \{[\s\S]*?\}\s*(?=\nfunction MainContainer|\nfunction AddressInfo)/;

const newHeader = `function Header({ stop, currentRoute, navigate, isScrolled }: any) {
  return (
    <div className={\`h-[110px] px-4 pt-[60px] pb-4 flex justify-between items-center w-full shrink-0 z-50 font-['Google_Sans_Flex'] sticky top-0 transition-all duration-150 \${isScrolled ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5' : 'bg-transparent border-transparent'}\`}>
      <button 
        onClick={() => navigate(-1)}
        className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 active:scale-90 transition-transform shrink-0 cursor-pointer text-[#2F3036]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <span className="text-[18px] font-semibold text-[#2F3036] truncate font-['Google_Sans_Flex'] px-2 absolute left-1/2 -translate-x-1/2">
        Stop {stop.num}/{currentRoute?.stops?.length}
      </span>

      <button 
        onClick={() => window.location.href = \`tel:\${stop.customerPhone}\`}
        className="bg-[#e8e9f1] flex items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none text-[#2f3036] active:scale-90 transition-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </button>
    </div>
  );
}
`;

content = content.replace(headerRegex, newHeader);

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('StopDetail updated');
