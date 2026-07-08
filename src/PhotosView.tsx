import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent(i => Math.max(0, i - 1));
  const next = () => setCurrent(i => Math.min(photos.length - 1, i + 1));

  // Swipe support
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (delta < -50) next();
    else if (delta > 50) prev();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 pt-[66px] pb-4 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="p-[14px] bg-white/10 rounded-full flex items-center justify-center border-none cursor-pointer active:scale-95 transition-transform"
        >
          <ChevronLeft size={16} color="white" />
        </button>
        <span style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
          {current + 1} / {photos.length}
        </span>
        <div style={{ width: 44 }} />
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center px-4 select-none"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photos[current]}
          alt={`Photo ${current + 1}`}
          className="max-w-full max-h-full object-contain rounded-[12px]"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        />
      </div>

      {/* Prev / Next arrows */}
      {photos.length > 1 && (
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-4"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-full bg-white/10 disabled:opacity-30 border-none cursor-pointer active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} color="white" />
          </button>
        </div>
      )}
      {photos.length > 1 && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-4"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={next}
            disabled={current === photos.length - 1}
            className="p-2 rounded-full bg-white/10 disabled:opacity-30 border-none cursor-pointer active:scale-95 transition-transform"
          >
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      )}

      {/* Dots */}
      {photos.length > 1 && (
        <div
          className="flex justify-center items-center gap-[6px] pb-8 shrink-0"
          onClick={e => e.stopPropagation()}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="border-none cursor-pointer p-0 rounded-full transition-all"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? '#FF7048' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PhotosView() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes, addPhoto, removePhoto } = useDriver();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

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

  const photos = stop.photos || [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          addPhoto(currentRoute.id, stop.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative flex-1 flex flex-col select-none h-full"
      style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif", overflow: 'hidden', paddingBottom: 82 }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-[16px] px-4 pt-[66px] pb-3 shrink-0 sticky top-0 z-50"
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
          Photos
        </h1>
        {photos.length > 0 && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ background: '#FF7048', color: 'white', fontSize: 12, fontWeight: 600 }}
          >
            {photos.length}
          </span>
        )}
      </header>

      {/* Content - scrollable, padded at bottom for the fixed button */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-[160px] flex flex-col gap-[16px] mt-[4px]">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(108,110,122,0.12)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 17.5C13.25 17.5 14.3125 17.0625 15.1875 16.1875C16.0625 15.3125 16.5 14.25 16.5 13C16.5 11.75 16.0625 10.6875 15.1875 9.8125C14.3125 8.9375 13.25 8.5 12 8.5C10.75 8.5 9.6875 8.9375 8.8125 9.8125C7.9375 10.6875 7.5 11.75 7.5 13C7.5 14.25 7.9375 15.3125 8.8125 16.1875C9.6875 17.0625 10.75 17.5 12 17.5ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H7.15L9 3H15L16.85 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4Z" fill="#C5C6CC"/>
              </svg>
            </div>
            <p className="m-0" style={{ fontSize: 15, fontWeight: 600, color: '#2F3036', fontFamily: 'Google Sans Flex' }}>
              No Photos Yet
            </p>
            <p className="m-0" style={{ fontSize: 12, color: '#71727A', fontFamily: 'Google Sans Flex', maxWidth: 200 }}>
              Capture and upload photos for this delivery stop.
            </p>
          </div>
        ) : (
          <div className="grid gap-[10px]" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative rounded-[16px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                style={{ aspectRatio: '1 / 1', background: 'white', border: '1px solid #D8DADF' }}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Index badge */}
                <div
                  className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 700, fontFamily: 'Google Sans Flex' }}>
                    {index + 1}
                  </span>
                </div>
                {/* Delete button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removePhoto(currentRoute.id, stop.id, index);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full border-none cursor-pointer active:scale-95 transition-transform"
                  style={{ background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: 13, fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Photo button — absolute, above nav bar */}
      <div
        className="absolute left-0 right-0 px-4"
        style={{ bottom: 120 }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-[8px] border-none cursor-pointer active:scale-[0.98] transition-transform rounded-[16px]"
          style={{
            paddingTop: 15.5, paddingBottom: 15.5,
            background: '#FF7048',
            boxShadow: '0px 8px 24px rgba(255,112,72,0.40)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.5C13.25 17.5 14.3125 17.0625 15.1875 16.1875C16.0625 15.3125 16.5 14.25 16.5 13C16.5 11.75 16.0625 10.6875 15.1875 9.8125C14.3125 8.9375 13.25 8.5 12 8.5C10.75 8.5 9.6875 8.9375 8.8125 9.8125C7.9375 10.6875 7.5 11.75 7.5 13C7.5 14.25 7.9375 15.3125 8.8125 16.1875C9.6875 17.0625 10.75 17.5 12 17.5ZM12 15.5C11.3 15.5 10.7083 15.2583 10.225 14.775C9.74167 14.2917 9.5 13.7 9.5 13C9.5 12.3 9.74167 11.7083 10.225 11.225C10.7083 10.7417 11.3 10.5 12 10.5C12.7 10.5 13.2917 10.7417 13.775 11.225C14.2583 11.7083 14.5 12.3 14.5 13C14.5 13.7 14.2583 14.2917 13.775 14.775C13.2917 15.2583 12.7 15.5 12 15.5ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H7.15L8.4 3.65C8.58333 3.45 8.80417 3.29167 9.0625 3.175C9.32083 3.05833 9.59167 3 9.875 3H14.125C14.4083 3 14.6792 3.05833 14.9375 3.175C15.1958 3.29167 15.4167 3.45 15.6 3.65L16.85 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4Z" fill="white"/>
          </svg>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
            Add Photo
          </span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
