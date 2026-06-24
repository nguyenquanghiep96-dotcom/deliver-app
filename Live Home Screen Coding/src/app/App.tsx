import Home from "../imports/Home/index";

export default function App() {
  return (
    <div className="min-h-screen bg-[#d4d6dd] flex items-center justify-center p-8">
      <div
        className="relative overflow-auto rounded-[54px] shadow-2xl"
        style={{
          width: 393,
          minHeight: 852,
          background: "#f8f9fe",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ width: 393, minHeight: 852, position: "relative" }}>
          <Home />
        </div>
      </div>
    </div>
  );
}
