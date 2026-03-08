import { BiomeId } from '@/lib/gameData';

// Grid dimensions
export const GRID_COLS = 8;
export const GRID_ROWS = 6;

// Isometric tile dimensions (in px)
export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 40;

export interface GridPosition {
  col: number;
  row: number;
}

export type TileType = 'ground' | 'elevated' | 'water' | 'blocked';

export interface Tile {
  col: number;
  row: number;
  type: TileType;
  elevation: number; // 0-2
}

export interface TacticalUnit {
  id: string;
  name: string;
  emoji: string;
  position: GridPosition;
  hp: number;
  maxHp: number;
  moveRange: number;
  attackRange: number;
  attackDamage: number;
  isPlayer: boolean;
}

export type TurnPhase =
  | 'intro'
  | 'player_move'      // Highlight walkable tiles, click to move
  | 'player_action'    // Show action menu: Attack, Item, Wait
  | 'quiz'             // Answer question to unlock attack
  | 'select_target'    // Show attack range, select target tile
  | 'attack_anim'      // Camera pan + attack animation
  | 'monster_turn'     // Monster AI: move + attack
  | 'monster_attack_anim' // Monster attack animation
  | 'victory'
  | 'knockout';

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

// Convert grid position to isometric screen position
export function gridToScreen(col: number, row: number): { x: number; y: number } {
  return {
    x: (col - row) * (TILE_WIDTH / 2),
    y: (col + row) * (TILE_HEIGHT / 2),
  };
}

// Get Manhattan distance between two grid positions
export function gridDistance(a: GridPosition, b: GridPosition): number {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
}

// Get all tiles within range of a position
export function getTilesInRange(center: GridPosition, range: number, grid: Tile[][]): GridPosition[] {
  const result: GridPosition[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (gridDistance(center, { col: c, row: r }) <= range && grid[r][c].type !== 'blocked') {
        result.push({ col: c, row: r });
      }
    }
  }
  return result;
}

// Generate a biome-themed grid
export function generateGrid(biome: BiomeId): Tile[][] {
  const grid: Tile[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      let type: TileType = 'ground';
      let elevation = 0;

      // Biome-specific terrain
      if (biome === 'fever-peaks') {
        if ((r === 2 && c === 3) || (r === 3 && c === 5)) { type = 'elevated'; elevation = 1; }
        if (r === 1 && c === 6) { type = 'blocked'; }
      } else if (biome === 'fog-marshes') {
        if ((r === 2 && c === 2) || (r === 4 && c === 5) || (r === 3 && c === 4)) { type = 'water'; }
      } else if (biome === 'mood-tides') {
        if ((r === 1 && c === 4) || (r === 4 && c === 2)) { type = 'water'; }
        if (r === 3 && c === 6) { type = 'elevated'; elevation = 1; }
      } else if (biome === 'crystal-caverns') {
        if ((r === 2 && c === 4) || (r === 4 && c === 3)) { type = 'elevated'; elevation = 2; }
        if (r === 1 && c === 2) { type = 'blocked'; }
      } else if (biome === 'heartland') {
        if ((r === 3 && c === 3)) { type = 'elevated'; elevation = 1; }
      }

      grid[r][c] = { col: c, row: r, type, elevation };
    }
  }
  return grid;
}

// Simple monster AI: move toward player, attack if in range
export function getMonsterMove(
  monster: TacticalUnit,
  player: TacticalUnit,
  grid: Tile[][]
): GridPosition | null {
  const dist = gridDistance(monster.position, player.position);
  if (dist <= monster.attackRange) return null; // Already in range, don't move

  // Move toward player (greedy)
  const walkable = getTilesInRange(monster.position, monster.moveRange, grid);
  let best: GridPosition | null = null;
  let bestDist = Infinity;

  for (const pos of walkable) {
    // Don't move onto player
    if (pos.col === player.position.col && pos.row === player.position.row) continue;
    const d = gridDistance(pos, player.position);
    if (d < bestDist) {
      bestDist = d;
      best = pos;
    }
  }
  return best;
}

// Biome tile color tokens
export const biomeTileColors: Record<BiomeId, { ground: string; elevated: string; water: string; blocked: string }> = {
  'fever-peaks':     { ground: 'hsl(25 40% 22%)',  elevated: 'hsl(15 50% 30%)',  water: 'hsl(15 60% 35%)',  blocked: 'hsl(0 20% 15%)' },
  'fog-marshes':     { ground: 'hsl(180 15% 20%)', elevated: 'hsl(180 20% 25%)', water: 'hsl(200 30% 25%)', blocked: 'hsl(180 10% 12%)' },
  'mood-tides':      { ground: 'hsl(270 15% 22%)', elevated: 'hsl(270 25% 28%)', water: 'hsl(250 20% 18%)', blocked: 'hsl(270 10% 12%)' },
  'crystal-caverns': { ground: 'hsl(210 20% 22%)', elevated: 'hsl(210 30% 30%)', water: 'hsl(190 25% 18%)', blocked: 'hsl(210 15% 12%)' },
  'heartland':       { ground: 'hsl(140 15% 22%)', elevated: 'hsl(140 20% 28%)', water: 'hsl(200 20% 18%)', blocked: 'hsl(140 10% 12%)' },
  'bloom-garden':    { ground: 'hsl(100 20% 25%)', elevated: 'hsl(80 25% 30%)',  water: 'hsl(180 20% 20%)', blocked: 'hsl(100 10% 12%)' },
};
