import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD } from '../theme';

export const level5: LevelData = {
  id: 5,
  name: "KERNEL_PANIC",
  startPos: { x: 50, y: 200 },
  goal: { x: 750, y: 200, w: 30, h: 200 }, 
  checkpoints: [
    { id: 'start_cp', x: 50, y: 200, w: 20, h: 40, respawnX: 50, respawnY: 200, activated: true },
    { id: 'cp1', x: 505, y: 260, w: 20, h: 40, respawnX: 515, respawnY: 250 }
  ],
  platforms: [
    { id: 'floor', type: EntityType.PLATFORM, x: 0, y: 400, w: 2000, h: 50, color: C_PLATFORM, visible: true },
    { id: 'o1', type: EntityType.PLATFORM, x: 300, y: 350, w: 30, h: 50, color: C_PLATFORM, visible: true },
    { id: 'o2', type: EntityType.PLATFORM, x: 500, y: 300, w: 30, h: 100, color: C_PLATFORM, visible: true },
    { id: 'o3', type: EntityType.PLATFORM, x: 700, y: 350, w: 30, h: 50, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    { id: 'wall_death', type: EntityType.HAZARD, x: -100, y: 0, w: 100, h: 450, color: C_HAZARD, visible: true },
    { id: 'mine1', type: EntityType.HAZARD, x: 400, y: 250, w: 20, h: 20, color: C_HAZARD, visible: true },
    { id: 'mine2', type: EntityType.HAZARD, x: 600, y: 150, w: 20, h: 20, color: C_HAZARD, visible: true },
  ],
  update: (player, platforms, hazards) => {
    // WALL MOVES RIGHT ONLY ONCE PLAYER STARTS MOVING
    const wall = hazards.find(h => h.id === 'wall_death');
    if (wall) {
      // Trigger movement if player leaves start zone (x > 60)
      if (!wall.moving && player.x > 60) {
        wall.moving = true;
      }

      if (wall.moving) {
        wall.x += 3.5; 
      }
    }

    // TROLL: Obstacle movement
    const o2 = platforms.find(p => p.id === 'o2');
    if (o2 && player.x > 400) {
       o2.x -= 2; 
    }

    return { platforms, hazards };
  }
};