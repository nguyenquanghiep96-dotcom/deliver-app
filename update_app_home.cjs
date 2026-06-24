const fs = require('fs');

// 1. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('UpcomingStopsList')) {
  appContent = appContent.replace(
    /import StopDetail from '\.\/StopDetail';/,
    "import StopDetail from './StopDetail';\nimport UpcomingStopsList from './UpcomingStopsList';\nimport CompletedStopsList from './CompletedStopsList';"
  );
  appContent = appContent.replace(
    /<Route path="\/stop\/:id" element={<StopDetail \/>} \/>/,
    `<Route path="/stop/:id" element={<StopDetail />} />
        <Route path="/upcoming-stops" element={<UpcomingStopsList />} />
        <Route path="/completed-stops" element={<CompletedStopsList />} />`
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

// 2. Update Home.tsx
let homeContent = fs.readFileSync('src/Home.tsx', 'utf8');

// Add StopListItem import if not there
if (!homeContent.includes('import StopListItem')) {
  homeContent = homeContent.replace(
    /import \{ Link, useNavigate \} from 'react-router-dom';/,
    "import { Link, useNavigate } from 'react-router-dom';\nimport StopListItem from './components/StopListItem';"
  );
}

// Next Stops - distance text
const oldNextStopsHeader = `<div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Next Stops</h2>
                          </div>`;
const newNextStopsHeader = `<div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Next Stops</h2>
                            <span className="text-[14px] font-normal text-[#71727A] font-['Google_Sans_Flex']">2.5 mi</span>
                          </div>`;
homeContent = homeContent.replace(oldNextStopsHeader, newNextStopsHeader);

// Upcoming Stops - View All Link
const oldUpcomingHeader = `<div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Upcoming Stops</h2>
                            <button className="text-[14px] font-semibold text-[#71727A] font-['Google_Sans_Flex'] bg-transparent border-none cursor-pointer p-0 active:scale-95 transition-transform">View All</button>
                          </div>`;
const newUpcomingHeader = `<div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Upcoming Stops</h2>
                            <Link to="/upcoming-stops" className="text-[14px] font-semibold text-[#71727A] font-['Google_Sans_Flex'] decoration-none">View All</Link>
                          </div>`;
homeContent = homeContent.replace(oldUpcomingHeader, newUpcomingHeader);

// Completed Stops - View All Link
const oldCompletedHeader = `<div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Recent Completed</h2>
                            <button className="text-[14px] font-semibold text-[#71727A] font-['Google_Sans_Flex'] bg-transparent border-none cursor-pointer p-0 active:scale-95 transition-transform">View All</button>
                          </div>`;
const newCompletedHeader = `<div className="flex items-center justify-between px-1">
                            <h2 className="text-[16px] font-semibold text-[#2f3036] font-['Google_Sans_Flex']">Recent Completed</h2>
                            <Link to="/completed-stops" className="text-[14px] font-semibold text-[#71727A] font-['Google_Sans_Flex'] decoration-none">View All</Link>
                          </div>`;
homeContent = homeContent.replace(oldCompletedHeader, newCompletedHeader);

// Replace mapping block for Upcoming Stops (limit to 2)
const oldUpcomingMapRegex = /\{upcomingStopsList\.map\(\(stop\) => \([\s\S]*?\n\s*\}\)\}/;
const newUpcomingMap = `{upcomingStopsList.slice(0, 2).map((stop) => (
                              <StopListItem key={stop.id} stop={stop} />
                            ))}`;
homeContent = homeContent.replace(oldUpcomingMapRegex, newUpcomingMap);

// Replace mapping block for Completed Stops (limit to 2)
const oldCompletedMapRegex = /\{completedStopsList\.map\(\(stop\) => \([\s\S]*?\n\s*\}\)\}/;
const newCompletedMap = `{completedStopsList.slice(0, 2).map((stop) => (
                              <StopListItem key={stop.id} stop={stop} />
                            ))}`;
homeContent = homeContent.replace(oldCompletedMapRegex, newCompletedMap);

fs.writeFileSync('src/Home.tsx', homeContent);

console.log('App.tsx and Home.tsx updated successfully');
