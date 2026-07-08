import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { useDriver } from './DriverContext';

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconBuildingOrientation = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.84973 14.2484C2.49983 13.0616 1.0157 10.6537 1.00012 8.04281C0.984921 5.41595 2.45034 2.99597 4.78037 1.78657C7.7268 0.257285 11.3165 1.01784 13.4026 3.54807C15.5071 6.10091 15.5355 9.786 13.4681 12.3712C11.419 14.9334 7.8285 15.7531 4.85011 14.2484H4.84973ZM4.83297 11.6344L9.10767 9.86977C9.45834 9.72483 9.72602 9.45755 9.87058 9.10649L11.6497 4.798C11.6894 4.65189 11.6555 4.52058 11.5561 4.42824C11.4751 4.35304 11.3321 4.30044 11.2043 4.35304L6.89493 6.13169C6.54464 6.27624 6.27657 6.54353 6.13163 6.89419L4.35333 11.2035C4.29683 11.3402 4.35839 11.4898 4.4445 11.5701C4.54269 11.6617 4.67712 11.6991 4.83258 11.6348L4.83297 11.6344Z" fill="#FF7048"/>
    <path d="M7.81185 7.01869C8.3782 6.91046 8.88061 7.28487 8.98259 7.81514C9.08458 8.34541 8.72805 8.87945 8.18427 8.98266C7.65636 9.08253 7.13599 8.74113 7.0223 8.21253C6.90861 7.68393 7.23839 7.12901 7.81185 7.01911V7.01869Z" fill="#FF7048"/>
  </svg>
);

