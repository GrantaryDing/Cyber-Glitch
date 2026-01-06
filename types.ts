
export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export enum EntityType {
  PLAYER,
  PLATFORM,
  HAZARD,
  GOAL,
  DECORATION,
  CHECKPOINT
}

export interface GameObject extends Rect {
  id: string;
  type: EntityType;
  color: string;
  hidden?: boolean; // Invisible but has collision
  visible?: boolean; // Rendered
  moving?: boolean;
  vx?: number;
  vy?: number;
}

export interface Checkpoint extends Rect {
  id: string;
  respawnX: number;
  respawnY: number;
  activated?: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  startPos: Vector2;
  goal: Rect;
  platforms: GameObject[];
  hazards: GameObject[];
  checkpoints?: Checkpoint[];
  // Function to modify level state based on player position/time (The "Troll" factor)
  update?: (
    playerRect: Rect, 
    platforms: GameObject[], 
    hazards: GameObject[], 
    frameCount: number,
    goal: Rect
  ) => { platforms: GameObject[], hazards: GameObject[], goal?: Rect };
}

export type GameState = 'MENU' | 'PLAYING' | 'DIED' | 'WON_LEVEL' | 'COMPLETED_GAME';
    