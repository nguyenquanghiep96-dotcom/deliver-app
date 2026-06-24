const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// Fix Arrived badge in Header
content = content.replace(/className="bg-\[rgba\(59,130,246,0\.2\)\] text-\[#3b82f6\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[10px\] font-medium shrink-0 font-\['Google_Sans_Flex'\] border border-\[#3b82f6\]"/g, 'className={"px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium shrink-0 font-[\'Google_Sans_Flex\'] border " + (stop.status === \'Done\' ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" : stop.status === \'Servicing\' ? "bg-[rgba(59,130,246,0.2)] text-[#3b82f6] border-[#3b82f6]" : "bg-[#FFF5E5] text-[#F59E0B] border-[#FDE68A]")}');

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Badge fixed.');
