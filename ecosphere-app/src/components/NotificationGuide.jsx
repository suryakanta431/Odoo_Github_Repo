import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function NotificationGuide({ message, type, onDismiss }) {
  const cardRef = useRef(null);
  const faceRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !faceRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 36, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)' }
    );

    gsap.to(faceRef.current, {
      y: -4,
      repeat: -1,
      yoyo: true,
      duration: 0.7,
      ease: 'sine.inOut',
    });

    return () => {
      gsap.killTweensOf(faceRef.current);
    };
  }, [message, type]);

  return (
    <div
      ref={cardRef}
      className="fixed right-5 top-5 z-[60] flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-400/30 bg-slate-950/90 p-4 shadow-2xl backdrop-blur"
    >
      <div ref={faceRef} className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 text-3xl">
        {type === 'badge' ? '🏅' : type === 'reward' ? '🎁' : type === 'approval' ? '🧑‍💼' : '⚡'}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-100">{message}</p>
        <p className="mt-1 text-xs text-slate-400">Realtime EcoSphere update</p>
      </div>
      <button
        onClick={onDismiss}
        className="rounded-full border border-slate-700/70 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
      >
        ×
      </button>
    </div>
  );
}
