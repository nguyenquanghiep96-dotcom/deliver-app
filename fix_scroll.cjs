const fs = require('fs');

// 1. Fix Home.tsx
let homeContent = fs.readFileSync('src/Home.tsx', 'utf8');
homeContent = homeContent.replace(
  /useEffect\(\(\) => \{\n    const handleScroll = \(\) => \{\n      setIsScrolled\(window\.scrollY > 10\);\n    \};\n    window\.addEventListener\('scroll', handleScroll\);\n    return \(\) => window\.removeEventListener\('scroll', handleScroll\);\n  \}, \[\]\);/g,
  "useEffect(() => {\n    const mainEl = document.querySelector('main');\n    if (!mainEl) return;\n    const handleScroll = (e) => {\n      setIsScrolled(e.target.scrollTop > 10);\n    };\n    mainEl.addEventListener('scroll', handleScroll);\n    return () => mainEl.removeEventListener('scroll', handleScroll);\n  }, []);"
);
fs.writeFileSync('src/Home.tsx', homeContent);

// 2. Fix StopDetail.tsx
let stopDetailContent = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// Add useEffect to StopDetail for main scrolling
if (!stopDetailContent.includes("document.querySelector('main')")) {
  stopDetailContent = stopDetailContent.replace(
    /const \[isScrolled, setIsScrolled\] = useState\(false\);/,
    "const [isScrolled, setIsScrolled] = useState(false);\n  useEffect(() => {\n    const mainEl = document.querySelector('main');\n    if (!mainEl) return;\n    const handleScroll = (e) => {\n      setIsScrolled(e.target.scrollTop > 10);\n    };\n    mainEl.addEventListener('scroll', handleScroll);\n    return () => mainEl.removeEventListener('scroll', handleScroll);\n  }, []);"
  );
  
  // Remove the redundant onScroll from the div
  stopDetailContent = stopDetailContent.replace(
    /onScroll=\{\(e\) => setIsScrolled\(e\.currentTarget\.scrollTop > 10\)\}/g,
    ""
  );
}

fs.writeFileSync('src/StopDetail.tsx', stopDetailContent);
console.log('Scroll events fixed');
