export const BackgroundDecor = () => (
  <div
    className="pointer-events-none fixed inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <div
      className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-[0.07]"
      style={{
        background:
          'radial-gradient(circle at 40% 40%, hsl(196 72% 38%), hsl(196 72% 20%) 70%)',
        filter: 'blur(60px)',
      }}
    />
    <div
      className="absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full opacity-[0.06]"
      style={{
        background:
          'radial-gradient(circle at 60% 60%, hsl(222 47% 30%), hsl(222 47% 10%) 70%)',
        filter: 'blur(50px)',
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage:
          'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
  </div>
);
