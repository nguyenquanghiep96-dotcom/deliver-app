const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// 1. Remove background and ModernGradient
content = content.replace(/<div className="bg-\[#f8f9fe\] pb-\[120px\] relative flex flex-col min-h-full font-\['Google_Sans_Flex'\] overflow-x-hidden overflow-y-auto no-scrollbar" data-name="Stop Details">/g, '<div className="pb-[120px] relative flex flex-col min-h-full font-[\'Google_Sans_Flex\'] overflow-x-hidden overflow-y-auto no-scrollbar" data-name="Stop Details">');
content = content.replace(/<div className="absolute inset-0 overflow-hidden pointer-events-none z-0"><div className="w-\[1507px\] h-\[393px\] absolute -top-20 left-1\/2 -translate-x-1\/2"><ModernGradient \/><\/div><\/div>/g, '');

// 2. Change font-weight to 500 (font-medium) for Orange buttons
// ButtonFilled
content = content.replace(/className="flex-1 bg-\[#ff7048\] text-white font-semibold/g, 'className="flex-1 bg-[#ff7048] text-white font-medium');
// ButtonFilled1
content = content.replace(/className="flex-1 bg-\[#ff7048\] text-white font-semibold/g, 'className="flex-1 bg-[#ff7048] text-white font-medium');
// ButtonFilled2
content = content.replace(/className="bg-\[#ff7048\] hover:bg-\[#FF8563\] text-white px-5 py-2\.5 rounded-\[16px\] font-bold/g, 'className="bg-[#ff7048] hover:bg-[#FF8563] text-white px-5 py-2.5 rounded-[16px] font-medium');

// 3. Fix Building Images Container (remove pointer-events-none, add no-scrollbar)
content = content.replace(/className="content-stretch flex gap-\[10px\] items-start overflow-x-auto overflow-y-clip pointer-events-none relative shrink-0 w-\[377px\]"/g, 'className="content-stretch flex gap-[10px] items-start overflow-x-auto overflow-y-clip relative shrink-0 w-[calc(100vw-32px)] no-scrollbar"');

// 4. Change style to "Monitor Barn"
content = content.replace(/<p className="leading-\[normal\]">\{cleanStopType\(stop\.type\)\}<\/p>/g, '<p className="leading-[normal]">Monitor Barn</p>');

// 5. Fix alignments (remove double padding)
// BuildingDetailsHeader
content = content.replace(/className="content-stretch flex h-\[20px\] items-center justify-center px-\[16px\] relative shrink-0"/g, 'className="content-stretch flex h-[20px] items-center justify-start relative shrink-0 w-full"');
// BuildingInfoContainer
content = content.replace(/className="content-stretch flex flex-col gap-\[10px\] items-start pt-\[16px\] px-\[16px\] relative size-full"/g, 'className="content-stretch flex flex-col gap-[10px] items-start pt-[16px] relative size-full"');

// CustomerInfoHeader
content = content.replace(/className="content-stretch flex h-\[20px\] items-center justify-center px-\[16px\] relative shrink-0"/g, 'className="content-stretch flex h-[20px] items-center justify-start relative shrink-0 w-full"');
// CustomerInfoContainer
content = content.replace(/className="content-stretch flex flex-col gap-\[10px\] items-start pt-\[16px\] px-\[16px\] relative size-full"/g, 'className="content-stretch flex flex-col gap-[10px] items-start pt-[16px] relative size-full"');

// Add images from public folder to the cards if they exist
content = content.replace(/stop\?\.photos\?\.\[0\] \|\| ""/g, 'stop?.photos?.[0] || "/images/BuildingImage1.jpg"');
content = content.replace(/stop\?\.photos\?\.\[1\] \|\| ""/g, 'stop?.photos?.[1] || "/images/BuildingImage2.jpg"');
content = content.replace(/stop\?\.photos\?\.\[2\] \|\| ""/g, 'stop?.photos?.[2] || "/images/BuildingImage3.jpg"');
content = content.replace(/stop\?\.photos\?\.\[3\] \|\| ""/g, 'stop?.photos?.[3] || "/images/BuildingImage4.jpg"');

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Fixed alignments and styles');
