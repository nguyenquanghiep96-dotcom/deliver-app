import { ArrowRight, Check, Clock3, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import type { DispatcherRouteUpdate } from '../DriverContext';

interface RouteUpdateNoticeProps {
  update: DispatcherRouteUpdate;
  onAcknowledge: (updateId: string) => void;
}

export function RouteUpdateNotice({ update, onAcknowledge }: RouteUpdateNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (update.acknowledged) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[64px] p-3 rounded-[16px] border border-[#2563EB]/20 bg-[#EFF6FF] flex items-center gap-3 text-left cursor-pointer active:scale-[0.99] transition-transform"
      >
        <span className="relative size-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
          <RefreshCw size={18} />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[#FF7048] border-2 border-[#EFF6FF]" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-bold text-[#1D4ED8]">Route updated</span>
          <span className="block text-[12px] font-medium text-[#4B5563] truncate mt-0.5">{update.summary}</span>
        </span>
        <span className="text-[12px] font-bold text-[#2563EB] flex items-center gap-1 shrink-0">
          Review <ArrowRight size={15} />
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-transparent border-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close route update"
          />
          <section className="h-[62%] min-h-[62%] max-h-[62%] bg-white rounded-t-[28px] px-4 pt-4 pb-6 flex flex-col overflow-hidden shadow-2xl">
            <header className="flex items-center justify-between pb-3 border-b border-[#ECEEF2] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="size-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <RefreshCw size={19} />
                </span>
                <span className="min-w-0">
                  <h2 className="text-[17px] font-bold text-[#2B3B63] m-0 truncate">{update.title}</h2>
                  <span className="text-[11px] text-[#8A909D] flex items-center gap-1 mt-0.5">
                    <Clock3 size={12} /> Received {update.receivedAt}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-10 rounded-full bg-[#F2F4F7] text-[#71727A] border-none flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto py-4 no-scrollbar">
              <div className="bg-[#FFF7F3] border border-[#FF7048]/15 rounded-[14px] px-3 py-2.5 mb-3">
                <p className="m-0 text-[12px] leading-relaxed text-[#4B5563]">
                  Review each change before continuing the route. Your acknowledgement will be visible to the Dispatcher.
                </p>
              </div>
              <div className="space-y-3">
                {update.changes.map(change => (
                  <article key={change.label} className="rounded-[16px] border border-[#E1E4E9] overflow-hidden">
                    <h3 className="m-0 px-3 py-2.5 bg-[#F7F8FA] text-[12px] font-bold text-[#2B3B63]">{change.label}</h3>
                    <div className="p-3 space-y-2.5">
                      {change.previous && (
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">Previous</span>
                          <p className="m-0 text-[12px] leading-relaxed text-[#8A909D] line-through decoration-[#DC2626]/40">{change.previous}</p>
                        </div>
                      )}
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#2563EB] mb-1">Updated</span>
                        <p className="m-0 text-[13px] font-semibold leading-relaxed text-[#2B3B63]">{change.current}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onAcknowledge(update.id);
                setIsOpen(false);
              }}
              className="w-full min-h-[54px] rounded-[14px] bg-[#2B3B63] text-white border-none text-[16px] font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform shrink-0"
            >
              <Check size={19} /> Acknowledge Update
            </button>
          </section>
        </div>
      )}
    </>
  );
}
