import React, { useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';

export default function SignatureView() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes, saveSignature } = useDriver();

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  if (!currentRoute || !stop) {
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
    ctx.strokeStyle = '#2F3036';
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
    saveSignature(currentRoute.id, stop.id, canvas.toDataURL());
    navigate(-1);
  };

  return (
    <div
      className="relative flex-1 flex flex-col select-none h-full"
      style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif", overflow: 'hidden', paddingBottom: 120 }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-[16px] px-4 pt-[66px] pb-3 shrink-0"
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
          style={{ color: '#2F3036', fontSize: 18, fontWeight: 600, fontFamily: 'Google Sans Flex' }}
        >
          Signature
        </h1>
      </header>

      {/* ── Canvas — fills available space between header and buttons ── */}
      <div className="flex-1 px-4 mt-[8px] overflow-hidden">
        <div
          className="w-full overflow-hidden relative"
          style={{
            background: 'white',
            borderRadius: 16,
            height: '100%',
          }}
        >
          {/* Guide line */}
          <div
            className="absolute left-[48px] right-[48px]"
            style={{ top: '55%', height: 1, background: '#E0E1E8', pointerEvents: 'none' }}
          />
          {/* Hint — fades once drawing starts */}
          {!hasStrokes && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ paddingTop: '10%' }}
            >
              <span style={{ color: '#C5C6CC', fontSize: 13, fontFamily: 'Google Sans Flex' }}>
                Sign here
              </span>
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
      </div>

      {/* ── Buttons — always anchored at bottom, visible on screen ──── */}
      <div className="px-4 flex flex-col gap-[10px] mt-[12px] mb-[12px] shrink-0">
        {/* Save */}
        <button
          onClick={saveSig}
          className="w-full flex items-center justify-center border-none cursor-pointer active:scale-[0.98] transition-transform rounded-[16px]"
          style={{
            paddingTop: 17.5, paddingBottom: 17.5,
            background: '#FF7048',
            boxShadow: '0px 8px 20px rgba(255,112,72,0.35)',
          }}
        >
          <span style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Save</span>
        </button>

        {/* Clear */}
        <button
          onClick={clearCanvas}
          className="w-full flex items-center justify-center border-none cursor-pointer active:scale-[0.98] transition-transform rounded-[16px]"
          style={{ paddingTop: 17.5, paddingBottom: 17.5, background: '#D4D6DD' }}
        >
          <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Clear</span>
        </button>
      </div>
    </div>
  );
}
