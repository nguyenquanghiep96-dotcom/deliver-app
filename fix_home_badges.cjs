const fs = require('fs');

let content = fs.readFileSync('src/Home.tsx', 'utf-8');

if (!content.includes("import { TagBadge, StatusBadge } from './components/Badges';")) {
  content = content.replace(
    "import { cleanStopType } from './components/StopListItem';",
    "import { cleanStopType } from './components/StopListItem';\nimport { TagBadge, StatusBadge } from './components/Badges';"
  );
}

// Replace immediateNextStop badge
content = content.replace(
  /<div className="bg-\[#e8e9f1\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[11px\] font-semibold text-\[#2f3036\] shrink-0 font-\['Proxima_Nova'\] border border-\[#e8e9f1\]">\s*\{cleanStopType\(immediateNextStop\.type\)\}\s*<\/div>/g,
  '<TagBadge text={cleanStopType(immediateNextStop.type)} />'
);

content = content.replace(
  /<div className="bg-\[rgba\(240,154,17,0\.2\)\] text-\[#f09a11\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[10px\] font-semibold shrink-0 font-\['Google_Sans_Flex'\] border border-\[rgba\(240,154,17,0\.2\)\]">\s*Pending\s*<\/div>/g,
  '<StatusBadge status={immediateNextStop.status} />'
);

// Replace stop badge (upcoming/completed)
content = content.replace(
  /<div className="bg-\[#e8e9f1\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[11px\] font-semibold text-\[#2f3036\] shrink-0 font-\['Proxima_Nova'\] border border-\[#e8e9f1\]">\s*\{cleanStopType\(stop\.type\)\}\s*<\/div>/g,
  '<TagBadge text={cleanStopType(stop.type)} />'
);

content = content.replace(
  /<div className="bg-\[#F2F4F7\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[11px\] font-semibold text-\[#2f3036\] shrink-0 font-\['Proxima_Nova'\] border border-\[#F2F4F7\]">\s*\{cleanStopType\(stop\.type\)\}\s*<\/div>/g,
  '<TagBadge text={cleanStopType(stop.type)} />'
);

content = content.replace(
  /<div className="bg-\[rgba\(240,154,17,0\.2\)\] text-\[#f09a11\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[10px\] font-semibold shrink-0 font-\['Google_Sans_Flex'\] border border-\[rgba\(240,154,17,0\.2\)\]">\s*Pending\s*<\/div>/g,
  '<StatusBadge status={stop.status} />'
);

content = content.replace(
  /<div className="bg-\[#DCFCE7\] text-\[#16A34A\] px-\[8px\] py-\[3px\] rounded-\[6px\] text-\[10px\] font-semibold shrink-0 font-\['Google_Sans_Flex'\] border border-\[#BBF7D0\]">\s*Completed\s*<\/div>/g,
  '<StatusBadge status={stop.status} />'
);

fs.writeFileSync('src/Home.tsx', content);
console.log("Done");
