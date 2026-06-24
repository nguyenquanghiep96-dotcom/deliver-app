const fs = require('fs');

// 1. Add ID to DriverLayout.tsx
let layoutContent = fs.readFileSync('src/DriverLayout.tsx', 'utf8');
layoutContent = layoutContent.replace(
  /className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative bg-cover bg-center bg-no-repeat no-scrollbar"/,
  'id="scroll-container"\n          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative bg-cover bg-center bg-no-repeat no-scrollbar"'
);
fs.writeFileSync('src/DriverLayout.tsx', layoutContent);

// 2. Fix Home.tsx to use the new ID
let homeContent = fs.readFileSync('src/Home.tsx', 'utf8');
homeContent = homeContent.replace(
  /document\.querySelector\('main'\)/g,
  "document.getElementById('scroll-container')"
);
fs.writeFileSync('src/Home.tsx', homeContent);

// 3. Fix StopDetail.tsx to use the new ID
let stopDetailContent = fs.readFileSync('src/StopDetail.tsx', 'utf8');
stopDetailContent = stopDetailContent.replace(
  /document\.querySelector\('main'\)/g,
  "document.getElementById('scroll-container')"
);
fs.writeFileSync('src/StopDetail.tsx', stopDetailContent);

console.log('Scroll target fixed');
