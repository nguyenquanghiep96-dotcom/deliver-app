const fs = require('fs');
let content = fs.readFileSync('src/StopDetailsExport/processed.tsx', 'utf8');

// Add imports
const imports = `import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from '../DriverContext';
import { cleanStopType } from '../lib/utils';
`;

content = content.replace(/import imgBuildingImage1 from \".*?\";/g, '');
content = content.replace(/import imgBuildingImage2 from \".*?\";/g, '');
content = content.replace(/import imgBuildingImage3 from \".*?\";/g, '');
content = content.replace(/import imgBuildingImage4 from \".*?\";/g, '');

content = content.replace(/imgBuildingImage1/g, 'stop?.photos?.[0] || ""');
content = content.replace(/imgBuildingImage2/g, 'stop?.photos?.[1] || ""');
content = content.replace(/imgBuildingImage3/g, 'stop?.photos?.[2] || ""');
content = content.replace(/imgBuildingImage4/g, 'stop?.photos?.[3] || ""');


// Find the StopDetails function and replace it
content = content.replace(/export default function StopDetails\(\) \{[\s\S]*$/, `
export default function StopDetail() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes, updateStopStatus, addPhoto, saveSignature, addComment } = useDriver();

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

  const [sigModalType, setSigModalType] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef(null);

  if (!currentRoute || !stop) {
    return <div className="p-8 text-center">Stop Not Found</div>;
  }

  // Hook handlers to window for nested components to trigger
  window.submitStopDone = () => {
    updateStopStatus(currentRoute.id, stop.id, 'Done');
    navigate(\`/route/\${currentRoute.id}\`);
  };
  window.triggerPhotoAdd = () => fileInputRef.current?.click();
  window.triggerSignature = () => setSigModalType('customer');
  window.triggerComment = () => setShowCommentModal(true);

  const handlePhotoChange = (e) => {
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

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1C2340';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveSignature(currentRoute.id, stop.id, canvas.toDataURL());
    setSigModalType(null);
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    addComment(currentRoute.id, stop.id, newComment);
    setNewComment('');
    setShowCommentModal(false);
  };

  return (
    <div className="bg-[#f8f9fe] relative flex flex-col min-h-full font-sans overflow-x-hidden overflow-y-auto no-scrollbar" data-name="Stop Details">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0"><div className="w-[1507px] h-[393px] absolute -top-20 left-1/2 -translate-x-1/2"><ModernGradient /></div></div>
      <AddressInfo stop={stop} />
      <Header stop={stop} currentRoute={currentRoute} navigate={navigate} />
      <MainContainer stop={stop} />
      <ButtonFilled3 stop={stop} />

      {/* Hidden file input */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />

      {/* SIGNATURE MODAL */}
      {sigModalType !== null && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-5 shadow-2xl flex flex-col font-['Google_Sans_Flex']">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-[#2f3036] uppercase">Draw Signature</h3>
              <button onClick={() => setSigModalType(null)} className="text-gray-400 hover:text-gray-600 font-extrabold text-sm border-none bg-transparent">✕</button>
            </div>
            <div className="bg-[#F8F9FA] border-2 border-dashed border-[#C7C7CC] rounded-2xl h-44 mt-4 relative overflow-hidden touch-none">
              <canvas
                ref={canvasRef} width={320} height={176}
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair"
              />
            </div>
            <div className="flex gap-2.5 mt-5">
              <button onClick={clearCanvas} className="flex-1 py-3.5 bg-gray-100 rounded-xl text-xs font-bold border-none">Clear</button>
              <button onClick={saveSig} className="flex-1 py-3.5 bg-[#FF7048] text-white rounded-xl text-xs font-bold border-none">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS MODAL */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-5 shadow-2xl font-['Google_Sans_Flex']">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-[#2f3036] uppercase">Add Stop Comment</h3>
              <button onClick={() => setShowCommentModal(false)} className="text-gray-400 hover:text-gray-600 font-extrabold text-sm border-none bg-transparent">✕</button>
            </div>
            <textarea
              value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type delivery log notes or issue comments..."
              className="w-full border border-gray-200 rounded-xl p-3 text-xs mt-4 h-24 focus:outline-none focus:ring-1 focus:ring-[#FF7048]"
            />
            <div className="flex gap-2.5 mt-4">
              <button onClick={() => setShowCommentModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl text-xs font-bold border-none">Cancel</button>
              <button onClick={submitComment} className="flex-1 py-3 bg-[#FF7048] text-white rounded-xl text-xs font-bold border-none">Add log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`);

content = imports + '\n' + content;
fs.writeFileSync('src/StopDetail.tsx', content);
console.log('Merged successfully');
