const fs = require('fs');

['src/UpcomingStopsList.tsx', 'src/CompletedStopsList.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("const { routes } = useDriver();\n  const { routes } = useDriver();", "const { routes } = useDriver();");
  content = content.replace("|| mockRoutes.find", "|| routes.find");
  fs.writeFileSync(file, content);
});

console.log('Fixed syntax errors');
