import { NavLink } from "react-router";
import { cn } from "../lib/utils";
import svgPaths from "../imports/ButtonContainer/svg-tdy7ks0he1";

export function BottomNav() {
  return (
    <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[361px] bg-[#2f3036] drop-shadow-[0px_0px_5px_rgba(0,0,0,0.16)] flex gap-[5px] items-center p-[6px] rounded-[24px] z-40">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            "flex-[1_0_0] min-w-px flex flex-col gap-[8px] items-center justify-center py-[10px] relative rounded-[30px] transition-all duration-200",
            isActive ? "bg-[#ff7048] px-[8px] rounded-[19px] scale-100" : "px-[6px]"
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[19px]" />}
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[4.17%]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox={isActive ? "0 0 22 22" : "0 0 14.6667 14.6667"}>
                  <path d={isActive ? svgPaths.p218d5cf0 : svgPaths.p1b98b200} fill={isActive ? "#FFFFFF" : "#71727A"} />
                </svg>
              </div>
            </div>
            <span className={cn(
              "font-bold leading-[normal] text-[11px] text-center font-['Google_Sans_Flex']",
              isActive ? "text-white" : "text-[#71727A]"
            )}>Home</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/routes"
        className={({ isActive }) =>
          cn(
            "flex-[1_0_0] min-w-px flex flex-col gap-[8px] items-center justify-center py-[10px] relative rounded-[30px] transition-all duration-200",
            isActive ? "bg-[#ff7048] px-[8px] rounded-[19px] scale-100" : "px-[6px]"
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[19px]" />}
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[12.5%]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox={isActive ? "0 0 18 18" : "0 0 12 12"}>
                  <path d={isActive ? svgPaths.p7ec99f0 : svgPaths.p2674f500} fill={isActive ? "#FFFFFF" : "#71727A"} />
                </svg>
              </div>
            </div>
            <span className={cn(
              "font-bold leading-[normal] text-[11px] text-center font-['Google_Sans_Flex']",
              isActive ? "text-white" : "text-[#71727A]"
            )}>Routes</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "flex-[1_0_0] min-w-px flex flex-col gap-[8px] items-center justify-center py-[10px] relative rounded-[30px] transition-all duration-200",
            isActive ? "bg-[#ff7048] px-[8px] rounded-[19px] scale-100" : "px-[6px]"
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[19px]" />}
            <div className="overflow-clip relative shrink-0 size-[16px]">
               <div className="absolute inset-[58.33%_12.5%_4.17%_12.5%]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox={isActive ? "0 0 18 9" : "0 0 12 6"}>
                  <path d={isActive ? svgPaths.p26dddb00 : svgPaths.p19b41e00} fill={isActive ? "#FFFFFF" : "#71727A"} />
                </svg>
              </div>
              <div className="absolute bottom-1/2 left-1/4 right-1/4 top-0">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox={isActive ? "0 0 12 12" : "0 0 8 8"}>
                  <path d={isActive ? svgPaths.p2ca50880 : svgPaths.p65069f0} fill={isActive ? "#FFFFFF" : "#71727A"} />
                </svg>
              </div>
            </div>
            <span className={cn(
              "font-bold leading-[normal] text-[11px] text-center font-['Google_Sans_Flex']",
              isActive ? "text-white" : "text-[#71727A]"
            )}>Profile</span>
          </>
        )}
      </NavLink>
    </div>
  );
}
