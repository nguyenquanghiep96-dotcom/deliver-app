import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { DriverProvider } from './DriverContext';
import DriverLayout from './DriverLayout';
import Splash from './Splash';
import Login from './Login';
import Home from './Home';
import RouteDetail from './RouteDetail';
import StopDetail from './StopDetail';
import BuildingDetail from './BuildingDetail';
import SignatureView from './SignatureView';
import PhotosView from './PhotosView';
import StopNotesView from './StopNotesView';
import UpcomingStopsList from './UpcomingStopsList';
import CompletedStopsList from './CompletedStopsList';
import EndRouteSummary from './EndRouteSummary';

export default function App() {
  return (
    <DriverProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DriverLayout />}>
            <Route index element={<Splash />} />
            <Route path="login" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="route/:routeId" element={<RouteDetail />} />
            <Route path="route/:routeId/summary" element={<EndRouteSummary />} />
            <Route path="route/:routeId/stop/:stopId" element={<StopDetail />} />
            <Route path="route/:routeId/stop/:stopId/model" element={<BuildingDetail />} />
            <Route path="route/:routeId/stop/:stopId/building" element={<BuildingDetail />} />
            <Route path="route/:routeId/stop/:stopId/signature" element={<SignatureView />} />
            <Route path="route/:routeId/stop/:stopId/photos" element={<PhotosView />} />
            <Route path="route/:routeId/stop/:stopId/notes" element={<StopNotesView />} />
            <Route path="upcoming-stops" element={<UpcomingStopsList />} />
            <Route path="completed-stops" element={<CompletedStopsList />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DriverProvider>
  );
}
