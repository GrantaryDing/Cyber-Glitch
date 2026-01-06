import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD, C_GOAL, C_INVISIBLE } from '../theme';

export const level1: LevelData = {
  id: 1,
  name: "SYSTEM_INIT",
  startPos: { x: 50, y: 300 },
  goal: { x: 700, y: 300, w: 40, h: 60 },
  checkpoints: [
    { id: 'start_cp', x: 50, y: 300, w: 20, h: 40, respawnX: 50, respawnY: 300, activated: true },
    { id: 'cp1', x: 280, y: 340, w: 20, h: 40, respawnX: 290, respawnY: 340 }
  ],
  platforms: [
    { id: 'floor1', type: EntityType.PLATFORM, x: 0, y: 380, w: 250, h: 70, color: C_PLATFORM, visible: true },
    // Safe platform for checkpoint
    { id: 'cp_floor', type: EntityType.PLATFORM, x: 250, y: 380, w: 80, h: 70, color: C_PLATFORM, visible: true },
    // Troll floor moved slightly right
    { id: 'troll_floor', type: EntityType.PLATFORM, x: 330, y: 380, w: 230, h: 70, color: C_PLATFORM, visible: true },
    { id: 'end_floor', type: EntityType.PLATFORM, x: 600, y: 380, w: 200, h: 70, color: C_PLATFORM, visible: true },
    { id: 'float1', type: EntityType.PLATFORM, x: 100, y: 250, w: 80, h: 20, color: C_PLATFORM, visible: true },
    // New safe block added based on screenshot feedback
    { id: 'safe_bridge', type: EntityType.PLATFORM, x: 420, y: 280, w: 120, h: 20, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    { id: 'spike1', type: EntityType.HAZARD, x: 300, y: 430, w: 240, h: 20, color: C_HAZARD, visible: false },
    { id: 'patrol_spike', type: EntityType.HAZARD, x: 150, y: 360, w: 20, h: 20, color: C_HAZARD, visible: true, vx: 2 },
  ],
  update: (player, platforms, hazards) => {
    // TROLL: Middle floor drops faster
    const trollFloor = platforms.find(p => p.id === 'troll_floor');
    // Adjusted range for new floor position (330 + 230 = 560)
    if (trollFloor && player.x > 330 && player.x < 560) {
      trollFloor.y += 12; // Faster drop
    }

    // HAZARD: Patrolling spike
    const patrol = hazards.find(h => h.id === 'patrol_spike');
    if (patrol) {
      patrol.x += (patrol.vx || 0);
      if (patrol.x > 200 || patrol.x < 50) patrol.vx = -(patrol.vx || 2);
    }

    return { platforms, hazards };
  }
};