import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-[393px] h-[852px] bg-white rounded-[50px] shadow-2xl overflow-hidden relative border-[8px] border-black flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[20px] z-50 flex items-center justify-center">
            <div className="w-[100px] h-full flex items-center justify-between px-3">
                <div className="text-[10px] text-white font-bold">1:47</div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
                </div>
            </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        <BottomNav />
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-50"></div>
      </div>
    </div>
  );
}
