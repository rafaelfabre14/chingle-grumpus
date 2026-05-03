import clsx from 'clsx';

interface SpeechBubbleProps {
  text: string;
  direction?: 'right' | 'left' | 'bottom';
  className?: string;
}

export default function SpeechBubble({ text, direction = 'bottom', className }: SpeechBubbleProps) {
  return (
    <div className={clsx('relative inline-block', className)}>
      <div
        className="px-4 py-2 border-comic rounded"
        style={{
          background: 'var(--color-light)',
          border: '3px solid #000',
          boxShadow: '3px 3px 0 #000',
          fontFamily: 'var(--font-bangers), serif',
          fontSize: '1.1rem',
          letterSpacing: '0.04em',
          color: 'var(--color-dark)',
        }}
      >
        {text}
      </div>
      {/* Tail */}
      {direction === 'bottom' && (
        <div
          style={{
            position: 'absolute',
            bottom: '-14px',
            left: '20px',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '14px solid #000',
          }}
        />
      )}
      {direction === 'right' && (
        <div
          style={{
            position: 'absolute',
            right: '-14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '14px solid #000',
          }}
        />
      )}
      {direction === 'left' && (
        <div
          style={{
            position: 'absolute',
            left: '-14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '14px solid #000',
          }}
        />
      )}
    </div>
  );
}
