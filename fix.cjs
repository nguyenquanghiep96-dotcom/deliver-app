const fs = require('fs');
let content = fs.readFileSync('src/StopDetail.tsx', 'utf8');

// Fix ButtonFilled2
content = content.replace(/function ButtonFilled2\(\{ stop \}: any\) \{([\s\S]*?)<\/div>\s*\n\s*\);\s*\n\}/g, (match, inner) => {
  return `function ButtonFilled2({ stop }: any) {${inner}</a>\n  );\n}`;
});

// Fix ButtonFilled3
content = content.replace(/function ButtonFilled3\(\{ stop \}: any\) \{([\s\S]*?)<\/div>\s*\n\s*\);\s*\n\}/g, (match, inner) => {
  return `function ButtonFilled3({ stop }: any) {${inner}</a>\n  );\n}`;
});

fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Fixed');
