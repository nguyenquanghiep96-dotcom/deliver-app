import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface SlideToCompleteProps {
  onComplete: () => void;
  text?: string;
  completedText?: string;
  isComplete?: boolean;
  disabled?: boolean;
}

export function SlideToComplete({ 
  onComplete, 
  text = "Slide to Complete", 
  completedText = "Completed",
  isComplete = false,
  disabled = false
}: SlideToCompleteProps) {
  const [dragProgress, setDragProgress] = useState(isComplete ? 100 : 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isComplete) {
      setDragProgress(100);
    }
  }, [isComplete]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isComplete || disabled) return;
    isDragging.current = true;
    thumbRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isComplete || disabled || !containerRef.current || !thumbRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    
    const pointerX = e.clientX - containerRect.left;
    const maxDrag = containerRect.width - thumbRect.width - 8; // 4px padding on both sides
    const offsetPointerX = pointerX - thumbRect.width / 2;
    
    const boundedX = Math.max(0, Math.min(offsetPointerX, maxDrag));
    const progress = (boundedX / maxDrag) * 100;
    
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || isComplete || disabled) return;
    isDragging.current = false;
    thumbRef.current?.releasePointerCapture(e.pointerId);

    if (dragProgress > 90) {
      setDragProgress(100);
      onComplete();
    } else {
      setDragProgress(0);
    }
  };

  const transitionClass = !isDragging.current && !isComplete ? 'transition-all duration-300 ease-out' : '';

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[56px] rounded-[28px] overflow-hidden select-none transition-colors duration-300
        ${isComplete ? 'bg-[#2FA301]' : disabled ? 'bg-[#E8E9F1]' : 'bg-[#FF7048]'} 
        ${!disabled ? 'shadow-[0_4px_15px_rgba(0,0,0,0.1)]' : ''}`}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className={`text-[16px] font-semibold font-['Google_Sans_Flex'] transition-opacity duration-300 
          ${isComplete ? 'text-white' : disabled ? 'text-[#71727A]' : 'text-white/90'}`}>
          {isComplete ? completedText : text}
        </span>
      </div>
      
      {!isComplete && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      )}

      <div 
        className={`absolute top-0 left-0 h-full bg-black/10 ${transitionClass}`}
        style={{ width: `${dragProgress}%` }}
      />

      <div 
        ref={thumbRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`absolute top-[4px] bottom-[4px] aspect-square rounded-full flex items-center justify-center bg-white shadow-sm z-10 ${transitionClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
        style={{ 
          left: `calc(4px + ${dragProgress}% * (1 - (48 / 100)) - ${dragProgress > 0 ? (dragProgress / 100) * 8 : 0}px)`
        }}
      >
        {isComplete ? (
          <Check size={20} color="#2FA301" />
        ) : (
          <ChevronRight size={24} color={disabled ? "#71727A" : "#FF7048"} />
        )}
      </div>
    </div>
  );
}
