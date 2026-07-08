import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, MessageSquare, Clock, Tag } from 'lucide-react';

interface CommentScreenProps {
  comments: string[];
  stopId: string;
  stopType: string;
  onAddComment: (comment: string) => void;
  onClose: () => void;
}

const QUICK_TAGS = [
  { label: 'Customer not home', icon: '🏠' },
  { label: 'Gate locked', icon: '🔒' },
  { label: 'Ground uneven', icon: '⛰️' },
  { label: 'Access blocked', icon: '🚧' },
  { label: 'Weather delay', icon: '🌧️' },
  { label: 'Unit damage noted', icon: '⚠️' },
];

function getTimeAgo(index: number, total: number): string {
  const minutesAgo = [1, 8, 25, 45, 90, 150, 240];
  const mins = minutesAgo[total - 1 - index] || (index + 1) * 30;
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function CommentScreen({ comments, stopId, stopType, onAddComment, onClose }: CommentScreenProps) {
  const [newComment, setNewComment] = useState('');
  const [showQuickTags, setShowQuickTags] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments.length]);

  const handleSubmit = () => {
    const text = newComment.trim();
    if (!text) return;
    onAddComment(text);
    setNewComment('');
    setShowQuickTags(false);
  };

  const handleQuickTag = (tagText: string) => {
    onAddComment(tagText);
    setShowQuickTags(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#F2F4F7] flex flex-col font-['Google_Sans_Flex']" style={{ animation: 'commentSlideIn 200ms ease-out' }}>
      
      {/* ── Header ── */}
      <div className="bg-white pt-[54px] pb-2.5 px-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onClose}
            className="w-[36px] h-[36px] bg-[#E8E9F1] rounded-full flex items-center justify-center border-none cursor-pointer active:bg-[#D4D6DD] transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-[#2F3036]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[16px] font-bold text-[#2F3036] leading-tight">Comments & Notes</h1>
            <p className="text-[11px] text-[#71727A] mt-px">{stopId} · {stopType}</p>
          </div>
          {comments.length > 0 && (
            <div className="bg-[#FF7048]/10 text-[#FF7048] text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
              {comments.length}
            </div>
          )}
        </div>
      </div>

      {/* ── Comments List ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar min-h-0">
        
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <MessageSquare size={24} className="text-[#D4D6DD]" />
            </div>
            <h3 className="text-[14px] font-bold text-[#2F3036] mb-1">No Comments Yet</h3>
            <p className="text-[12px] text-[#71727A] max-w-[200px] leading-relaxed">
              Add notes about this stop — delivery issues, customer requests, or site conditions.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((comment, idx) => {
              const isSystemComment = comment.startsWith('[SKIP]') || comment.startsWith('[ISSUE]');
              const isQuickTag = QUICK_TAGS.some(t => t.label === comment);
              
              return (
                <div 
                  key={idx} 
                  className={`rounded-[14px] p-3 ${
                    isSystemComment 
                      ? 'bg-[#FFF3E0] border border-[#FFE0B2]' 
                      : 'bg-white border border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                  }`}
                  style={{ animation: 'commentFadeIn 200ms ease-out' }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      isSystemComment 
                        ? 'bg-[#FF9800]/15 text-[#E65100]' 
                        : isQuickTag 
                          ? 'bg-[#FF7048]/10 text-[#FF7048]' 
                          : 'bg-[#E8E9F1] text-[#71727A]'
                    }`}>
                      {isSystemComment ? '⚠️' : isQuickTag ? '🏷️' : 'DN'}
                    </div>
                    <span className="text-[11px] font-semibold text-[#2F3036] flex-1">
                      {isSystemComment ? 'System' : 'Driver Note'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[#A1A2A9] shrink-0">
                      <Clock size={9} />
                      <span>{getTimeAgo(idx, comments.length)}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <p className={`text-[13px] leading-snug ml-[32px] ${
                    isSystemComment ? 'text-[#E65100] font-medium' : 'text-[#2F3036]'
                  }`}>
                    {comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Quick Tags ── */}
      {showQuickTags && (
        <div className="bg-white border-t border-[#E8E9F1] px-3 py-2.5 shrink-0" style={{ animation: 'commentSlideUp 200ms ease-out' }}>
          <div className="flex items-center gap-1 mb-2">
            <Tag size={10} className="text-[#71727A]" />
            <span className="text-[10px] font-semibold text-[#71727A] uppercase tracking-wider">Quick Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickTag(tag.label)}
                className="flex items-center gap-1 bg-[#F2F4F7] hover:bg-[#E8E9F1] active:bg-[#D4D6DD] px-2.5 py-[6px] rounded-full border-none cursor-pointer transition-colors"
              >
                <span className="text-[12px]">{tag.icon}</span>
                <span className="text-[11px] font-medium text-[#2F3036] font-['Google_Sans_Flex'] whitespace-nowrap">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="bg-white border-t border-[#E8E9F1] px-3 pt-2 pb-[100px] shrink-0">
        <div className="flex items-end gap-2">
          {/* Quick Tag Toggle */}
          <button
            onClick={() => setShowQuickTags(!showQuickTags)}
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all shrink-0 ${
              showQuickTags 
                ? 'bg-[#FF7048] text-white' 
                : 'bg-[#F2F4F7] text-[#71727A] active:bg-[#E8E9F1]'
            }`}
          >
            <Tag size={16} />
          </button>

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a note..."
              rows={1}
              className="w-full bg-[#F2F4F7] border border-[#E8E9F1] rounded-[18px] py-[8px] px-3 text-[13px] text-[#2F3036] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7048]/30 focus:border-[#FF7048]/50 font-['Google_Sans_Flex'] placeholder:text-[#A1A2A9] max-h-[80px] overflow-y-auto"
              style={{ minHeight: '36px' }}
              onInput={(e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = '36px';
                el.style.height = Math.min(el.scrollHeight, 80) + 'px';
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all shrink-0 ${
              newComment.trim()
                ? 'bg-[#FF7048] text-white shadow-sm active:scale-95'
                : 'bg-[#E8E9F1] text-[#A1A2A9] cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes commentSlideIn {
          from { transform: translateX(30%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes commentFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes commentSlideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
