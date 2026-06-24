import svgPaths from "./svg-tdy7ks0he1";
type ProfileProps = {
  className?: string;
  property1?: "Active" | "Default";
};

function Profile({ className, property1 = "Default" }: ProfileProps) {
  const isActive = property1 === "Active";
  const isDefault = property1 === "Default";
  return (
    <div className={className || `content-stretch flex flex-col gap-[8px] items-center justify-center py-[10px] relative w-[64px] ${isActive ? "bg-[#ff7048] px-[8px] rounded-[19px]" : "px-[6px] rounded-[30px]"}`}>
      {isDefault && (
        <>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / Interface / User 1 - Bold">
            <div className="absolute inset-[58.33%_12.5%_4.17%_12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 6">
                <path d={svgPaths.p19b41e00} fill="var(--fill-0, #71727A)" id="Vector" />
              </svg>
            </div>
            <div className="absolute bottom-1/2 left-1/4 right-1/4 top-0" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                <path d={svgPaths.p65069f0} fill="var(--fill-0, #71727A)" id="Vector" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Proxima_Nova:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#71727a] text-[11px] text-center w-[min-content]">Profile</p>
        </>
      )}
      {isActive && (
        <>
          <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[19px]" />
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / Interface / User 1 - Bold">
            <div className="absolute inset-[58.33%_12.5%_4.17%_12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 9">
                <path d={svgPaths.p26dddb00} fill="var(--fill-0, #2B3B63)" id="Vector" />
              </svg>
            </div>
            <div className="absolute bottom-1/2 left-1/4 right-1/4 top-0" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                <path d={svgPaths.p2ca50880} fill="var(--fill-0, #2B3B63)" id="Vector" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Proxima_Nova:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[11px] text-center text-white w-[min-content]">Profile</p>
        </>
      )}
    </div>
  );
}
type RouteProps = {
  className?: string;
  property1?: "Active" | "Default";
};

function Route({ className, property1 = "Default" }: RouteProps) {
  const isActive = property1 === "Active";
  const isDefault = property1 === "Default";
  return (
    <div className={className || `content-stretch flex flex-col gap-[8px] items-center justify-center py-[10px] relative w-[64px] ${isActive ? "bg-[#ff7048] px-[8px] rounded-[19px]" : "px-[6px] rounded-[30px]"}`}>
      {isDefault && (
        <>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / Interface / Routes - Bold">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                <path d={svgPaths.p2674f500} fill="var(--fill-0, #71727A)" id="Vector" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Proxima_Nova:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#71727a] text-[11px] text-center w-[min-content]">Routes</p>
        </>
      )}
      {isActive && (
        <>
          <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[19px]" />
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / Interface / Routes - Bold">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p7ec99f0} fill="var(--fill-0, #2B3B63)" id="Vector" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Proxima_Nova:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[11px] text-center text-white w-[min-content]">Routes</p>
        </>
      )}
    </div>
  );
}
type HomeProps = {
  className?: string;
  property1?: "Active" | "Default";
};

function Home({ className, property1 = "Default" }: HomeProps) {
  const isActive = property1 === "Active";
  const isDefault = property1 === "Default";
  return (
    <div className={className || `content-stretch flex flex-col gap-[8px] items-center justify-center py-[10px] relative w-[64px] ${isActive ? "bg-[#ff7048] px-[8px] rounded-[19px]" : "px-[6px] rounded-[30px]"}`}>
      {isDefault && (
        <>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Home">
            <div className="absolute inset-[4.17%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 14.6667">
                <path d={svgPaths.p1b98b200} fill="var(--fill-0, #71727A)" id="Union" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Proxima_Nova:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#71727a] text-[11px] text-center w-[min-content]">Home</p>
        </>
      )}
      {isActive && (
        <>
          <div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[19px]" />
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Home">
            <div className="absolute inset-[4.17%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                <path d={svgPaths.p218d5cf0} fill="var(--fill-0, #D9D9D9)" id="Union" />
              </svg>
            </div>
          </div>
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Proxima_Nova:Bold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[11px] text-center text-white w-[min-content]">Home</p>
        </>
      )}
    </div>
  );
}

export default function ButtonContainer({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#2f3036] content-stretch drop-shadow-[0px_0px_5px_rgba(0,0,0,0.16)] flex gap-[5px] items-center p-[6px] relative rounded-[24px] w-[361px]"} data-name="Button Container">
      <Home className="flex-[1_0_0] min-w-px relative rounded-[30px]" />
      <Route className="flex-[1_0_0] min-w-px relative rounded-[30px]" />
      <Profile className="flex-[1_0_0] min-w-px relative rounded-[30px]" />
    </div>
  );
}