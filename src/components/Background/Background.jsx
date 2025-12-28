import { useMemo } from 'react';

function Background() {
  // Generate stars
  const stars = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60,
      delay: Math.random() * 5,
      size: 1 + Math.random() * 2
    })), []
  );

  // Generate snowflakes
  const snowflakes = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 8 + Math.random() * 12,
      size: 0.5 + Math.random() * 1
    })), []
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient - midnight to dark blue */}
      <div 
        className="absolute inset-0" 
        style={{ background: 'linear-gradient(180deg, #0a0f1a 0%, #0a1628 50%, #132042 100%)' }}
      />
      
      {/* Mountain layers */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh]">
        {/* Far mountains */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
          <path 
            d="M0,600 L0,350 Q180,250 360,320 T720,280 T1080,340 T1440,300 L1440,600 Z" 
            fill="#0d1a2d"
            opacity="0.8"
          />
        </svg>
        
        {/* Mid mountains with trees */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 500" preserveAspectRatio="none">
          <path 
            d="M0,500 L0,280 L200,180 L350,300 L500,150 L650,280 L800,100 L950,260 L1100,140 L1250,280 L1440,200 L1440,500 Z" 
            fill="#0f2136"
          />
          {/* Trees on mountains */}
          <g fill="#0a1628">
            {[100, 180, 280, 400, 520, 680, 820, 980, 1120, 1280, 1380].map((x, i) => (
              <path key={i} d={`M${x},${350 - (i % 3) * 30} l-15,50 l-10,0 l25,-70 l25,70 l-10,0 Z`} />
            ))}
          </g>
        </svg>
        
        {/* Near mountains - darkest */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path 
            d="M0,400 L0,300 Q100,250 200,280 L300,200 L400,320 L550,180 L700,300 L850,220 L1000,320 L1150,240 L1300,300 Q1370,260 1440,280 L1440,400 Z" 
            fill="#071018"
          />
          {/* More trees in foreground */}
          <g fill="#050c14">
            {[50, 150, 320, 450, 600, 750, 900, 1050, 1200, 1350].map((x, i) => (
              <g key={i}>
                <path d={`M${x},${380 - (i % 2) * 20} l-12,40 l-8,0 l20,-55 l20,55 l-8,0 Z`} />
                <rect x={x - 3} y={380 - (i % 2) * 20 + 35} width="6" height="15" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Northern Lights */}
      <div className="absolute top-0 left-0 right-0 h-[70vh] overflow-hidden" style={{ opacity: 0.6 }}>
        {/* Aurora layer 1 - Green/Cyan */}
        <div 
          className="absolute top-[5%] left-[10%] w-[80%] h-[40%] rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(67, 233, 123, 0.4) 0%, rgba(0, 242, 254, 0.3) 50%, transparent 100%)',
            filter: 'blur(100px)',
            animation: 'aurora 15s ease-in-out infinite'
          }}
        />
        
        {/* Aurora layer 2 - Blue/Purple */}
        <div 
          className="absolute top-[15%] left-[20%] w-[60%] h-[35%] rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(79, 172, 254, 0.35) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 100%)',
            filter: 'blur(80px)',
            animation: 'aurora 12s ease-in-out infinite 3s'
          }}
        />
        
        {/* Aurora layer 3 - Cyan streaks */}
        <div 
          className="absolute top-[10%] left-[30%] w-[50%] h-[30%] rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 242, 254, 0.3) 0%, rgba(67, 233, 123, 0.2) 100%)',
            filter: 'blur(60px)',
            animation: 'aurora 18s ease-in-out infinite 6s'
          }}
        />
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Snowfall */}
      <div className="absolute inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute"
            style={{
              left: `${flake.left}%`,
              top: '-20px',
              fontSize: `${flake.size}rem`,
              color: 'rgba(255, 255, 255, 0.7)',
              animation: `snowfall ${flake.duration}s linear infinite`,
              animationDelay: `${flake.delay}s`
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Gradient overlay for content readability */}
      <div 
        className="absolute inset-0" 
        style={{ background: 'linear-gradient(to top, rgba(10, 22, 40, 0.5), transparent, transparent)' }}
      />
    </div>
  );
}

export default Background;
