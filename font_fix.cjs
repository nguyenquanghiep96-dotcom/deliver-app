const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// 1. Stop 2/5 font Emphasize (semibold)
content = content.replace(/className="text-\[18px\] font-bold text-\[#2F3036\] truncate/g, 'className="text-[18px] font-semibold text-[#2F3036] truncate font-[\'Google_Sans_Flex\']');

// 2. Arrived Tag: match Home page exactly
const homeTagStyle = 'bg-[rgba(59,130,246,0.2)] text-[#3b82f6] px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium shrink-0 font-[\'Google_Sans_Flex\'] border border-[#3b82f6]';
content = content.replace(/className=\{\n\s*"border px-\[10px\] py-\[4px\] rounded-\[6px\] font-semibold shrink-0 tracking-wide text-\[12px\] font-\['Google_Sans_Flex'\] " \+\n\s*\(stop\.status === 'Done'\s*\?\s*"bg-\[#DCFCE7\] text-\[#16A34A\] border-\[#BBF7D0\]"\s*:\s*stop\.status === 'Servicing'\s*\?\s*"bg-\[#EFF6FF\] text-\[#3B82F6\] border-\[#BFDBFE\]"\s*:\s*"bg-\[#FFF5E5\] text-\[#F59E0B\] border-\[#FDE68A\]"\)\n\s*\}/g, 'className="' + homeTagStyle + '"');

// 3. Address: Google Sans Flex 30px Semibold
content = content.replace(/className="\[word-break:break-word\] flex flex-col font-\['Proxima_Nova:Bold',sans-serif\] justify-center leading-\[0\] not-italic relative shrink-0 text-\[#2f3036\] text-\[20px\] w-full"/g, 'className="[word-break:break-word] flex flex-col font-[\'Google_Sans_Flex\'] font-semibold justify-center leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[30px] w-full"');

// 4. Stop Notes & Delivery Instruction Headers
content = content.replace(/font-\['Google_Sans_Flex:SemiBold',sans-serif\] font-semibold leading-\[normal\] not-italic relative shrink-0 text-\[#2f3036\] text-\[14px\] whitespace-nowrap/g, 'font-[\'Google_Sans_Flex\'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[14px] whitespace-nowrap');
content = content.replace(/font-\['Google_Sans_Flex:Regular',sans-serif\] font-normal leading-\[normal\] min-w-full not-italic relative shrink-0 text-\[#71727a\] text-\[14px\]/g, 'font-[\'Google_Sans_Flex\'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#71727a] text-[14px]');

// 5. Add Photo; Payment; Delivery Signature; Comment / Notes -> Font Body 16 Emphasized
content = content.replace(/font-\['Google_Sans_Flex:SemiBold',sans-serif\] font-semibold justify-center leading-\[0\] not-italic overflow-hidden relative shrink-0 text-\[#2f3036\] text-\[16px\]/g, 'font-[\'Google_Sans_Flex\'] font-semibold justify-center leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#2f3036] text-[16px]');

// 6. Building Details & Customer Info
content = content.replace(/font-\['Google_Sans_Flex:SemiBold',sans-serif\]/g, 'font-[\'Google_Sans_Flex\']');
content = content.replace(/font-\['Google_Sans_Flex:Regular',sans-serif\]/g, 'font-[\'Google_Sans_Flex\']');
content = content.replace(/font-\['Proxima_Nova:Medium',sans-serif\]/g, 'font-[\'Google_Sans_Flex\']');

// 7. Remove Button "Call"
content = content.replace(/<ButtonFilled2 stop=\{stop\} \/>/g, '');

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Fonts updated and Button removed.');
