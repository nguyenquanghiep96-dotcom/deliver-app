import { useState } from 'react';
import { ChevronLeft, Compass, FileText, ImageIcon } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useDriver } from './DriverContext';
import { ACTION_COLORS, TYPE_COLORS } from './lib/workOrderStyles';

export default function BuildingDetail() {
  const { routeId, stopId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { routes } = useDriver();
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const route = routes.find(item => item.id === routeId);
  const stop = route?.stops.find(item => item.id === stopId);
  const workOrder = stop?.workOrders.find(item => item.id === searchParams.get('woId'));

  if (!stop || !workOrder) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center bg-[#E8E9F1]">
        <span className="text-[16px] text-[#71727A]">Model not found</span>
      </div>
    );
  }

  const unit = workOrder.unitInfo;
  const photos = unit.images || [];
  const orientation = unit.orientation || stop.buildingOrientation;
  const specs = [
    { label: 'Size', value: unit.size },
    { label: 'Serial #', value: unit.serial },
    { label: 'Material', value: unit.material },
    { label: 'Base color', value: unit.base },
    { label: 'Trim', value: unit.trim },
    { label: 'Roof', value: unit.roof },
  ].filter(item => item.value);

  return (
    <div className="relative flex-1 flex flex-col overflow-y-auto h-full no-scrollbar bg-[#E8E9F1] font-['Google_Sans_Flex']">
      <header className="flex items-center gap-3 px-4 pt-4 md:pt-[66px] pb-4 sticky top-0 z-50 bg-white/95 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="size-[38px] bg-[#F4F5F8] rounded-full flex items-center justify-center shrink-0 border-none cursor-pointer active:scale-95 transition-transform text-[#2B3B63]"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="flex-1 min-w-0 m-0 text-[17px] font-semibold text-[#2B3B63] truncate">Model Details</h1>
      </header>

      <main className="px-4 pb-32 flex flex-col gap-5">
        <section>
          <div className="relative h-[250px] rounded-[22px] overflow-hidden bg-white border border-[#D8DADF]">
            {photos.length ? (
              <>
                <img src={photos[selectedPhoto]} alt={`${unit.modelName || 'Model'} view ${selectedPhoto + 1}`} className="w-full h-full object-cover" />
                <span className="absolute right-3 bottom-3 px-2.5 py-1 rounded-full bg-[#2B3B63E6] text-white text-[12px] font-bold">
                  {selectedPhoto + 1} / {photos.length}
                </span>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#8A909D]">
                <ImageIcon size={34} />
                <span className="text-[14px] font-semibold">No model photos</span>
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className="flex gap-2 mt-[10px] overflow-x-auto no-scrollbar">
              {photos.map((photo, index) => (
                <button
                  key={photo}
                  onClick={() => setSelectedPhoto(index)}
                  aria-label={`Show model photo ${index + 1}`}
                  className={`size-[58px] shrink-0 rounded-[12px] overflow-hidden bg-white p-0 cursor-pointer ${selectedPhoto === index ? 'border-2 border-[#FF7048]' : 'border border-[#D8DADF]'}`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] pl-1.5 pr-2 py-[2px] rounded-full">
              <span className="size-[6px] rounded-full shrink-0" style={{ backgroundColor: ACTION_COLORS[workOrder.action] || '#6B7280' }} />
              <span className="text-[#2B3B63] text-[11px] font-bold uppercase tracking-wider">{workOrder.action}</span>
            </div>
            <span className="text-white text-[11px] font-bold px-2 py-[2px] rounded-[6px]" style={{ backgroundColor: TYPE_COLORS[workOrder.type] || '#2B3B63' }}>{workOrder.type}</span>
          </div>
          <h2 className="m-0 text-[24px] leading-[29px] font-bold text-[#2B3B63]">{unit.modelName || 'Building model'}</h2>
          {unit.dimensions && <p className="m-0 mt-1 text-[15px] font-semibold text-[#71727A]">{unit.dimensions}</p>}
        </section>

        {orientation && (
          <section className="p-4 rounded-[18px] bg-[#FFF3EE] border border-[#FFD8CA]">
            <div className="flex items-center gap-2 mb-2 text-[#D9502B]">
              <Compass size={20} />
              <h3 className="m-0 text-[15px] font-bold">Orientation</h3>
            </div>
            <p className="m-0 text-[15px] leading-[21px] font-semibold text-[#2B3B63]">{orientation}</p>
          </section>
        )}

        {unit.description && (
          <section>
            <div className="flex items-center gap-2 mb-2 text-[#2B3B63]">
              <FileText size={19} />
              <h3 className="m-0 text-[18px] font-bold">Description</h3>
            </div>
            <p className="m-0 text-[15px] leading-[22px] text-[#5E6578]">{unit.description}</p>
          </section>
        )}

        <section>
          <h3 className="m-0 mb-2 text-[18px] font-bold text-[#2B3B63]">Model specifications</h3>
          <div className="overflow-hidden rounded-[18px] bg-white border border-[#DFE2E7] px-4">
            {specs.map(({ label, value }, index) => (
              <div key={label} className={`min-h-[52px] flex items-center justify-between gap-4 ${index < specs.length - 1 ? 'border-b border-[#E8E9F1]' : ''}`}>
                <span className="text-[14px] text-[#71727A] shrink-0">{label}</span>
                <span className="text-[15px] leading-5 font-semibold text-[#2B3B63] text-right break-words">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {stop.deliveryInstruction && (
          <section className="p-4 rounded-[18px] bg-white border border-[#DFE2E7]">
            <h3 className="m-0 mb-1 text-[15px] font-bold text-[#2B3B63]">Handling instruction</h3>
            <p className="m-0 text-[14px] leading-5 text-[#5E6578]">{stop.deliveryInstruction}</p>
          </section>
        )}
      </main>
    </div>
  );
}
