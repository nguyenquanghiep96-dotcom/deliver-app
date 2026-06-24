import svgPaths from "./svg-84od721ozj";

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-center min-w-px relative">
      <div className="[word-break:break-word] flex flex-col font-['Google_Sans_Flex:SemiBold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#2f3036] text-[16px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        <p className="leading-[normal] overflow-hidden text-ellipsis">1323 Bedford Ave, Pikesville, MD, 21208</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 8">
        <g id="Group">
          <path d={svgPaths.p334830f0} fill="var(--fill-0, #71727A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }} data-name="Group">
      <div className="absolute bottom-[8.33%] flex items-center justify-center left-1/4 right-1/4 top-[8.33%]" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame />
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Icon / Interface / Arrow-Right-Bold">
        <Group />
      </div>
    </div>
  );
}

function StopInfoContainer() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pb-[10px] relative shrink-0 w-full" data-name="Stop Info Container">
      <div aria-hidden className="absolute border-[#e8e9f1] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-[#e8e9f1] content-stretch flex items-center justify-center overflow-clip px-[8px] py-[6px] relative rounded-[21px] shrink-0 size-[36px]" data-name="Custom Tag">
        <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#71727a] text-[14px] whitespace-nowrap">
          <p className="leading-[normal]">4</p>
        </div>
      </div>
      <Frame1 />
    </div>
  );
}

function StopUserContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-center min-w-px relative" data-name="Stop User Container">
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="User Icon">
        <div className="absolute inset-[58.33%_12.5%_4.17%_12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 4.5">
            <path d={svgPaths.p3bd7500} fill="var(--fill-0, #71727A)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-1/2 left-1/4 right-1/4 top-0" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.p235ae380} fill="var(--fill-0, #71727A)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] flex-[1_0_0] font-['Google_Sans_Flex:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic overflow-hidden relative text-[#71727a] text-[12px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
        James Carter
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
      <div className="bg-[#e8e9f1] content-stretch flex items-center px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="Value">
        <div aria-hidden className="absolute border border-[#e8e9f1] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="[word-break:break-word] font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2f3036] text-[11px] whitespace-nowrap">Lot Transfer</p>
      </div>
      <StopUserContainer />
    </div>
  );
}

function StopStatusContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Stop Status Container">
      <Frame3 />
      <div className="bg-[rgba(240,154,17,0.2)] content-stretch flex items-center px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="Value">
        <div aria-hidden className="absolute border border-[rgba(240,154,17,0.2)] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <p className="[word-break:break-word] font-['Google_Sans_Flex:SemiBold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f09a11] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}>
          Pending
        </p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <StopInfoContainer />
      <StopStatusContainer />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

export default function StopCardFullContent() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[9px] items-end p-[12px] relative rounded-[24px] size-full" data-name="Stop Card / Full Content">
      <Frame2 />
    </div>
  );
}