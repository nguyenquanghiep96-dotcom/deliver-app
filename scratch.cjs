const fs = require('fs');
let content = fs.readFileSync('src/StopDetailsExport/index.tsx', 'utf8');

// 1. Remove OS status bar and Home Indicator
content = content.replace(/<div className="absolute content-stretch flex flex-col items-start left-0 top-0" data-name="🧰 Status Bar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// 2. Fix Absolute Positioning on root containers
content = content.replace(/className="-translate-x-1\/2 absolute content-stretch flex gap-\[16px\] items-center left-1\/2 px-\[16px\] py-\[12px\] top-\[54px\] w-\[393px\]"/, 'className="flex gap-[16px] items-center px-4 pt-14 pb-4 w-full bg-transparent shrink-0 z-20"');
content = content.replace(/className="absolute content-stretch flex flex-col gap-\[10px\] items-start left-\[16px\] top-\[122px\] w-\[361px\]"/, 'className="flex flex-col gap-[10px] items-start w-full px-4 relative z-10"');
content = content.replace(/className="-translate-x-1\/2 absolute content-stretch flex flex-col gap-\[25px\] items-start left-1\/2 top-\[634px\] w-\[393px\]"/, 'className="flex flex-col gap-[25px] items-start w-full px-4 pb-32 pt-4 relative z-10"');

// 3. Fix background gradient
content = content.replace(/<div className="-translate-x-1\/2 absolute flex h-\[1507px\] items-center justify-center left-1\/2 top-0 w-\[393px\]">[\s\S]*?<\/div>\s*<\/div>/, '<div className="absolute inset-0 overflow-hidden pointer-events-none z-0"><div className="w-[1507px] h-[393px] absolute -top-20 left-1/2 -translate-x-1/2"><ModernGradient /></div></div>');

// 4. Inject Dynamic Data
content = content.replace(/James Carter/g, '{stop.customerName}');
content = content.replace(/714-345-4909/g, '{stop.customerPhone}');
content = content.replace(/123 William St, Manhattan, NY, 10038/g, '{stop.address}');
content = content.replace(/#2-24756/g, '{stop.id}');
content = content.replace(/14 x 20 x 7/g, '{stop.unitInfo.size}');
content = content.replace(/RE001/g, '{stop.unitInfo.serial}');
content = content.replace(/Tiny Home \(Porch\)/g, '{cleanStopType(stop.type)}');
content = content.replace(/Stop 3\/5/g, 'Stop {stop.num}/{currentRoute.stops.length}');
content = content.replace(/"Arrived"/g, '"{stop.status === \'Done\' ? \'Completed\' : stop.status === \'Servicing\' ? \'Arrived\' : \'Pending\'}"');
content = content.replace(/>Arrived</g, '>{stop.status === \'Done\' ? \'Completed\' : stop.status === \'Servicing\' ? \'Arrived\' : \'Pending\'}<');
content = content.replace(/Lot Transfer/g, "{cleanStopType(stop.type)}");

// 5. Add props to components
content = content.replace(/function AddressContainer\(\) {/g, 'function AddressContainer({ stop }: any) {');
content = content.replace(/<AddressContainer \/>/g, '<AddressContainer stop={stop} />');
content = content.replace(/function StopUserContainer\(\) {/g, 'function StopUserContainer({ stop }: any) {');
content = content.replace(/<StopUserContainer \/>/g, '<StopUserContainer stop={stop} />');
content = content.replace(/function StopInfoContainer\(\) {/g, 'function StopInfoContainer({ stop }: any) {');
content = content.replace(/<StopInfoContainer \/>/g, '<StopInfoContainer stop={stop} />');
content = content.replace(/function StopStatusIndicator\(\) {/g, 'function StopStatusIndicator({ stop }: any) {');
content = content.replace(/<StopStatusIndicator \/>/g, '<StopStatusIndicator stop={stop} />');
content = content.replace(/function StopStatusContainer\(\) {/g, 'function StopStatusContainer({ stop }: any) {');
content = content.replace(/<StopStatusContainer \/>/g, '<StopStatusContainer stop={stop} />');

content = content.replace(/function NoteContainer\(\) {/g, 'function NoteContainer({ stop }: any) {');
content = content.replace(/<NoteContainer \/>/g, '<NoteContainer stop={stop} />');
content = content.replace(/function NotesContainer\(\) {/g, 'function NotesContainer({ stop }: any) {');
content = content.replace(/<NotesContainer \/>/g, '<NotesContainer stop={stop} />');
content = content.replace(/Watch for power lines. Placement on pad./g, '{stop.notes}');

content = content.replace(/function AddressAndStatus\(\) {/g, 'function AddressAndStatus({ stop }: any) {');
content = content.replace(/<AddressAndStatus \/>/g, '<AddressAndStatus stop={stop} />');
content = content.replace(/function AddressInfo\(\) {/g, 'function AddressInfo({ stop }: any) {');
content = content.replace(/<AddressInfo \/>/g, '<AddressInfo stop={stop} />');

content = content.replace(/function Header\(\) {/g, 'function Header({ stop, currentRoute, navigate }: any) {');
content = content.replace(/<Header \/>/g, '<Header stop={stop} currentRoute={currentRoute} navigate={navigate} />');
content = content.replace(/function ButtonIcon\(\) {/g, 'function ButtonIcon({ navigate }: any) {');
content = content.replace(/<ButtonIcon \/>/g, '<ButtonIcon navigate={navigate} />');
content = content.replace(/<div className="bg-\[#e8e9f1\] content-stretch flex items-center p-\[14px\] relative rounded-\[50px\] shrink-0"/, '<div onClick={() => navigate(-1)} className="bg-[#e8e9f1] content-stretch flex items-center p-[14px] relative rounded-[50px] shrink-0 cursor-pointer active:scale-95"');

content = content.replace(/function BuildingStyleContainer1\(\) {/g, 'function BuildingStyleContainer1({ stop }: any) {');
content = content.replace(/<BuildingStyleContainer1 \/>/g, '<BuildingStyleContainer1 stop={stop} />');
content = content.replace(/function BuildingStyleContainer\(\) {/g, 'function BuildingStyleContainer({ stop }: any) {');
content = content.replace(/<BuildingStyleContainer \/>/g, '<BuildingStyleContainer stop={stop} />');
content = content.replace(/function SizeContainer\(\) {/g, 'function SizeContainer({ stop }: any) {');
content = content.replace(/<SizeContainer \/>/g, '<SizeContainer stop={stop} />');
content = content.replace(/function SerialContainer\(\) {/g, 'function SerialContainer({ stop }: any) {');
content = content.replace(/<SerialContainer \/>/g, '<SerialContainer stop={stop} />');
content = content.replace(/function BuildingDetailsList\(\) {/g, 'function BuildingDetailsList({ stop }: any) {');
content = content.replace(/<BuildingDetailsList \/>/g, '<BuildingDetailsList stop={stop} />');
content = content.replace(/function BuildingDetailsHeaderContainer\(\) {/g, 'function BuildingDetailsHeaderContainer({ stop }: any) {');
content = content.replace(/<BuildingDetailsHeaderContainer \/>/g, '<BuildingDetailsHeaderContainer stop={stop} />');
content = content.replace(/function BuildingInfoContainer\(\) {/g, 'function BuildingInfoContainer({ stop }: any) {');
content = content.replace(/<BuildingInfoContainer \/>/g, '<BuildingInfoContainer stop={stop} />');
content = content.replace(/function BuildingDetailsContainer\(\) {/g, 'function BuildingDetailsContainer({ stop }: any) {');
content = content.replace(/<BuildingDetailsContainer \/>/g, '<BuildingDetailsContainer stop={stop} />');

content = content.replace(/function PhoneInfo\(\) {/g, 'function PhoneInfo({ stop }: any) {');
content = content.replace(/<PhoneInfo \/>/g, '<PhoneInfo stop={stop} />');
content = content.replace(/function ButtonFilled2\(\) {/g, 'function ButtonFilled2({ stop }: any) {');
content = content.replace(/<ButtonFilled2 \/>/g, '<ButtonFilled2 stop={stop} />');
content = content.replace(/function SizeContainer1\(\) {/g, 'function SizeContainer1({ stop }: any) {');
content = content.replace(/<SizeContainer1 \/>/g, '<SizeContainer1 stop={stop} />');
content = content.replace(/function BuildingDetailsList1\(\) {/g, 'function BuildingDetailsList1({ stop }: any) {');
content = content.replace(/<BuildingDetailsList1 \/>/g, '<BuildingDetailsList1 stop={stop} />');
content = content.replace(/function BuildingDetailsHeaderContainer1\(\) {/g, 'function BuildingDetailsHeaderContainer1({ stop }: any) {');
content = content.replace(/<BuildingDetailsHeaderContainer1 \/>/g, '<BuildingDetailsHeaderContainer1 stop={stop} />');
content = content.replace(/function BuildingInfoContainer1\(\) {/g, 'function BuildingInfoContainer1({ stop }: any) {');
content = content.replace(/<BuildingInfoContainer1 \/>/g, '<BuildingInfoContainer1 stop={stop} />');
content = content.replace(/function CustomerInfoContainer\(\) {/g, 'function CustomerInfoContainer({ stop }: any) {');
content = content.replace(/<CustomerInfoContainer \/>/g, '<CustomerInfoContainer stop={stop} />');
content = content.replace(/function MainContainer\(\) {/g, 'function MainContainer({ stop }: any) {');
content = content.replace(/<MainContainer \/>/g, '<MainContainer stop={stop} />');

// 6. Action handlers
content = content.replace(/function ButtonFilled\(\) {/g, 'function ButtonFilled({ stop }: any) {');
content = content.replace(/<ButtonFilled \/>/g, '<ButtonFilled stop={stop} />');
content = content.replace(/<div className="bg-\[#ff7048\] flex-\[1_0_0\] min-w-px relative rounded-\[16px\]"/, '<a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}`} target="_blank" className="bg-[#ff7048] flex-[1_0_0] min-w-px relative rounded-[16px] decoration-none"');
content = content.replace(/<\/div>\s*<div aria-hidden className="absolute border border-\[#faa087\] border-solid inset-0 pointer-events-none rounded-\[16px\]" \/>\s*<\/div>/, '</div><div aria-hidden className="absolute border border-[#faa087] border-solid inset-0 pointer-events-none rounded-[16px]" /></a>');

content = content.replace(/<div className="bg-\[#ff7048\] relative rounded-\[16px\] self-stretch shrink-0"/, '<div onClick={() => window.submitStopDone?.()} className="bg-[#ff7048] relative rounded-[16px] self-stretch shrink-0 cursor-pointer"');

content = content.replace(/<div className="bg-\[#ff7048\] content-stretch flex gap-\[6px\] items-center justify-center overflow-clip px-\[30px\] py-\[14.5px\] relative rounded-\[16px\] shrink-0 w-\[129px\]"/, '<a href={`tel:${stop.customerPhone}`} className="bg-[#ff7048] content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[30px] py-[14.5px] relative rounded-[16px] shrink-0 w-[129px] decoration-none cursor-pointer active:scale-95"');
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>/g, (match, offset, str) => {
  // Find the exact ButtonFilled2 end
  return match;
});

// For ButtonFilled3 (floating Call Customer button)
content = content.replace(/<div className="absolute bg-\[#ff7048\] content-stretch flex gap-\[6px\] items-center justify-center left-\[calc\(40\%\+46\.3px\)\] overflow-clip px-\[30px\] py-\[14\.5px\] rounded-\[16px\] top-\[696px\] w-\[172\.5px\]"/, '<a href={`tel:${stop?.customerPhone}`} className="absolute bg-[#ff7048] content-stretch flex gap-[6px] items-center justify-center left-[calc(40%+46.3px)] overflow-clip px-[30px] py-[14.5px] rounded-[16px] top-[696px] w-[172.5px] decoration-none cursor-pointer active:scale-95"');
content = content.replace(/function ButtonFilled3\(\) {/g, 'function ButtonFilled3({ stop }: any) {');
content = content.replace(/<ButtonFilled3 \/>/g, '<ButtonFilled3 stop={stop} />');

// 7. Modals / file ref triggers
content = content.replace(/function AddPhotoContainer\(\) {/g, 'function AddPhotoContainer() {');
content = content.replace(/<div className="content-stretch flex gap-\[16px\] items-center py-\[16px\] relative shrink-0 w-full"/, '<div onClick={() => window.triggerPhotoAdd?.()} className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70"');

content = content.replace(/function PaymentContainer\(\) {/g, 'function PaymentContainer() {');
content = content.replace(/<div className="content-stretch flex gap-\[16px\] items-center py-\[16px\] relative shrink-0 w-full"/, '<div className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70"');

content = content.replace(/function SignatureContainer\(\) {/g, 'function SignatureContainer() {');
content = content.replace(/<div className="content-stretch flex gap-\[16px\] items-center py-\[16px\] relative shrink-0 w-full"/, '<div onClick={() => window.triggerSignature?.()} className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70"');

content = content.replace(/function CommentContainer\(\) {/g, 'function CommentContainer() {');
content = content.replace(/<div className="content-stretch flex gap-\[16px\] items-center py-\[16px\] relative shrink-0 w-full"/, '<div onClick={() => window.triggerComment?.()} className="content-stretch flex gap-[16px] items-center py-[16px] relative shrink-0 w-full cursor-pointer active:opacity-70"');

fs.writeFileSync('src/StopDetailsExport/processed.tsx', content);
console.log('Done script');