const IconDeliveryInstruction = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.00033 11.9997H10.0003C10.1892 11.9997 10.3475 11.9358 10.4753 11.808C10.6031 11.6802 10.667 11.5219 10.667 11.333C10.667 11.1441 10.6031 10.9858 10.4753 10.858C10.3475 10.7302 10.1892 10.6663 10.0003 10.6663H6.00033C5.81144 10.6663 5.6531 10.7302 5.52533 10.858C5.39755 10.9858 5.33366 11.1441 5.33366 11.333C5.33366 11.5219 5.39755 11.6802 5.52533 11.808C5.6531 11.9358 5.81144 11.9997 6.00033 11.9997ZM6.00033 9.33301H10.0003C10.1892 9.33301 10.3475 9.26912 10.4753 9.14134C10.6031 9.01356 10.667 8.85523 10.667 8.66634C10.667 8.47745 10.6031 8.31912 10.4753 8.19134C10.3475 8.06356 10.1892 7.99967 10.0003 7.99967H6.00033C5.81144 7.99967 5.6531 8.06356 5.52533 8.19134C5.39755 8.31912 5.33366 8.47745 5.33366 8.66634C5.33366 8.85523 5.39755 9.01356 5.52533 9.14134C5.6531 9.26912 5.81144 9.33301 6.00033 9.33301ZM4.00033 14.6663C3.63366 14.6663 3.31977 14.5358 3.05866 14.2747C2.79755 14.0136 2.66699 13.6997 2.66699 13.333V2.66634C2.66699 2.29967 2.79755 1.98579 3.05866 1.72467C3.31977 1.46356 3.63366 1.33301 4.00033 1.33301H8.78366C8.96144 1.33301 9.13088 1.36634 9.29199 1.43301C9.4531 1.49967 9.59477 1.59412 9.71699 1.71634L12.9503 4.94967C13.0725 5.0719 13.167 5.21356 13.2337 5.37467C13.3003 5.53579 13.3337 5.70523 13.3337 5.88301V13.333C13.3337 13.6997 13.2031 14.0136 12.942 14.2747C12.6809 14.5358 12.367 14.6663 12.0003 14.6663H4.00033ZM8.66699 5.33301C8.66699 5.5219 8.73088 5.68023 8.85866 5.80801C8.98644 5.93579 9.14477 5.99967 9.33366 5.99967H12.0003L8.66699 2.66634V5.33301Z" fill="#FF7048"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuildingDetail() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const { routes } = useDriver();

  const currentRoute = routes.find(r => r.stops.some(s => s.id === stopId));
  const stop = currentRoute?.stops.find(s => s.id === stopId);

  if (!stop) {
    return (
      <div
        className="flex-1 flex items-center justify-center p-8 text-center"
        style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif" }}
      >
        <span style={{ fontSize: 16, color: '#71727A' }}>Stop Not Found</span>
      </div>
    );
  }

  const unit = stop.unitInfo;

  // Derive model name: prefer explicit modelName, otherwise parse from size
  const modelName = unit.modelName || unit.size;
  // Derive size-only prefix (strip model name if combined)
  const sizePrefix = unit.size.match(/^[\d\s.x]+/)?.[0]?.trim() || unit.size;

  // Derive display values with smart fallbacks
  const dimensions = unit.dimensions || (
    unit.size.includes('10 x 16') ? "10' W x 16' L x 7' H" :
    unit.size.includes('14 x 20') ? "14' W x 20' L x 7' H" :
    unit.size
  );
  const material = unit.material || 'LP Smart';
  const baseColor = unit.base || 'Burnished Slate';
  const trim = unit.trim || 'White';
  const roofColor = unit.roof || 'White';

  // Building photo set — use local public images
  const buildingPhotos = [
    '/Building Image 1.jpg',
    '/Building Image 2.jpg',
    '/Building Image 3.jpg',
    '/Building Image 4.jpg',
    '/Building Image 5.jpg',
  ];

  // Info rows: label + value
  const infoRows: { label: string; value: string; isLast?: boolean }[] = [
    { label: 'Dimensions', value: dimensions },
    { label: 'Serial #', value: unit.serial },
    { label: 'Material', value: material },
    { label: 'Base Color', value: baseColor },
    { label: 'Trim', value: trim },
    { label: 'Roof Color', value: roofColor, isLast: true },
  ];

  return (
    <div
      className="relative flex-1 flex flex-col overflow-y-auto select-none h-full no-scrollbar"
      style={{ background: '#E8E9F1', fontFamily: "'Google Sans Flex', sans-serif" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
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
          Building Details
        </h1>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="px-4 pb-32 flex flex-col gap-[20px] mt-[0px]">

        {/* Model Name */}
        <h2
          className="m-0"
          style={{ color: '#2F3036', fontSize: 26, fontWeight: 600, fontFamily: 'Google Sans Flex', lineHeight: 1.2 }}
        >
          {modelName}
        </h2>

        {/* ── Info Fields ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[12px]">

          {/* Building Orientation */}
          {stop.buildingOrientation && (
            <div className="flex flex-col gap-[6px] rounded-[5px]">
              <div className="flex items-center gap-[4px]">
                <div className="shrink-0"><IconBuildingOrientation /></div>
                <span style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
                  Building Orientation
                </span>
              </div>
              <p className="m-0" style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex', lineHeight: 1.5 }}>
                {stop.buildingOrientation}
              </p>
            </div>
          )}

          {/* Delivery Instruction */}
          {stop.deliveryInstruction && (
            <div className="flex flex-col gap-[6px] rounded-[5px]">
              <div className="flex items-center gap-[4px]">
                <div className="shrink-0"><IconDeliveryInstruction /></div>
                <span style={{ color: '#2F3036', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
                  Delivery Instruction
                </span>
              </div>
              <p className="m-0" style={{ color: '#71727A', fontSize: 14, fontWeight: 400, fontFamily: 'Google Sans Flex', lineHeight: 1.5 }}>
                {stop.deliveryInstruction}
              </p>
            </div>
          )}
        </div>

        {/* ── Unit Information ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-[10px]">
          <h3
            className="m-0"
            style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}
          >
            Unit Information
          </h3>

          <div
            className="w-full p-[16px] rounded-[24px] flex flex-col gap-[10px]"
            style={{ background: 'white' }}
          >
            {infoRows.map((row, idx) => (
              <div
                key={row.label}
                className="flex flex-col gap-[4px] pb-[10px]"
                style={!row.isLast ? { borderBottom: '1px solid #D4D6DD' } : undefined}
              >
                <span
                  style={{
                    color: '#71727A',
                    fontSize: 14,
                    fontWeight: idx === 0 ? 500 : 400,
                    fontFamily: idx === 0 ? 'Proxima Nova, Google Sans Flex, sans-serif' : 'Google Sans Flex',
                  }}
                >
                  {row.label}
                </span>
                <span style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Photos ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[10px]">
          <h3
            className="m-0"
            style={{ color: '#2F3036', fontSize: 16, fontWeight: 600, fontFamily: 'Google Sans Flex' }}
          >
            Photos
          </h3>

          {/* Horizontal scroll strip — no right padding/margin so it bleeds edge */}
          <div
            className="flex gap-[10px] overflow-x-auto no-scrollbar snap-x"
            style={{ marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingBottom: 8 }}
          >
            {buildingPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="shrink-0 snap-start rounded-[16px] overflow-hidden flex items-center justify-center bg-white"
                style={{
                  width: 185,
                  height: 185,
                  border: '1px solid #D8DADF',
                  padding: 10,
                  // Last item gets right margin to clear edge
                  marginRight: idx === buildingPhotos.length - 1 ? 16 : 0,
                }}
              >
                <img
                  src={photo}
                  alt={`Building view ${idx + 1}`}
                  className="w-full h-full object-contain rounded-[10px]"
                  onError={(e) => {
                    // Fallback to building silhouette if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
