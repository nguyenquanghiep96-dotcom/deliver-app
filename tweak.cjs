const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// 1. Reduce padding for Navigate and Mark Stop Done
content = content.replace(/className="flex-1 bg-\[#ff7048\] text-white font-medium py-\[14px\] px-\[24px\] rounded-\[16px\] transition-all active:scale-95 text-\[16px\] flex items-center justify-center gap-\[6px\] shadow-\[0_4px_15px_rgba\(255,112,72,0\.3\)\] font-\['Google_Sans_Flex'\] decoration-none truncate"/g, 'className="flex-1 bg-[#ff7048] text-white font-medium py-[14px] px-[8px] rounded-[16px] transition-all active:scale-95 text-[15px] flex items-center justify-center gap-[6px] shadow-[0_4px_15px_rgba(255,112,72,0.3)] font-[\'Google_Sans_Flex\'] decoration-none truncate"');

content = content.replace(/className="flex-1 bg-\[#ff7048\] text-white font-medium py-\[14px\] px-\[24px\] rounded-\[16px\] transition-all active:scale-95 text-\[16px\] flex items-center justify-center gap-\[6px\] shadow-\[0_4px_15px_rgba\(255,112,72,0\.3\)\] font-\['Google_Sans_Flex'\] cursor-pointer"/g, 'className="flex-1 bg-[#ff7048] text-white font-medium py-[14px] px-[8px] rounded-[16px] transition-all active:scale-95 text-[15px] flex items-center justify-center gap-[6px] shadow-[0_4px_15px_rgba(255,112,72,0.3)] font-[\'Google_Sans_Flex\'] cursor-pointer"');


// 2. Make BuildingImagesContainer bleed to the right edge
content = content.replace(/className="flex gap-\[10px\] items-start overflow-x-auto relative shrink-0 w-full no-scrollbar snap-x"/g, 'className="flex gap-[10px] items-start overflow-x-auto relative shrink-0 w-[calc(100%+16px)] -mr-4 pr-4 no-scrollbar snap-x"');

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Tweaks applied');
