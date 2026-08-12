import { ChevronRight, Check, Phone } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDriver } from '../DriverContext';
import type { WorkOrder } from '../mockData';
import { cn } from '../lib/utils';

const IconCamera = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.5C13.25 17.5 14.3125 17.0625 15.1875 16.1875C16.0625 15.3125 16.5 14.25 16.5 13C16.5 11.75 16.0625 10.6875 15.1875 9.8125C14.3125 8.9375 13.25 8.5 12 8.5C10.75 8.5 9.6875 8.9375 8.8125 9.8125C7.9375 10.6875 7.5 11.75 7.5 13C7.5 14.25 7.9375 15.3125 8.8125 16.1875C9.6875 17.0625 10.75 17.5 12 17.5ZM12 15.5C11.3 15.5 10.7083 15.2583 10.225 14.775C9.74167 14.2917 9.5 13.7 9.5 13C9.5 12.3 9.74167 11.7083 10.225 11.225C10.7083 10.7417 11.3 10.5 12 10.5C12.7 10.5 13.2917 10.7417 13.775 11.225C14.2583 11.7083 14.5 12.3 14.5 13C14.5 13.7 14.2583 14.2917 13.775 14.775C13.2917 15.2583 12.7 15.5 12 15.5ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H7.15L8.4 3.65C8.58333 3.45 8.80417 3.29167 9.0625 3.175C9.32083 3.05833 9.59167 3 9.875 3H14.125C14.4083 3 14.6792 3.05833 14.9375 3.175C15.1958 3.29167 15.4167 3.45 15.6 3.65L16.85 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4Z" fill="#FF7048"/></svg>;
const IconSignature = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 15.275C3 15.7583 3.16667 16.1333 3.5 16.4C3.83333 16.6667 4.38333 16.8417 5.15 16.925C5.41667 16.9583 5.62917 17.0792 5.7875 17.2875C5.94583 17.4958 6.01667 17.7333 6 18C5.98333 18.2833 5.88333 18.5167 5.7 18.7C5.51667 18.8833 5.29167 18.9583 5.025 18.925C3.675 18.7583 2.66667 18.3708 2 17.7625C1.33333 17.1542 1 16.325 1 15.275C1 14.1917 1.44583 13.3125 2.3375 12.6375C3.22917 11.9625 4.46667 11.5583 6.05 11.425C6.7 11.375 7.1875 11.2708 7.5125 11.1125C7.8375 10.9542 8 10.7333 8 10.45C8 10.0833 7.825 9.79583 7.475 9.5875C7.125 9.37917 6.55 9.21667 5.75 9.1C5.48333 9.06667 5.27083 8.94167 5.1125 8.725C4.95417 8.50833 4.89167 8.26667 4.925 8C4.95833 7.71667 5.075 7.4875 5.275 7.3125C5.475 7.1375 5.70833 7.06667 5.975 7.1C7.35833 7.3 8.375 7.67083 9.025 8.2125C9.675 8.75417 10 9.5 10 10.45C10 11.3333 9.67917 12.025 9.0375 12.525C8.39583 13.025 7.45 13.325 6.2 13.425C5.13333 13.5083 4.33333 13.7042 3.8 14.0125C3.26667 14.3208 3 14.7417 3 15.275ZM13.875 18.25L9.75 14.125L18.375 5.5C18.7083 5.16667 19.1042 5 19.5625 5C20.0208 5 20.4167 5.16667 20.75 5.5L22.5 7.25C22.8333 7.58333 23 7.97917 23 8.4375C23 8.89583 22.8333 9.29167 22.5 9.625L13.875 18.25ZM8.975 20C8.69167 20.0667 8.44167 19.9917 8.225 19.775C8.00833 19.5583 7.93333 19.3083 8 19.025L8.775 15.25L12.725 19.2L8.975 20Z" fill="#FF7048"/></svg>;
const IconStopNotes = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18H15C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17C16 16.7167 15.9042 16.4792 15.7125 16.2875C15.5208 16.0958 15.2833 16 15 16H9C8.71667 16 8.47917 16.0958 8.2875 16.2875C8.09583 16.4792 8 16.7167 8 17C8 17.2833 8.09583 17.5208 8.2875 17.7125C8.47917 17.9042 8.71667 18 9 18ZM9 14H15C15.2833 14 15.5208 13.9042 15.7125 13.7125C15.9042 13.5208 16 13.2833 16 13C16 12.7167 15.9042 12.4792 15.7125 12.2875C15.5208 12.0958 15.2833 12 15 12H9C8.71667 12 8.47917 12.0958 8.2875 12.2875C8.09583 12.4792 8 12.7167 8 13C8 13.2833 8.09583 13.5208 8.2875 13.7125C8.47917 13.9042 8.71667 14 9 14ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H13.175C13.4417 2 13.6958 2.05 13.9375 2.15C14.1792 2.25 14.3917 2.39167 14.575 2.575L19.425 7.425C19.6083 7.60833 19.75 7.82083 19.85 8.0625C19.95 8.30417 20 8.55833 20 8.825V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM13 8C13 8.28333 13.0958 8.52083 13.2875 8.7125C13.4792 8.90417 13.7167 9 14 9H18L13 4V8Z" fill="#FF7048"/></svg>;

