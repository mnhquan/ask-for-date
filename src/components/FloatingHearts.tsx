import type { CSSProperties } from 'react';
import { Heart } from 'lucide-react';

interface HeartSpec {
  left: string;
  size: number;
  duration: string;
  delay: string;
  drift: string;
  opacity: number;
}

const AMBIENT_HEARTS: HeartSpec[] = [
  { left: '8%', size: 16, duration: '13s', delay: '0s', drift: '18px', opacity: 0.22 },
  { left: '19%', size: 12, duration: '16s', delay: '3s', drift: '-14px', opacity: 0.18 },
  { left: '34%', size: 20, duration: '14s', delay: '6s', drift: '22px', opacity: 0.16 },
  { left: '52%', size: 14, duration: '15s', delay: '1.5s', drift: '-18px', opacity: 0.2 },
  { left: '68%', size: 18, duration: '12.5s', delay: '4.5s', drift: '16px', opacity: 0.22 },
  { left: '81%', size: 13, duration: '17s', delay: '2s', drift: '-20px', opacity: 0.17 },
  { left: '92%', size: 17, duration: '13.5s', delay: '7s', drift: '-12px', opacity: 0.2 },
];

const BURST_PARTICLES = [
  { x: '-64px', y: '-72px', delay: '40ms', size: 16 },
  { x: '-36px', y: '-96px', delay: '90ms', size: 14 },
  { x: '0px', y: '-108px', delay: '20ms', size: 18 },
  { x: '38px', y: '-94px', delay: '110ms', size: 14 },
  { x: '68px', y: '-70px', delay: '60ms', size: 16 },
  { x: '-48px', y: '-44px', delay: '140ms', size: 12 },
  { x: '48px', y: '-46px', delay: '160ms', size: 12 },
];

export function FloatingHearts() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden select-none"
    >
      {AMBIENT_HEARTS.map((heart, idx) => {
        const style = {
          left: heart.left,
          bottom: '-32px',
          '--heart-duration': heart.duration,
          '--heart-delay': heart.delay,
          '--heart-drift': heart.drift,
          '--heart-opacity': heart.opacity,
        } as CSSProperties;

        return (
          <span
            key={idx}
            style={style}
            className="animate-float-heart absolute text-accent"
          >
            <Heart
              width={heart.size}
              height={heart.size}
              fill="currentColor"
              strokeWidth={1.5}
            />
          </span>
        );
      })}
    </div>
  );
}

export function CelebrationHearts() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-0 w-0"
    >
      {BURST_PARTICLES.map((p, idx) => {
        const style = {
          left: '16px',
          top: '12px',
          '--burst-x': p.x,
          '--burst-y': p.y,
          '--burst-delay': p.delay,
        } as CSSProperties;

        return (
          <span
            key={idx}
            style={style}
            className="animate-burst-heart absolute text-accent"
          >
            <Heart
              width={p.size}
              height={p.size}
              fill="currentColor"
              strokeWidth={1.5}
            />
          </span>
        );
      })}
    </div>
  );
}
