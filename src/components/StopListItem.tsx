import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import imgUserIcon from '../../icon/ic-user.svg';
import { TagBadge, StatusBadge } from './Badges';

export const cleanStopType = (type: string) => {
  if (type === 'Delivery & Install') return 'Delivery & Install';
  return type;
};

export default function StopListItem({ stop }: { stop: any }) {
  return (
    <div className="bg-white rounded-[24px] p-[12px] w-full border border-transparent shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[6px] items-center pb-[10px] border-b border-[#e8e9f1]">
          <div className="bg-[#e8e9f1] w-[36px] h-[36px] rounded-[21px] flex items-center justify-center text-[#71727a] font-bold text-[14px] shrink-0 font-['Proxima_Nova']">
            {stop.num}
          </div>
          <span className="text-[16px] font-semibold text-[#2f3036] truncate flex-1 font-['Google_Sans_Flex']">{stop.address}</span>
          <Link to={`/stop/${stop.id}`} className="text-[#71727a] hover:text-[#2f3036] shrink-0 w-[16px] h-[16px] flex items-center justify-center">
            <ChevronRight size={16} strokeWidth={3} />
          </Link>
        </div>
        <div className="flex items-center gap-[8px] flex-wrap select-none w-full">
          <TagBadge text={cleanStopType(stop.type)} />
          <div className="flex items-center gap-[2px] truncate text-[#71727a] text-[12px] font-medium font-['Google_Sans_Flex'] flex-1">
            <img src={imgUserIcon} className="w-[12px] h-[12px]" alt="user" /> {stop.customerName}
          </div>
          <StatusBadge status={stop.status} />
        </div>
      </div>
    </div>
  );
}
