import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative font-['Google_Sans_Flex']" 
      style={{ background: 'linear-gradient(to bottom, #405792, #2B3B63)' }}
    >
      <img src="/ShedPro.svg" alt="ShedPro Logo" className="w-[180px] h-auto mb-2 invert brightness-0" />
      <h2 className="text-white/80 text-[14px] font-medium tracking-wide mt-2">Ops Hub Driver App</h2>
    </div>
  );
}
