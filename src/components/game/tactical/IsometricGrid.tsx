import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Tile, TacticalUnit, GridPosition, GRID_COLS, GRID_ROWS,
  TILE_WIDTH, TILE_HEIGHT, gridToScreen, biomeTileColors
} from './types';
import { BiomeId } from '@/lib/gameData';

interface IsometricGridProps {
  grid: Tile[][];
  biome: BiomeId;
  units: TacticalUnit[];
  highlightedTiles: GridPosition[];
  attackRangeTiles: GridPosition[];
  selectedTile: GridPosition | null;
  onTileClick: (pos: GridPosition) => void;
  cameraX: number;
  cameraY: number;
  cameraZoom: number;
  unitAnimations: Record<string, { type: 'idle' | 'move' | 'attack' | 'hit' | 'defeated'; targetPos?: GridPosition }>;
}

const IsometricGrid: React.FC<IsometricGridProps> = ({
  grid, biome, units, highlightedTiles, attackRangeTiles,
  selectedTile, onTileClick, cameraX, cameraY, cameraZoom, unitAnimations,
}) => {
  const colors = biomeTileColors[biome];

  // Center offset so the grid appears centered
  const centerX = (GRID_COLS + GRID_ROWS) * TILE_WIDTH / 4;
  const centerY = 0;

  const isHighlighted = (col: number, row: number) =>
    highlightedTiles.some(t => t.col === col && t.row === row);

  const isAttackRange = (col: number, row: number) =>
    attackRangeTiles.some(t => t.col === col && t.row === row);

  const isSelected = (col: number, row: number) =>
    selectedTile?.col === col && selectedTile?.row === row;

  const getUnitAt = (col: number, row: number) =>
    units.find(u => u.position.col === col && u.position.row === row);

  const getTileColor = (tile: Tile, highlighted: boolean, attackRange: boolean, selected: boolean) => {
    if (selected) return 'hsl(35 90% 55%)';
    if (attackRange) return 'hsl(0 60% 40%)';
    if (highlighted) return 'hsl(180 50% 35%)';
    return colors[tile.type];
  };

  const getTileBorderColor = (tile: Tile, highlighted: boolean, attackRange: boolean) => {
    if (attackRange) return 'hsl(0 70% 50% / 0.6)';
    if (highlighted) return 'hsl(180 60% 50% / 0.6)';
    return 'hsl(230 15% 30% / 0.4)';
  };

  // Render tiles in order (back to front) for proper overlap
  const sortedTiles = useMemo(() => {
    const tiles: Tile[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        tiles.push(grid[r][c]);
      }
    }
    return tiles.sort((a, b) => (a.row + a.col) - (b.row + b.col));
  }, [grid]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-battle border border-border"
      style={{ height: 420 }}>
      {/* Grid container with camera transform */}
      <motion.div
        className="absolute"
        style={{ left: '50%', top: '40%' }}
        animate={{
          x: -cameraX,
          y: -cameraY,
          scale: cameraZoom,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        {/* Render tiles */}
        {sortedTiles.map(tile => {
          const screen = gridToScreen(tile.col, tile.row);
          const highlighted = isHighlighted(tile.col, tile.row);
          const attackRange = isAttackRange(tile.col, tile.row);
          const selected = isSelected(tile.col, tile.row);
          const unit = getUnitAt(tile.col, tile.row);
          const elevOffset = tile.elevation * 8;
          const clickable = highlighted || attackRange;
          const fillColor = getTileColor(tile, highlighted, attackRange, selected);
          const borderColor = getTileBorderColor(tile, highlighted, attackRange);

          return (
            <div
              key={`${tile.col}-${tile.row}`}
              className="absolute"
              style={{
                left: screen.x - TILE_WIDTH / 2,
                top: screen.y - TILE_HEIGHT / 2 - elevOffset,
                width: TILE_WIDTH,
                height: TILE_HEIGHT,
                zIndex: tile.row + tile.col,
              }}
            >
              {/* Tile diamond */}
              <motion.div
                className={`absolute inset-0 ${clickable ? 'cursor-pointer' : ''}`}
                onClick={() => clickable && onTileClick({ col: tile.col, row: tile.row })}
                whileHover={clickable ? { scale: 1.08 } : {}}
                style={{
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  background: fillColor,
                  border: `1px solid`,
                  borderColor: borderColor,
                }}
              >
                {/* Highlight pulse */}
                {(highlighted || attackRange) && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      background: attackRange
                        ? 'hsl(0 70% 50% / 0.15)'
                        : 'hsl(180 60% 50% / 0.15)',
                    }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Elevation indicator */}
                {tile.elevation > 0 && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-foreground/30">
                    {'▲'.repeat(tile.elevation)}
                  </div>
                )}
              </motion.div>

              {/* Unit on tile */}
              {unit && (
                <UnitSprite
                  unit={unit}
                  animation={unitAnimations[unit.id] || { type: 'idle' }}
                />
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ---- Unit Sprite ----
interface UnitSpriteProps {
  unit: TacticalUnit;
  animation: { type: 'idle' | 'move' | 'attack' | 'hit' | 'defeated'; targetPos?: GridPosition };
}

const UnitSprite: React.FC<UnitSpriteProps> = ({ unit, animation }) => {
  const idle = {
    y: [0, -3, 0],
    scale: [1, 1.02, 1],
  };

  const getAnim = () => {
    switch (animation.type) {
      case 'attack': return { x: [0, -8, 12, 0], scale: [1, 0.9, 1.15, 1], rotate: [0, -5, 10, 0] };
      case 'hit': return { x: [0, 6, -6, 4, 0], opacity: [1, 0.4, 1, 0.6, 1] };
      case 'defeated': return { opacity: [1, 0.3], scale: [1, 0.6], rotate: [0, -20] };
      default: return idle;
    }
  };

  const getTrans = () => {
    switch (animation.type) {
      case 'attack': return { duration: 0.5 };
      case 'hit': return { duration: 0.5 };
      case 'defeated': return { duration: 1 };
      default: return { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const };
    }
  };

  const ringColor = unit.isPlayer ? 'hsl(180 50% 40%)' : 'hsl(0 60% 40%)';
  const hpPercent = (unit.hp / unit.maxHp) * 100;
  const hpColor = hpPercent > 60 ? 'hsl(145 55% 45%)' : hpPercent > 30 ? 'hsl(35 90% 55%)' : 'hsl(0 70% 50%)';

  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
      style={{ bottom: '55%', zIndex: 100 }}>
      {/* HP bar */}
      <div className="w-10 h-1 rounded-full overflow-hidden mb-0.5"
        style={{ background: 'hsl(230 15% 20%)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: hpColor }}
          animate={{ width: `${hpPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* Sprite circle */}
      <motion.div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xl select-none"
        style={{
          background: 'radial-gradient(circle, hsl(230 20% 18%), hsl(230 25% 10%))',
          boxShadow: `0 0 8px ${ringColor}, 0 2px 4px hsl(0 0% 0% / 0.5)`,
          border: `2px solid ${ringColor}`,
        }}
        animate={getAnim() as any}
        transition={getTrans() as any}
      >
        {unit.emoji}
      </motion.div>
      {/* Name */}
      <p className="text-[8px] text-foreground/60 font-display mt-0.5 whitespace-nowrap">{unit.name}</p>
    </div>
  );
};

export default IsometricGrid;
