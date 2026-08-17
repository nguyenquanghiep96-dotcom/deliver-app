import { AlertTriangle, Check, ChevronLeft, Clock3, FileCheck2, MapPin, Route as RouteIcon, UploadCloud } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDriver } from './DriverContext';
import { getProofRequirements } from './lib/proofRequirements';

export default function EndRouteSummary() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { routes, finishRoute, pendingSyncCount, isOnline } = useDriver();
  const route = routes.find(item => item.id === routeId);
  const plannedMileage = route?.totalDistance?.replace(/[^0-9.]/g, '') || '';
  const [actualMileage, setActualMileage] = useState(route?.actualMileage || plannedMileage);

  const summary = useMemo(() => {
    if (!route) return null;
    const stops = route.stops.filter(stop => stop.workOrders.some(wo => wo.action !== 'Start' && wo.action !== 'End'));
    const tasks = stops.flatMap(stop => stop.workOrders.map(workOrder => ({ stop, workOrder })));
    const proofItems = tasks.filter(({ workOrder }) => workOrder.status !== 'Failed').flatMap(({ stop, workOrder }) => {
      const requirements = getProofRequirements(workOrder);
      return [
        requirements.photos ? { stopId: stop.id, workOrderId: workOrder.id, type: 'photos', complete: Boolean(workOrder.photos?.length) } : null,
        requirements.signature ? { stopId: stop.id, workOrderId: workOrder.id, type: 'signature', complete: Boolean(workOrder.signature) } : null,
        requirements.notes ? { stopId: stop.id, workOrderId: workOrder.id, type: 'notes', complete: Boolean(workOrder.notes?.trim()) } : null,
      ].filter(Boolean) as Array<{ stopId: string; workOrderId: string; type: 'photos' | 'signature' | 'notes'; complete: boolean }>;
    });
    const exceptions = tasks.filter(({ workOrder }) => workOrder.status === 'Failed').length + stops.reduce((count, stop) => count + (stop.issues?.length || 0), 0);
    return {
      stops,
      tasks,
      completedStops: stops.filter(stop => stop.status === 'Done').length,
      completedTasks: tasks.filter(({ workOrder }) => workOrder.status === 'Completed' || workOrder.status === 'Failed').length,
      proofItems,
      missingProofs: proofItems.filter(item => !item.complete),
      exceptions,
    };
  }, [route]);

  if (!route || !summary) {
    return <div className="min-h-full flex items-center justify-center text-[#71727A]">Route not found.</div>;
  }

  const routeStopsComplete = summary.completedStops === summary.stops.length;
  const canFinish = routeStopsComplete && summary.missingProofs.length === 0 && Boolean(actualMileage.trim());
  const firstMissingProof = summary.missingProofs[0];

  if (route.closeoutCompleted) {
    return (
      <main className="min-h-full px-4 pt-4 md:pt-[66px] pb-28 bg-[#F4F5F8] flex flex-col items-center justify-center text-center font-['Google_Sans_Flex']">
        <span className="size-16 rounded-full bg-[#2FA301] text-white flex items-center justify-center"><Check size={32} /></span>
        <h1 className="m-0 mt-4 text-[26px] font-bold text-[#2B3B63]">Route Finished</h1>
        <p className="m-0 mt-2 text-[14px] leading-relaxed text-[#71727A]">Your route summary has been saved{pendingSyncCount ? ' on this device and will sync when online' : ' and is ready for Dispatcher review'}.</p>
        <button onClick={() => navigate('/home?tab=home')} className="w-full min-h-[54px] mt-6 rounded-[14px] bg-[#2B3B63] text-white border-none text-[16px] font-bold cursor-pointer">Back to My Routes</button>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F4F5F8] pb-32 font-['Google_Sans_Flex']">
      <header className="sticky top-0 z-40 px-4 pt-4 md:pt-[66px] pb-3 bg-white/95 backdrop-blur-md flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Back" className="size-11 rounded-full bg-[#F4F5F8] text-[#2B3B63] border-none flex items-center justify-center cursor-pointer"><ChevronLeft size={21} /></button>
        <div>
          <h1 className="m-0 text-[17px] font-semibold text-[#2B3B63]">Route Summary</h1>
          <p className="m-0 mt-0.5 text-[11px] text-[#8A909D]">{route.name} · #{route.id}</p>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-3">
        <section className="rounded-[20px] bg-[#2B3B63] p-4 text-white" aria-labelledby="route-outcome-title">
          <div className="flex items-center gap-2">
            <RouteIcon size={19} className="text-[#FF7048]" />
            <h2 id="route-outcome-title" className="m-0 text-[17px] font-bold">Route outcome</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Metric value={`${summary.completedStops}/${summary.stops.length}`} label="Stops completed" />
            <Metric value={`${summary.completedTasks}/${summary.tasks.length}`} label="Tasks completed" />
            <Metric value={String(summary.exceptions)} label="Exceptions" />
            <Metric value={pendingSyncCount ? String(pendingSyncCount) : '0'} label="Waiting to sync" />
          </div>
        </section>

        <section className="rounded-[18px] bg-white border border-[#E1E4E9] p-4" aria-labelledby="proof-summary-title">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCheck2 size={19} className="text-[#2B3B63]" />
              <h2 id="proof-summary-title" className="m-0 text-[16px] font-bold text-[#2B3B63]">Required proof</h2>
            </div>
            <span className={`text-[12px] font-bold ${summary.missingProofs.length ? 'text-[#C67A00]' : 'text-[#278900]'}`}>
              {summary.proofItems.length - summary.missingProofs.length}/{summary.proofItems.length} ready
            </span>
          </div>
          {summary.missingProofs.length ? (
            <div className="mt-3 rounded-[13px] bg-[#FFF7ED] border border-[#F09A11]/25 p-3 flex gap-2.5">
              <AlertTriangle size={18} className="text-[#C67A00] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="m-0 text-[12px] font-bold text-[#7A4A00]">{summary.missingProofs.length} required proof item{summary.missingProofs.length === 1 ? '' : 's'} missing</p>
                <button
                  type="button"
                  onClick={() => firstMissingProof && navigate(`/route/${route.id}/stop/${firstMissingProof.stopId}/${firstMissingProof.type}?woId=${firstMissingProof.workOrderId}`)}
                  className="mt-2 min-h-[40px] px-3 rounded-[11px] bg-white border border-[#F09A11]/30 text-[#7A4A00] text-[12px] font-bold cursor-pointer"
                >
                  Add missing {firstMissingProof?.type}
                </button>
              </div>
            </div>
          ) : (
            <p className="m-0 mt-3 text-[12px] text-[#5F6572]">All required photos, signatures and notes are ready.</p>
          )}
        </section>

        <section className="rounded-[18px] bg-white border border-[#E1E4E9] p-4" aria-labelledby="mileage-title">
          <div className="flex items-center gap-2"><MapPin size={19} className="text-[#2B3B63]" /><h2 id="mileage-title" className="m-0 text-[16px] font-bold text-[#2B3B63]">Mileage & time</h2></div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[12px] bg-[#F7F8FA] p-3"><span className="block text-[10px] uppercase font-bold text-[#8A909D]">Planned</span><span className="block mt-1 text-[15px] font-bold text-[#2B3B63]">{route.totalDistance || '—'}</span></div>
            <div className="rounded-[12px] bg-[#F7F8FA] p-3"><span className="block text-[10px] uppercase font-bold text-[#8A909D]">Schedule</span><span className="block mt-1 text-[13px] font-bold text-[#2B3B63]">{route.startTime}{route.endTime ? `–${route.endTime}` : ''}</span></div>
          </div>
          <label className="block mt-3">
            <span className="block mb-1.5 text-[12px] font-bold text-[#2B3B63]">Actual route mileage</span>
            <div className="relative">
              <input value={actualMileage} onChange={event => setActualMileage(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" aria-describedby="mileage-help" className="w-full min-h-[52px] rounded-[13px] border border-[#DCE0E6] bg-white px-3 pr-12 text-[16px] font-bold text-[#2B3B63] box-border outline-none focus:border-[#2B3B63]" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#8A909D]">mi</span>
            </div>
            <span id="mileage-help" className="block mt-1 text-[11px] text-[#8A909D]">Confirm before finishing the route.</span>
          </label>
        </section>

        <section className={`rounded-[16px] border p-3 flex gap-2.5 ${isOnline && !pendingSyncCount ? 'bg-[#EFFAF0] border-[#2FA301]/20' : 'bg-[#EFF6FF] border-[#2563EB]/20'}`} aria-live="polite">
          {pendingSyncCount ? <UploadCloud size={18} className="text-[#2563EB] shrink-0" /> : <Clock3 size={18} className={isOnline ? 'text-[#278900]' : 'text-[#2563EB]'} />}
          <p className="m-0 text-[12px] leading-relaxed text-[#4B5563]">
            {pendingSyncCount ? `${pendingSyncCount} change${pendingSyncCount === 1 ? '' : 's'} will sync when a connection is available.` : isOnline ? 'All route data is synced.' : 'Offline: finishing will be saved on this device and synced later.'}
          </p>
        </section>
      </div>

      <div className="fixed left-0 right-0 bottom-[72px] z-50 px-4 py-3 bg-white border-t border-[#E7E9EE]">
        {!routeStopsComplete && <p className="m-0 mb-2 text-center text-[11px] font-semibold text-[#C67A00]">Complete all Stops before finishing this Route.</p>}
        <button
          type="button"
          disabled={!canFinish}
          onClick={() => finishRoute(route.id, actualMileage.trim())}
          className="w-full min-h-[56px] rounded-[14px] bg-[#2B3B63] text-white border-none text-[16px] font-bold flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#D4D6DD] disabled:text-[#71727A] disabled:cursor-not-allowed"
        >
          <Check size={20} /> Confirm & Finish Route
        </button>
      </div>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[14px] bg-white/10 p-3">
      <span className="block text-[20px] font-bold">{value}</span>
      <span className="block mt-0.5 text-[11px] text-white/65">{label}</span>
    </div>
  );
}
