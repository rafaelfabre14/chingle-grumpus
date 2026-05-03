import clsx from 'clsx';

interface StarburstBadgeProps {
  text: string;
  color?: 'red' | 'yellow' | 'electric';
  size?: number;
  className?: string;
}

const colorMap = {
  red: { bg: 'var(--color-primary)', text: '#fff' },
  yellow: { bg: 'var(--color-yellow)', text: '#000' },
  electric: { bg: 'var(--color-electric)', text: '#000' },
};

export default function StarburstBadge({ text, color = 'yellow', size = 96, className }: StarburstBadgeProps) {
  const { bg, text: textColor } = colorMap[color];
  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        clipPath:
          'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
        background: bg,
        flexShrink: 0,
      }}
    >
      <span
        className="text-center leading-tight"
        style={{
          fontFamily: 'var(--font-bangers), serif',
          fontSize: `${size * 0.18}px`,
          color: textColor,
          letterSpacing: '0.04em',
          maxWidth: '55%',
        }}
      >
        {text}
      </span>
    </div>
  );
}
