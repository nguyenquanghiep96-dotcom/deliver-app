const fs = require('fs');

['src/UpcomingStopsList.tsx', 'src/CompletedStopsList.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ mockRoutes \} from '\.\/data\/mockData';/g, "import { useDriver } from './DriverContext';");
  content = content.replace(/const activeRoute = routes\.find/g, "const { routes } = useDriver();\n  const activeRoute = routes.find");
  fs.writeFileSync(file, content);
});

console.log('Fixed');