interface Props {
  workOrder: WorkOrder;
  routeId: string;
  stopId: string;
  onComplete: (woId: string) => void;
  stopStatus: string;
}

export function WorkOrderCard({ workOrder, routeId, stopId, onComplete, stopStatus }: Props) {
  const navigate = useNavigate();
  const { routes } = useDriver();
  const currentRoute = routes.find(r => r.id === routeId);
  const stop = currentRoute?.stops.find(s => s.id === stopId);
  const owner = currentRoute?.ownerEntity || currentRoute?.dealerName || 'Appalachian Storage';

  const isDone = workOrder.status === 'Completed' || workOrder.status === 'Failed';
  const isStopPending = stopStatus === 'Pending';
  
  return (
    <div className="bg-white rounded-[24px] overflow-hidden flex flex-col mb-[16px] shadow-[0px_8px_40px_rgba(0,0,0,0.06)] active:scale-[0.99] transition-transform font-['Google_Sans_Flex'] border border-[#E8E9F1]">
      {/* WO Header */}
      <div className="p-[16px] border-b border-[#E8E9F1]">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-[14px]">
            <div className="flex items-center gap-1.5 bg-[#F8F9FA] border border-[#E5E7EB] pl-1.5 pr-2 py-[2px] rounded-full">
              <div className={cn(
                "size-[6px] rounded-full shrink-0",
                workOrder.action === 'Pickup' ? "bg-[#2563EB]" :
                workOrder.action === 'Dropoff' ? "bg-[#FF7048]" :
                "bg-[#2B3B63]"
              )} />
              <span className="uppercase tracking-wider font-bold text-[10px] text-[#2B3B63]">
                {workOrder.action}
              </span>
            </div>
            <span 
              className="text-white text-[11px] font-bold px-2 py-[2px] rounded-[6px] shrink-0"
              style={{ backgroundColor: workOrder.type === 'Delivery' ? '#2B3B63' : '#2B3B63' }}
            >
              {workOrder.type}
            </span>
          </div>
          <div className={`px-2 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider ${isDone ? 'bg-[#2FA3011A] text-[#2FA301]' : 'bg-[#F09A1133] text-[#F09A11]'}`}>
            {workOrder.status}
          </div>
        </div>
        
        {/* Customer & Owner Info */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center text-[13px] text-[#71727A]">
            <span className="w-[70px] shrink-0 font-medium">Owner:</span>
            <span className="font-semibold text-[#2B3B63] truncate">{owner}</span>
          </div>
          <div className="flex items-center text-[13px] text-[#71727A]">
            <span className="w-[70px] shrink-0 font-medium">Customer:</span>
            <span className="font-semibold text-[#2B3B63] truncate">{workOrder.customerName}</span>
          </div>
          {workOrder.customerPhone !== 'N/A' && (
            <div className="flex items-center text-[13px] text-[#71727A]">
              <span className="w-[70px] shrink-0 font-medium">Phone:</span>
              <a href={`tel:${workOrder.customerPhone}`} className="flex items-center gap-1 font-semibold text-[#FF7048] decoration-none">
                <Phone size={14} />
                {workOrder.customerPhone}
              </a>
            </div>
          )}
        </div>
        
        {/* Detailed Nested Card */}
        {workOrder.unitInfo && (
          <div 
            className="flex items-start gap-[12px] p-[12px] bg-[#F4F5F8] rounded-[16px] cursor-pointer active:scale-[0.98] transition-transform border border-transparent relative group"
            onClick={() => navigate(`/route/${routeId}/stop/${stopId}/building?woId=${workOrder.id}`)}
          >
            <div className="w-[50px] h-[50px] bg-[#E8E9F1] rounded-[10px] shrink-0 mt-0.5 flex items-center justify-center">
              <span className="text-[10px] text-[#71727A] font-medium text-center leading-tight">No<br/>Image</span>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <span className="text-[#2B3B63] text-[14px] font-medium">
                {workOrder.unitInfo.size} {workOrder.unitInfo.modelName || 'Building'}
              </span>
              <span className="text-[#FF7048] text-[12px] font-semibold uppercase tracking-wider">
                {workOrder.unitInfo.serial ? `SN: ${workOrder.unitInfo.serial}` : 'No Serial'}
              </span>
              {stop?.buildingOrientation && (
                <span className="text-[#71727A] text-[12px] font-medium leading-tight mt-1 line-clamp-1">
                  Orient: {stop.buildingOrientation}
                </span>
              )}
              {workOrder.notes && (
                <span className="text-[#71727A] text-[12px] font-medium leading-tight line-clamp-2 mt-0.5">
                  Note: {workOrder.notes}
                </span>
              )}
            </div>
            <ChevronRight size={18} className="text-[#FF7048] absolute right-3 top-1/2 -translate-y-1/2 opacity-70 group-hover:opacity-100" />
          </div>
        )}
      </div>

      {/* Action Rows */}
      <div className="flex flex-col px-[16px] pb-[16px]">
        {/* Add Photo */}
        <div
          onClick={() => navigate(`/route/${routeId}/stop/${stopId}/photos?woId=${workOrder.id}`)}
          className="flex items-center justify-between py-[12px] cursor-pointer"
          style={{ borderBottom: '1px solid #E8E9F1' }}
        >
          <div className="flex items-center gap-[10px]">
            <IconCamera />
            <span style={{ color: '#2B3B63', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Photos</span>
          </div>
          <div className="flex items-center gap-[8px]">
            {workOrder.photos && workOrder.photos.length > 0 && (
              <span className="text-white px-2 py-0.5 rounded-full" style={{ background: '#FF7048', fontSize: 12, fontWeight: 600 }}>
                {workOrder.photos.length}
              </span>
            )}
            <ChevronRight size={16} className="text-[#71727A]" />
          </div>
        </div>

        {/* Signature */}
        <div
          onClick={() => navigate(`/route/${routeId}/stop/${stopId}/signature?woId=${workOrder.id}`)}
          className="flex items-center justify-between py-[12px] cursor-pointer"
          style={{ borderBottom: '1px solid #E8E9F1' }}
        >
          <div className="flex items-center gap-[10px]">
            <IconSignature />
            <span style={{ color: '#2B3B63', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Signature</span>
          </div>
          <div className="flex items-center gap-[8px]">
            {workOrder.signature ? (
              <span className="flex items-center gap-1" style={{ color: '#2FA301', fontSize: 12, fontWeight: 600 }}>
                <Check size={14} /> Signed
              </span>
            ) : (
              <ChevronRight size={16} className="text-[#71727A]" />
            )}
          </div>
        </div>

        {/* Notes */}
        <div
          onClick={() => navigate(`/route/${routeId}/stop/${stopId}/notes?woId=${workOrder.id}`)}
          className="flex items-center justify-between py-[12px] cursor-pointer"
        >
          <div className="flex items-center gap-[10px]">
            <IconStopNotes />
            <span style={{ color: '#2B3B63', fontSize: 14, fontWeight: 600, fontFamily: 'Google Sans Flex' }}>Notes</span>
          </div>
          <ChevronRight size={16} className="text-[#71727A]" />
        </div>
        
        {/* Complete Action */}
        {!isDone && (
          <div className="mt-2">
            <button 
              onClick={() => onComplete(workOrder.id)}
              disabled={isStopPending}
              className="w-full bg-[#FF7048] text-white py-[14px] rounded-[16px] font-bold text-[16px] active:scale-[0.98] transition-transform border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Mark as Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
