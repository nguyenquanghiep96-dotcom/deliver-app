import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { DriverProvider } from './DriverContext';
import DriverLayout from './DriverLayout';
import Home from './Home';
import RouteDetail from './RouteDetail';
import StopDetail from './StopDetail';
import BuildingDetail from './BuildingDetail';
import SignatureView from './SignatureView';
import PhotosView from './PhotosView';
import StopNotesView from './StopNotesView';
import UpcomingStopsList from './UpcomingStopsList';
import CompletedStopsList from './CompletedStopsList';

export default function App() {
  return (
    <DriverProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DriverLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="route/:routeId" element={<RouteDetail />} />
            <Route path="stop/:stopId" element={<StopDetail />} />
            <Route path="stop/:stopId/building" element={<BuildingDetail />} />
            <Route path="stop/:stopId/signature" element={<SignatureView />} />
            <Route path="stop/:stopId/photos" element={<PhotosView />} />
            <Route path="stop/:stopId/notes" element={<StopNotesView />} />
            <Route path="upcoming-stops" element={<UpcomingStopsList />} />
            <Route path="completed-stops" element={<CompletedStopsList />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DriverProvider>
  );
}
