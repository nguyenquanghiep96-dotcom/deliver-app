const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// 1. Fix ActionButtonsContainer width
content = content.replace(/className="content-stretch flex gap-\[10px\] items-start relative shrink-0 w-\[356px\]"/g, 'className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full"');

// 2. Fix CustomerInfo padding (BuildingInfoContainer1)
content = content.replace(/className="content-stretch flex flex-col items-start pt-\[16px\] px-\[16px\] relative size-full"/g, 'className="content-stretch flex flex-col items-start pt-[16px] relative size-full"');
content = content.replace(/className="content-stretch flex gap-\[4px\] items-center pb-\[10px\] relative shrink-0 w-\[361px\]"/g, 'className="content-stretch flex gap-[4px] items-center pb-[10px] relative shrink-0 w-full"');

// 3. Ensure BuildingImagesContainer can scroll
// Sometimes, parent pointer-events-none or touch-none causes issues. I'll make sure it's strictly correct:
content = content.replace(/className="content-stretch flex gap-\[10px\] items-start overflow-x-auto overflow-y-clip relative shrink-0 w-\[calc\(100vw-32px\)\] no-scrollbar"/g, 'className="content-stretch flex gap-[10px] items-start overflow-x-auto overflow-y-clip relative shrink-0 w-[calc(100vw-32px)] no-scrollbar touch-pan-x"');

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Final layout adjustments complete');
