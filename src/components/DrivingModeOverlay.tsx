import { ArrowLeft, MapPinned, Navigation, Phone, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDriver } from '../DriverContext';

export default function DrivingModeOverlay() {
  const navigate = useNavigate();
  const { routes, drivingTarget, endDrivingMode } = useDriver();
  if (!drivingTarget) return null;

  const route = routes.find(item => item.id === drivingTarget.routeId);
  const stop = route?.stops.find(item => item.id === drivingTarget.stopId);
  if (!route || !stop) return null;

  const resumeNavigation = () => {
    const encodedAddress = encodeURIComponent(stop.address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
    sessionStorage.setItem('opshub_return_to_stop', `/route/${route.id}/stop/${stop.id}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const exitDrivingMode = () => {
    endDrivingMode();
    navigate(`/route/${route.id}/stop/${stop.id}`, { replace: true });
  };

  return (
    <main
      className="absolute inset-0 z-[160] flex flex-col bg-[#F4F5F8] px-5 pb-5 pt-5 md:pt-[68px] font-['Google_Sans_Flex']"
      aria-label={`Driving Mode to Stop ${stop.num}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#E8EEFF] px-3 text-[13px] font-bold text-[#2563EB]">
          <Navigation size={16} fill="currentColor" aria-hidden="true" />
          Driving Mode
        </span>
        <span className="text-[12px] font-medium text-[#71727A]">{route.name}</span>
      </div>

      <section className="flex flex-1 flex-col items-center justify-center text-center" aria-live="polite">
        <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-[#2B3B63] text-white">
          <MapPinned size={30} aria-hidden="true" />
        </span>
        <p className="m-0 text-[14px] font-bold uppercase tracking-[0.08em] text-[#71727A]">Next destination</p>
        <h1 className="m-0 mt-2 text-[30px] font-bold leading-tight text-[#2B3B63]">Stop {stop.num}</h1>
        <p className="m-0 mt-3 max-w-[310px] text-[20px] font-semibold leading-[1.35] text-[#2B3B63]">{stop.address}</p>
        <p className="m-0 mt-3 text-[15px] font-medium text-[#71727A]">{stop.distance || 'Directions ready'}</p>
        <div className="mt-7 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-left text-[#5F6470]">
          <ShieldCheck size={19} className="shrink-0 text-[#2563EB]" aria-hidden="true" />
          <span className="text-[13px] font-medium leading-snug">Stop actions are hidden while driving. Exit this mode when safely parked.</span>
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={resumeNavigation}
          className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-[14px] border-none bg-[#FF7048] px-5 text-[17px] font-bold text-white active:scale-[0.99]"
          aria-label={`Resume navigation to Stop ${stop.num}`}
        >
          <Navigation size={21} fill="currentColor" aria-hidden="true" />
          Resume Navigation
        </button>
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:+18005550199"
            className="flex min-h-14 items-center justify-center gap-2 rounded-[14px] border border-[#DCE0E6] bg-white px-3 text-[15px] font-bold text-[#2B3B63] no-underline"
            aria-label="Call Dispatcher"
          >
            <Phone size={19} aria-hidden="true" />
            Dispatcher
          </a>
          <button
            type="button"
            onClick={exitDrivingMode}
            className="flex min-h-14 items-center justify-center gap-2 rounded-[14px] border border-[#DCE0E6] bg-white px-3 text-[15px] font-bold text-[#2B3B63]"
          >
            <ArrowLeft size={19} aria-hidden="true" />
            Exit Mode
          </button>
        </div>
      </div>
    </main>
  );
}
