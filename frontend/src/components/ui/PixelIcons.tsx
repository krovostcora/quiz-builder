interface PixelArtProps {
  rows: string[];
  size?: number;
  className?: string;
}

// Renders a pixel map: '#' is a filled pixel, anything else is empty
function PixelArt({ rows, size = 4, className }: PixelArtProps) {
  const width = rows[0].length;
  const height = rows.length;

  return (
    <svg
      width={width * size}
      height={height * size}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null,
        ),
      )}
    </svg>
  );
}

const DOTS = ['###', '###', '###', '...', '###', '###', '###', '...', '###', '###', '###'];

const FOLDER = [
  '####.........',
  '#..#.........',
  '#..##########',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#############',
];

export function DotsIcon({ size = 2 }: { size?: number }) {
  return <PixelArt rows={DOTS} size={size} />;
}

export function EmptyFolderIcon({ size = 8 }: { size?: number }) {
  return <PixelArt rows={FOLDER} size={size} />;
}
