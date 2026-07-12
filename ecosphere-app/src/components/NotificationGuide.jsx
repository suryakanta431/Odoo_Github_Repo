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
      className="fixed right-5 top-5 z-[60] flex max-w-sm items-center gap-3 rounded-2xl border border-amber-300/20 bg-gradient-to-br from-slate-900/95 to-stone-800/85 p-4 shadow-2xl backdrop-blur"
      style={{minWidth: 320}}
    >
      <div ref={faceRef} className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 text-3xl">
        {type === 'badge' ? '🏅' : type === 'reward' ? '🎁' : type === 'approval' ? '🧑‍💼' : '⚡'}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{message}</p>
        <p className="mt-1 text-xs text-amber-200">Realtime EcoSphere update</p>
      </div>
      <button
        onClick={onDismiss}
        className="rounded-full border border-amber-200/20 px-2 py-1 text-xs text-white transition hover:bg-amber-600/10"
      >
        ×
      </button>
    </div>
  );
}
