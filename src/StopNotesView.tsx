import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';

function getTimeAgo(index: number, total: number): string {
  const minutesAgo = [1, 8, 25, 45, 90, 150, 240];
  const mins = minutesAgo[total - 1 - index] || (index + 1) * 30;
  if (mins < 2) return 'Just Now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

// Send icon (Figma-aligned)
const IconSend = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.47 9.01869L2.26469 12.846C2.07472 12.8095 1.92113 12.7343 1.80392 12.6203C1.68671 12.5064 1.61033 12.3729 1.57477 12.2198C1.53921 12.0668 1.55076 11.9103 1.60942 11.7505C1.66807 11.5907 1.77461 11.4525 1.92902 11.336L13.5311 3.46842C13.6782 3.36368 13.8357 3.3145 14.0035 3.32088C14.1713 3.32726 14.3201 3.37084 14.4498 3.45162C14.5794 3.5324 14.6841 3.64671 14.7639 3.79456C14.8436 3.9424 14.8688 4.10541 14.8397 4.28359L12.8923 18.1658C12.8558 18.3558 12.7787 18.5123 12.6611 18.6354C12.5435 18.7585 12.4082 18.8378 12.2552 18.8734C12.1021 18.909 11.9486 18.8992 11.7947 18.8443C11.6407 18.7893 11.5055 18.6846 11.389 18.5302L8.03858 13.743L18.47 9.01869Z" fill="white"/>
  </svg>
);

const IconSendDisabled = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.47 9.01869L2.26469 12.846C2.07472 12.8095 1.92113 12.7343 1.80392 12.6203C1.68671 12.5064 1.61033 12.3729 1.57477 12.2198C1.53921 12.0668 1.55076 11.9103 1.60942 11.7505C1.66807 11.5907 1.77461 11.4525 1.92902 11.336L13.5311 3.46842C13.6782 3.36368 13.8357 3.3145 14.0035 3.32088C14.1713 3.32726 14.3201 3.37084 14.4498 3.45162C14.5794 3.5324 14.6841 3.64671 14.7639 3.79456C14.8436 3.9424 14.8688 4.10541 14.8397 4.28359L12.8923 18.1658C12.8558 18.3558 12.7787 18.5123 12.6611 18.6354C12.5435 18.7585 12.4082 18.8378 12.2552 18.8734C12.1021 18.909 11.9486 18.8992 11.7947 18.8443C11.6407 18.7893 11.5055 18.6846 11.389 18.5302L8.03858 13.743L18.47 9.01869Z" fill="#71727A"/>
  </svg>
);

export default function StopNotesView() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes, addComment } = useDriver();

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

  const [newComment, setNewComment] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stop?.comments?.length]);

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

  const comments = stop.comments || [];

  const handleSubmit = () => {
    const text = newComment.trim();
    if (!text) return;
    addComment(currentRoute.id, stop.id, text);
    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isActive = !!newComment.trim();

  return (
    // Outer: full height, flex column, overflow hidden so nothing escapes phone frame
    <div
      className="flex-1 flex flex-col select-none"
      style={{
        background: '#E8E9F1',
        fontFamily: "'Google Sans Flex', sans-serif",
        height: '100%',
        overflow: 'hidden',
        paddingBottom: 120, // account for bottom nav bar which is absolute-positioned and overlaps this area
      }}
    >
      {/* ── Header ── */}
      <header
        className="shrink-0 flex items-center gap-[16px] px-4 pt-[66px] pb-3"
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
          Add Stop Notes
        </h1>
      </header>

      {/* ── Notes list — flex-1, scrolls within the remaining space ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="m-0" style={{ fontSize: 15, fontWeight: 600, color: '#2F3036', fontFamily: 'Google Sans Flex' }}>
              No Notes Yet
            </p>
            <p className="m-0" style={{ fontSize: 12, color: '#71727A', fontFamily: 'Google Sans Flex', maxWidth: 200 }}>
              Write a note below to document updates for this stop.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className="w-full rounded-[24px] p-4 flex justify-between items-start gap-4"
              style={{ background: 'white' }}
            >
              <div className="flex-1 flex flex-col gap-[4px]">
                <span style={{ color: '#494A50', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
                  Stop Note #{index + 1}
                </span>
                <span style={{ color: '#494A50', fontSize: 16, fontWeight: 400, fontFamily: 'Google Sans Flex', lineHeight: 1.5 }}>
                  {comment}
                </span>
              </div>
              <span
                className="shrink-0 pt-1"
                style={{ color: '#71727A', fontSize: 10, fontWeight: 400, fontFamily: 'Google Sans Flex' }}
              >
                {getTimeAgo(index, comments.length)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── Input bar — Figma: white bg, box-shadow, sits directly above bottom nav ── */}
      <div
        className="shrink-0 flex items-center gap-[5px]"
        style={{
          padding: '6px 6px 6px 6px',
          background: 'white',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.16)',
        }}
      >
        {/* Text input pill */}
        <div
          className="flex-1 flex items-center"
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 19,
            paddingBottom: 19,
            background: 'white',
            borderRadius: 34,
          }}
        >
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a note"
            className="w-full bg-transparent border-none outline-none"
            style={{
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Proxima Nova', 'Google Sans Flex', sans-serif",
              color: '#2F3036',
            }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!isActive}
          className="flex items-center justify-center border-none cursor-pointer active:scale-95 transition-all shrink-0"
          style={{
            width: 81,
            height: 55,
            borderRadius: 46,
            background: isActive ? '#FF7048' : '#D4D6DD',
            boxShadow: isActive ? '0px 8px 20px rgba(255,112,72,0.35)' : 'none',
            overflow: 'hidden',
          }}
        >
          {isActive ? <IconSend /> : <IconSendDisabled />}
        </button>
      </div>
    </div>
  );
}
