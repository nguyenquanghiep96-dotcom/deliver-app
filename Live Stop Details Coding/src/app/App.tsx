import StopDetails from "@/imports/StopDetails/index";

export default function App() {
  return (
    <div className="min-h-screen bg-[#e5e7eb] flex items-start justify-center py-8">
      <div
        className="relative w-[393px] overflow-y-auto rounded-[40px] shadow-2xl"
        style={{ height: "min(852px, calc(100vh - 4rem))" }}
      >
        <div className="relative w-[393px] h-[852px]">
          <StopDetails />
        </div>
      </div>
    </div>
  );
}
