const fs = require('fs');

// 1. Fix StopDetail.tsx
let stopDetailContent = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// Remove internal overflow-y-auto to let parent scroll it naturally
stopDetailContent = stopDetailContent.replace(
  /className="pb-\[120px\] relative flex flex-col min-h-full font-\['Google_Sans_Flex'\] overflow-x-hidden overflow-y-auto no-scrollbar"/,
  'className="pb-[120px] relative flex flex-col min-h-full font-[\'Google_Sans_Flex\'] overflow-x-hidden no-scrollbar"'
);

// Speed up animation from duration-300 to duration-150
stopDetailContent = stopDetailContent.replace(/duration-300/g, 'duration-150');

fs.writeFileSync('src/StopDetail.tsx', stopDetailContent);

// 2. Fix Home.tsx (speed up animation)
let homeContent = fs.readFileSync('src/Home.tsx', 'utf8');
homeContent = homeContent.replace(/duration-300/g, 'duration-150');
fs.writeFileSync('src/Home.tsx', homeContent);

console.log('Scroll bugs fixed and animation sped up');
