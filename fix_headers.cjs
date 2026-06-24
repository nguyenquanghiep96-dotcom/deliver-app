const fs = require('fs');

// 1. Fix Home.tsx headers
let homeContent = fs.readFileSync('src/Home.tsx', 'utf8');

// Add isScrolled state if not present
if (!homeContent.includes('const [isScrolled, setIsScrolled] = useState(false);')) {
  // Find where to insert it. Just after activeTab state.
  homeContent = homeContent.replace(
    /const \[activeTab, setActiveTab\] = useState<'home' \| 'routes' \| 'calendar' \| 'profile'\>\('home'\);/,
    "const [activeTab, setActiveTab] = useState<'home' | 'routes' | 'calendar' | 'profile'>('home');\n  const [isScrolled, setIsScrolled] = useState(false);\n\n  useEffect(() => {\n    const handleScroll = () => {\n      setIsScrolled(window.scrollY > 10);\n    };\n    window.addEventListener('scroll', handleScroll);\n    return () => window.removeEventListener('scroll', handleScroll);\n  }, []);\n"
  );
}

// Replace header className for all 4 tabs
const oldHeaderClass = '<header className="flex items-center justify-between px-4 pt-\\[60px\\] pb-4 select-none h-\\[127px\\] shrink-0 border-b border-black/5">';
const newHeaderClass = '<header className={`flex items-center justify-between px-4 pt-[60px] pb-4 select-none h-[110px] shrink-0 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? \'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-black/5\' : \'bg-transparent border-transparent\'}`}>';

homeContent = homeContent.replace(new RegExp(oldHeaderClass, 'g'), newHeaderClass);
fs.writeFileSync('src/Home.tsx', homeContent);

// 2. Fix StopDetail.tsx header
let stopDetailContent = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// Add isScrolled state to StopDetail
if (!stopDetailContent.includes('const [isScrolled, setIsScrolled] = useState(false);')) {
  stopDetailContent = stopDetailContent.replace(
    /export default function StopDetail\(\) \{/,
    "export default function StopDetail() {\n  const [isScrolled, setIsScrolled] = useState(false);"
  );
  
  // Add onScroll to the root div
  stopDetailContent = stopDetailContent.replace(
    /<div className="pb-\[120px\] relative flex flex-col min-h-full font-\['Google_Sans_Flex'\] overflow-x-hidden overflow-y-auto no-scrollbar" data-name="Stop Details">/,
    '<div className="pb-[120px] relative flex flex-col min-h-full font-[\'Google_Sans_Flex\'] overflow-x-hidden overflow-y-auto no-scrollbar" data-name="Stop Details" onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 10)}>'
  );

  // Pass isScrolled to Header
  stopDetailContent = stopDetailContent.replace(
    /<Header stop=\{stop\} currentRoute=\{currentRoute\} navigate=\{navigate\} \/>/,
    '<Header stop={stop} currentRoute={currentRoute} navigate={navigate} isScrolled={isScrolled} />'
  );

  // Modify Header component signature and className
  stopDetailContent = stopDetailContent.replace(
    /function Header\(\{ stop, currentRoute, navigate \}: any\) \{/,
    'function Header({ stop, currentRoute, navigate, isScrolled }: any) {'
  );

  stopDetailContent = stopDetailContent.replace(
    /<div className="h-\[127px\] px-4 pt-\[64px\] flex justify-between items-center w-full shrink-0 z-20 font-\['Google_Sans_Flex'\] relative">/,
    '<div className={`h-[110px] px-4 pt-[60px] flex justify-between items-center w-full shrink-0 z-50 font-[\'Google_Sans_Flex\'] sticky top-0 transition-all duration-300 ${isScrolled ? \'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]\' : \'bg-transparent\'}`}>'
  );
}

fs.writeFileSync('src/StopDetail.tsx', stopDetailContent);
console.log('Headers updated for sticky scroll');
