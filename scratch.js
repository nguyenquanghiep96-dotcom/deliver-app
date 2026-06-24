const fs = require('fs');
let content = fs.readFileSync('src/StopDetailsExport/index.tsx', 'utf8');

// 1. Remove OS status bar and Home Indicator
content = content.replace(/<div className="absolute content-stretch flex flex-col items-start left-0 top-0" data-name="🧰 Status Bar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// 2. Fix Absolute Positioning on root containers
content = content.replace(/className="-translate-x-1\/2 absolute content-stretch flex gap-\[16px\] items-center left-1\/2 px-\[16px\] py-\[12px\] top-\[54px\] w-\[393px\]"/, 'className="flex gap-[16px] items-center px-4 pt-14 pb-4 w-full bg-transparent shrink-0 z-20"');
content = content.replace(/className="absolute content-stretch flex flex-col gap-\[10px\] items-start left-\[16px\] top-\[122px\] w-\[361px\]"/, 'className="flex flex-col gap-[10px] items-start w-full px-4"');
content = content.replace(/className="-translate-x-1\/2 absolute content-stretch flex flex-col gap-\[25px\] items-start left-1\/2 top-\[634px\] w-\[393px\]"/, 'className="flex flex-col gap-[25px] items-start w-full px-4 pb-32 pt-4"');

// 3. Fix background gradient
content = content.replace(/<div className="-translate-x-1\/2 absolute flex h-\[1507px\] items-center justify-center left-1\/2 top-0 w-\[393px\]">[\s\S]*?<\/div>\s*<\/div>/, '<div className="absolute inset-0 overflow-hidden pointer-events-none z-0"><div className="w-[1507px] h-[393px] absolute -top-20 left-1/2 -translate-x-1/2"><ModernGradient /></div></div>');

// 4. Inject Dynamic Data
content = content.replace(/James Carter/g, '{stop.customerName}');
content = content.replace(/714-345-4909/g, '{stop.customerPhone}');
content = content.replace(/123 William St, Manhattan, NY, 10038/g, '{stop.address}');
content = content.replace(/#2-24756/g, '{stop.id}');
content = content.replace(/14 x 20 x 7/g, '{stop.unitInfo.size}');
content = content.replace(/RE001/g, '{stop.unitInfo.serial}');
content = content.replace(/Tiny Home \(Porch\)/g, '{cleanStopType(stop.type)}');
content = content.replace(/Stop 3\/5/g, 'Stop {stop.num}/{currentRoute.stops.length}');
content = content.replace(/Arrived/g, "{stop.status === 'Done' ? 'Completed' : stop.status === 'Servicing' ? 'Arrived' : 'Pending'}");
content = content.replace(/Lot Transfer/g, "{cleanStopType(stop.type)}");

fs.writeFileSync('src/StopDetailsExport/processed.tsx', content);
console.log('Done');
