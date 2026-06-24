const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('path="upcoming-stops"')) {
  appContent = appContent.replace(
    /<Route path="stop\/:stopId" element=\{<StopDetail \/>\} \/>/,
    `<Route path="stop/:stopId" element={<StopDetail />} />
            <Route path="upcoming-stops" element={<UpcomingStopsList />} />
            <Route path="completed-stops" element={<CompletedStopsList />} />`
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

console.log('Routes added');
