import React, { useState, useRef } from 'react';
import { Check, ChevronLeft, PenLine } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useDriver } from './DriverContext';

export default function SignatureView() {
  const { routeId, stopId } = useParams();
  const [searchParams] = useSearchParams();
  const woId = searchParams.get('woId');
  const navigate = useNavigate();
  const { routes, saveSignature } = useDriver();

  const currentRoute = routes.find(r => r.id === routeId);
  const stop = currentRoute?.stops.find(s => s.id === stopId);
  const workOrder = stop?.workOrders.find(wo => wo.id === woId);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  if (!currentRoute || !stop || !workOrder) {
    return (
      <div
        className="flex-1 flex items-center justify-center p-8 text-center"
        style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif" }}
      >
        <span style={{ fontSize: 16, color: '#71727A' }}>Stop Not Found</span>
      </div>
    );
  }

  // ── Drawing helpers ────────────────────────────────────────────────────────

  const getCoords = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#2B3B63';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const { x, y } = getCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasStrokes(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const saveSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveSignature(currentRoute.id, stop.id, workOrder.id, canvas.toDataURL());
    navigate(-1);
  };

  const showSavedSignature = Boolean(workOrder.signature) && !isReplacing;

  return (
    <div
      className="relative flex-1 flex flex-col select-none h-full"
      style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif", overflow: 'hidden', paddingBottom: 120 }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-[16px] px-4 pt-4 md:pt-[66px] pb-3 shrink-0"
        style={{ background: '#E8E9F1' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-[14px] bg-white rounded-full flex items-center justify-center shrink-0 border-none cursor-pointer active:scale-95 transition-transform"
          style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.10)' }}
        >
          <ChevronLeft size={16} color="#5E6578" />
        </button>
        <h1
          className="flex-1 m-0"
          style={{ color: '#2B3B63', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}
        >
          Signature
        </h1>
      </header>

      {/* ── Saved signature review or capture canvas ── */}
      <div className="flex-1 px-4 mt-[8px] overflow-hidden">
        {showSavedSignature ? (
          <div className="w-full h-full rounded-[16px] bg-white flex flex-col items-center justify-center p-5 box-border">
            <span className="mb-4 size-10 rounded-full bg-[#2FA301] text-white flex items-center justify-center" aria-hidden="true"><Check size={21} /></span>
            <p className="m-0 text-[14px] font-bold text-[#2B3B63]">Signature saved</p>
            <p className="m-0 mt-1 text-[11px] text-[#8A909D]">{workOrder.id} · {workOrder.customerName}</p>
            <div className="mt-5 w-full flex-1 min-h-0 rounded-[14px] bg-[#F7F8FA] border border-[#E8E9F1] p-4 flex items-center justify-center overflow-hidden">
              <img src={workOrder.signature} alt={`Saved signature for ${workOrder.customerName}`} className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden relative bg-white rounded-[16px] h-full">
            <div className="absolute left-[48px] right-[48px]" style={{ top: '55%', height: 1, background: '#E0E1E8', pointerEvents: 'none' }} />
            {!hasStrokes && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: '10%' }}>
                <span style={{ color: '#C5C6CC', fontSize: 13, fontFamily: 'Google Sans Flex' }}>Sign here</span>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={720}
              height={932}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair"
              style={{ background: 'transparent', touchAction: 'none' }}
            />
          </div>
        )}
      </div>

      {/* ── Buttons — always anchored at bottom, visible on screen ──── */}
      <div className="px-4 flex flex-col gap-[10px] mt-[12px] mb-[12px] shrink-0">
        {showSavedSignature ? (
          <>
            <button onClick={() => navigate(-1)} className="w-full min-h-[56px] rounded-[16px] bg-[#2B3B63] text-white border-none text-[16px] font-semibold cursor-pointer">Done</button>
            <button onClick={() => setIsReplacing(true)} className="w-full min-h-[56px] rounded-[16px] bg-white border border-[#D4D6DD] text-[#2B3B63] text-[16px] font-semibold flex items-center justify-center gap-2 cursor-pointer">
              <PenLine size={18} /> Replace Signature
            </button>
          </>
        ) : (
          <>
            <button
              onClick={saveSig}
              disabled={!hasStrokes}
              className="w-full min-h-[56px] flex items-center justify-center border-none cursor-pointer active:scale-[0.98] transition-transform rounded-[16px] bg-[#FF7048] disabled:bg-[#D4D6DD] disabled:text-[#71727A]"
            >
              <span className="text-white text-[16px] font-semibold">{workOrder.signature ? 'Save New Signature' : 'Save Signature'}</span>
            </button>
            <button onClick={clearCanvas} className="w-full min-h-[56px] rounded-[16px] bg-[#D4D6DD] text-[#2B3B63] border-none text-[16px] font-semibold cursor-pointer">Clear</button>
          </>
        )}
      </div>
    </div>
  );
}
