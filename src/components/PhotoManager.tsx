import { useState, useRef } from 'react';
import { Camera, ImagePlus, X, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface PhotoManagerProps {
  photos: string[];
  onAddPhoto: (photoDataUrl: string) => void;
  onRemovePhoto: (photoIndex: number) => void;
  maxPhotos?: number;
}

export default function PhotoManager({ photos, onAddPhoto, onRemovePhoto, maxPhotos = 10 }: PhotoManagerProps) {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const remaining = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, remaining);
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onAddPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    e.target.value = '';
    setShowActionSheet(false);
  };

  const handleDeletePhoto = () => {
    if (viewerIndex !== null) {
      onRemovePhoto(viewerIndex);
      // Adjust viewer index after deletion
      if (photos.length <= 1) {
        setViewerIndex(null); // Close viewer if last photo
      } else if (viewerIndex >= photos.length - 1) {
        setViewerIndex(photos.length - 2); // Go to previous if deleting last
      }
      setShowDeleteConfirm(false);
    }
  };

  const navigateViewer = (direction: 'prev' | 'next') => {
    if (viewerIndex === null) return;
    if (direction === 'prev' && viewerIndex > 0) {
      setViewerIndex(viewerIndex - 1);
    } else if (direction === 'next' && viewerIndex < photos.length - 1) {
      setViewerIndex(viewerIndex + 1);
    }
  };

  const hasPhotos = photos.length > 0;
  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="w-full font-['Google_Sans_Flex']">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-[#71727A]" />
          <span className="text-[15px] font-semibold text-[#2F3036]">Photos</span>
          <span className="bg-[#E8E9F1] text-[#71727A] text-[11px] font-bold px-[6px] py-[1px] rounded-full min-w-[20px] text-center">
            {photos.length}
          </span>
        </div>
        {hasPhotos && canAddMore && (
          <button
            onClick={() => setShowActionSheet(true)}
            className="text-[#FF7048] text-[13px] font-semibold bg-transparent border-none cursor-pointer active:opacity-70"
          >
            + Add More
          </button>
        )}
      </div>

      {/* ── State 1: Empty State ──────────────────── */}
      {!hasPhotos && (
        <button
          onClick={() => setShowActionSheet(true)}
          className="w-full py-8 border-2 border-dashed border-[#D4D6DD] rounded-[16px] bg-[#FAFAFA] hover:bg-[#F5F5F5] active:bg-[#EFEFEF] transition-colors cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="w-[48px] h-[48px] bg-[#E8E9F1] rounded-full flex items-center justify-center">
            <Camera size={22} className="text-[#71727A]" />
          </div>
          <span className="text-[14px] font-semibold text-[#2F3036]">Add Photos</span>
          <span className="text-[12px] text-[#71727A]">Take or upload photos of this stop</span>
        </button>
      )}

      {/* ── State 2: Gallery Grid ─────────────────── */}
      {hasPhotos && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setViewerIndex(idx)}
              className="relative aspect-square rounded-[12px] overflow-hidden border-2 border-transparent hover:border-[#FF7048] transition-colors cursor-pointer bg-transparent p-0 group"
            >
              <img
                src={photo}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Index Badge */}
              <div className="absolute top-[5px] left-[5px] bg-black/60 text-white text-[10px] font-bold w-[20px] h-[20px] rounded-full flex items-center justify-center">
                {idx + 1}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}

          {/* Add More Tile */}
          {canAddMore && (
            <button
              onClick={() => setShowActionSheet(true)}
              className="aspect-square rounded-[12px] border-2 border-dashed border-[#D4D6DD] bg-[#FAFAFA] hover:bg-[#F0F0F0] active:bg-[#E8E8E8] transition-colors cursor-pointer flex flex-col items-center justify-center gap-1"
            >
              <Plus size={22} className="text-[#71727A]" />
              <span className="text-[10px] text-[#71727A] font-medium">Add</span>
            </button>
          )}
        </div>
      )}

      {/* ── Action Sheet (iOS-style bottom sheet) ─── */}
      {showActionSheet && (
        <div 
          className="absolute inset-0 z-[50] flex items-end justify-center"
          onClick={() => setShowActionSheet(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease-out]" />
          
          {/* Sheet */}
          <div 
            className="relative w-full max-w-[393px] px-3 pb-3 animate-[slideUp_250ms_ease-out]"
            onClick={e => e.stopPropagation()}
          >
            {/* Options Group */}
            <div className="bg-white rounded-[14px] overflow-hidden shadow-2xl mb-2">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full px-4 py-[12px] flex items-center gap-2.5 bg-transparent border-none cursor-pointer active:bg-[#F5F5F5] transition-colors"
              >
                <div className="w-[32px] h-[32px] bg-[#FF7048]/10 rounded-full flex items-center justify-center shrink-0">
                  <Camera size={16} className="text-[#FF7048]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[14px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">Take Photo</span>
                  <span className="text-[11px] text-[#71727A] font-['Google_Sans_Flex']">Open camera to capture</span>
                </div>
              </button>

              <div className="h-px bg-[#E8E9F1] mx-4" />

              <button
                onClick={() => libraryInputRef.current?.click()}
                className="w-full px-4 py-[12px] flex items-center gap-2.5 bg-transparent border-none cursor-pointer active:bg-[#F5F5F5] transition-colors"
              >
                <div className="w-[32px] h-[32px] bg-[#3B82F6]/10 rounded-full flex items-center justify-center shrink-0">
                  <ImagePlus size={16} className="text-[#3B82F6]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[14px] font-semibold text-[#2F3036] font-['Google_Sans_Flex']">Choose from Library</span>
                  <span className="text-[11px] text-[#71727A] font-['Google_Sans_Flex']">Select existing photos</span>
                </div>
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setShowActionSheet(false)}
              className="w-full py-[12px] bg-white rounded-[14px] text-[15px] font-semibold text-[#FF7048] border-none cursor-pointer active:bg-[#F5F5F5] shadow-2xl font-['Google_Sans_Flex']"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── State 3: Full Screen Photo Viewer ────── */}
      {viewerIndex !== null && photos[viewerIndex] && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col select-none animate-[fadeIn_150ms_ease-out]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Viewer Header */}
          <div className="flex items-center justify-between px-3 pt-[54px] pb-2 shrink-0">
            <button
              onClick={() => { setViewerIndex(null); setShowDeleteConfirm(false); }}
              className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center border-none cursor-pointer active:bg-white/20 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
            <span className="text-[13px] font-semibold text-white/80 font-['Google_Sans_Flex']">
              {viewerIndex + 1} / {photos.length}
            </span>
            <div className="w-[36px]" />
          </div>

          {/* Image Area */}
          <div className="flex-1 flex items-center justify-center relative px-2 min-h-0">
            {viewerIndex > 0 && (
              <button
                onClick={() => navigateViewer('prev')}
                className="absolute left-1 z-10 w-[36px] h-[36px] bg-white/15 active:bg-white/25 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}

            <img
              src={photos[viewerIndex]}
              alt={`Photo ${viewerIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-[8px]"
            />

            {viewerIndex < photos.length - 1 && (
              <button
                onClick={() => navigateViewer('next')}
                className="absolute right-1 z-10 w-[36px] h-[36px] bg-white/15 active:bg-white/25 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            )}
          </div>

          {/* Dot Indicators */}
          {photos.length > 1 && (
            <div className="flex items-center justify-center gap-[5px] py-2 shrink-0">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setViewerIndex(idx)}
                  className={`rounded-full border-none cursor-pointer transition-all duration-200 p-0 ${
                    idx === viewerIndex 
                      ? 'w-[7px] h-[7px] bg-white' 
                      : 'w-[5px] h-[5px] bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Delete Button */}
          <div className="px-3 pb-6 shrink-0">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-[12px] bg-[#FF3B30]/15 text-[#FF3B30] rounded-[14px] border-none cursor-pointer flex items-center justify-center gap-2 transition-colors font-['Google_Sans_Flex'] text-[13px] font-semibold active:scale-[0.98]"
              >
                <Trash2 size={14} />
                Delete This Photo
              </button>
            ) : (
              <div className="bg-[#1C1C1E] rounded-[14px] p-3 animate-[fadeIn_150ms_ease-out]">
                <p className="text-white text-[13px] font-semibold text-center mb-0.5 font-['Google_Sans_Flex']">Delete this photo?</p>
                <p className="text-white/50 text-[11px] text-center mb-3 font-['Google_Sans_Flex']">This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-[10px] bg-white/10 text-white rounded-[10px] border-none cursor-pointer text-[13px] font-semibold font-['Google_Sans_Flex'] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePhoto}
                    className="flex-1 py-[10px] bg-[#FF3B30] text-white rounded-[10px] border-none cursor-pointer text-[13px] font-semibold font-['Google_Sans_Flex'] transition-colors active:scale-[0.98]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
