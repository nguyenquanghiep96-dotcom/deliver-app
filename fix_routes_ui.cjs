const fs = require('fs');

let content = fs.readFileSync('src/Home.tsx', 'utf8');

// 1. Replace Notification Button in Routes tab
const oldBellButton = `<button 
              onClick={() => setShowNotifications(true)}
              className="relative w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform border border-black/5 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
            >
              <Bell size={20} className="text-[#1F2024]" />
              <div className="absolute top-0 right-[2px] w-[14px] h-[14px] bg-[#F52525] rounded-full border-2 border-white" />
            </button>`;

const newBellButton = `<button 
              onClick={() => setShowNotifications(true)}
              className="bg-[#e8e9f1] flex gap-[10px] items-center justify-center p-[8px] relative rounded-[50px] shrink-0 size-[44px] cursor-pointer border-none"
            >
              <img src={imgNotificationIcon} alt="Notifications" className="w-[20px] h-[20px]" />
              <div className="absolute bg-[#f52525] rounded-[30px] size-[14px] top-0 right-0 border-2 border-[#e8e9f1]" />
            </button>`;

content = content.replace(oldBellButton, newBellButton);

// 2. Remove bottom border in Tabs container
content = content.replace(
  /<div className="flex px-4 gap-6 border-b border-\[#E8E9F1\] select-none">/,
  '<div className="flex px-4 gap-6 select-none">'
);

// 3. Update Font Weight to 600
content = content.replace(
  /"py-3 text-\[18px\] font-semibold transition-all relative font-\['Google_Sans_Flex'\] cursor-pointer border-none bg-transparent"/g,
  '"py-3 text-[18px] font-[600] transition-all relative font-[\'Google_Sans_Flex\'] cursor-pointer border-none bg-transparent"'
);

// 4. Update the Active indicator line (h-4px, no rounded)
content = content.replace(
  /<div className="absolute bottom-0 left-0 w-full h-\[3px\] bg-\[#FF7048\] rounded-t-full" \/>/g,
  '<div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#FF7048]" />'
);

fs.writeFileSync('src/Home.tsx', content);
console.log('UI Fixes applied');
