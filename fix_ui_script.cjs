const fs = require('fs');

// 1. Update lib/utils.ts to add getStopHeader
let utilsContent = fs.readFileSync('src/lib/utils.ts', 'utf-8');
if (!utilsContent.includes('export const getStopHeader')) {
  utilsContent += `\nexport const getStopHeader = (stop: any) => {\n  const typeStr = cleanStopType(stop.type);\n  const unitStr = stop.shedDetails?.serial ? \` - Unit #\${stop.shedDetails.serial}\` : '';\n  return typeStr + unitStr;\n};\n`;
  fs.writeFileSync('src/lib/utils.ts', utilsContent);
}

// 2. Update Home.tsx
let homeContent = fs.readFileSync('src/Home.tsx', 'utf-8');

// Ensure getStopHeader is imported
if (!homeContent.includes('getStopHeader')) {
  homeContent = homeContent.replace(
    "import { cn, cleanStopType } from './lib/utils';",
    "import { cn, cleanStopType, getStopHeader } from './lib/utils';"
  );
}

// Function to replace stop rendering block
function replaceStopCard(content, stopVarName) {
  // Replace Header
  const headerRegex = new RegExp(`<span className="text-\\[16px\\] font-semibold text-\\[#2f3036\\] truncate flex-1 font-\\['Google_Sans_Flex'\\]">\\{${stopVarName}\\.address\\}<\\/span>`, 'g');
  let result = content.replace(headerRegex, `<span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex']">{getStopHeader(${stopVarName})}</span>`);

  // Active Stop has text-white header
  const activeHeaderRegex = new RegExp(`<span className="text-\\[16px\\] font-semibold text-white truncate flex-1 font-\\['Google_Sans_Flex'\\]">\\{${stopVarName}\\.address\\}<\\/span>`, 'g');
  result = result.replace(activeHeaderRegex, `<span className="text-[16px] font-semibold text-white truncate flex-1 font-['Google_Sans_Flex']">{getStopHeader(${stopVarName})}</span>`);

  // Replace Row 2 (Tags, Customer, Status)
  // For Active Stop (white text)
  const activeRow2Regex = new RegExp(`<div className="flex items-center gap-\\[8px\\] flex-wrap select-none w-full">\\s*<TagBadge text=\\{cleanStopType\\(${stopVarName}\\.type\\)\\} \\/>\\s*<div className="flex items-center gap-\\[2px\\] truncate text-white text-\\[12px\\] font-medium font-\\['Google_Sans_Flex'\\] max-w-\\[130px\\]">\\s*<img src=\\{imgUserIcon\\} className="w-\\[12px\\] h-\\[12px\\] filter brightness-0 invert" alt="user" \\/> \\{${stopVarName}\\.customerName\\}\\s*<\\/div>\\s*<StatusBadge status=\\{${stopVarName}\\.status === 'Servicing' \\? 'Arrived' : ${stopVarName}\\.status\\} className="ml-auto" \\/>\\s*<\\/div>`, 'g');
  
  result = result.replace(activeRow2Regex, `<div className="flex flex-col gap-1.5 w-full">
                                <div className="text-[13px] text-white/80 font-['Google_Sans_Flex'] leading-snug w-full pr-4">
                                  {${stopVarName}.address}
                                </div>
                                <div className="flex items-center justify-between w-full mt-0.5">
                                  <div className="flex items-center gap-[4px] text-white/90 text-[12px] font-medium font-['Google_Sans_Flex']">
                                    <img src={imgUserIcon} className="w-[12px] h-[12px] filter brightness-0 invert opacity-90" alt="user" /> {${stopVarName}.customerName}
                                  </div>
                                  <StatusBadge status={${stopVarName}.status === 'Servicing' ? 'Arrived' : ${stopVarName}.status} />
                                </div>
                              </div>`);

  // For Normal Stops
  const normalRow2Regex = new RegExp(`<div className="flex items-center gap-\\[8px\\] flex-wrap select-none w-full">\\s*<TagBadge text=\\{cleanStopType\\(${stopVarName}\\.type\\)\\} \\/>\\s*<div className="flex items-center gap-\\[2px\\] truncate text-\\[#71727a\\] text-\\[12px\\] font-medium font-\\['Google_Sans_Flex'\\] flex-1">\\s*<img src=\\{imgUserIcon\\} className="w-\\[12px\\] h-\\[12px\\]" alt="user" \\/> \\{${stopVarName}\\.customerName\\}\\s*<\\/div>\\s*<StatusBadge status=\\{${stopVarName}\\.status\\} \\/>\\s*<\\/div>`, 'g');
  
  result = result.replace(normalRow2Regex, `<div className="flex flex-col gap-1.5 w-full">
                                  <div className="text-[13px] text-[#71727a] font-['Google_Sans_Flex'] leading-snug w-full pr-4">
                                    {${stopVarName}.address}
                                  </div>
                                  <div className="flex items-center justify-between w-full mt-0.5">
                                    <div className="flex items-center gap-[4px] text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex']">
                                      <img src={imgUserIcon} className="w-[12px] h-[12px] opacity-70" alt="user" /> {${stopVarName}.customerName}
                                    </div>
                                    <StatusBadge status={${stopVarName}.status} />
                                  </div>
                                </div>`);
  
  return result;
}

homeContent = replaceStopCard(homeContent, 'activeStop');
homeContent = replaceStopCard(homeContent, 'immediateNextStop');
homeContent = replaceStopCard(homeContent, 'stop');

fs.writeFileSync('src/Home.tsx', homeContent);

// 3. Update StopListItem.tsx
let stopListContent = fs.readFileSync('src/components/StopListItem.tsx', 'utf-8');
if (!stopListContent.includes('getStopHeader')) {
  stopListContent = `import { getStopHeader } from '../lib/utils';\n` + stopListContent;
}

const listHeaderRegex = /<span className="text-\\[16px\\] font-semibold text-\\[#2f3036\\] truncate flex-1 font-\\['Google_Sans_Flex'\\]">\{stop\.address\}<\/span>/g;
stopListContent = stopListContent.replace(listHeaderRegex, `<span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex']">{getStopHeader(stop)}</span>`);

const listRow2Regex = /<div className="flex items-center gap-\\[8px\\] flex-wrap select-none w-full">\s*<TagBadge text=\{cleanStopType\(stop\.type\)\} \/>\s*<div className="flex items-center gap-\\[2px\\] truncate text-\\[#71727a\\] text-\\[12px\\] font-medium font-\\['Google_Sans_Flex'\\] flex-1">\s*<img src=\{imgUserIcon\} className="w-\\[12px\\] h-\\[12px\\]" alt="user" \/> \{stop\.customerName\}\s*<\/div>\s*<StatusBadge status=\{stop\.status\} \/>\s*<\/div>/g;
stopListContent = stopListContent.replace(listRow2Regex, `<div className="flex flex-col gap-1.5 w-full">
          <div className="text-[13px] text-[#71727a] font-['Google_Sans_Flex'] leading-snug w-full pr-4">
            {stop.address}
          </div>
          <div className="flex items-center justify-between w-full mt-0.5">
            <div className="flex items-center gap-[4px] text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex']">
              <img src={imgUserIcon} className="w-[12px] h-[12px] opacity-70" alt="user" /> {stop.customerName}
            </div>
            <StatusBadge status={stop.status} />
          </div>
        </div>`);

fs.writeFileSync('src/components/StopListItem.tsx', stopListContent);

console.log('Update completed');
