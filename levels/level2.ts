import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD, C_LASER } from '../theme';

export const level2: LevelData = {
  id: 2,
  name: "FIREWALL_BREACH",
  startPos: { x: 50, y: 350 },
  goal: { x: 700, y: 140, w: 40, h: 60 },
  checkpoints: [
    { id: 'start_cp', x: 50, y: 350, w: 20, h: 40, respawnX: 50, respawnY: 350, activated: true },
    { id: 'cp1', x: 450, y: 160, w: 20, h: 40, respawnX: 470, respawnY: 160 }
  ],
  platforms: [
    { id: 'p1', type: EntityType.PLATFORM, x: 0, y: 400, w: 200, h: 50, color: C_PLATFORM, visible: true },
    { id: 'p2', type: EntityType.PLATFORM, x: 250, y: 300, w: 150, h: 20, color: C_PLATFORM, visible: true },
    { id: 'p3', type: EntityType.PLATFORM, x: 450, y: 200, w: 150, h: 20, color: C_PLATFORM, visible: true },
    { id: 'p4', type: EntityType.PLATFORM, x: 650, y: 200, w: 150, h: 20, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    // Laser vertical beams
    { id: 'laser1', type: EntityType.HAZARD, x: 320, y: 240, w: 10, h: 60, color: C_LASER, visible: true },
    { id: 'laser2', type: EntityType.HAZARD, x: 520, y: 140, w: 10, h: 60, color: C_LASER, visible: true },
  ],
  update: (player, platforms, hazards, frameCount, goal) => {
    // Lasers toggle
    const l1 = hazards.find(h => h.id === 'laser1');
    if (l1) l1.visible = (frameCount % 140) < 70; // Slower cycle

    const l2 = hazards.find(h => h.id === 'laser2');
    if (l2) l2.visible = (frameCount % 140) >= 70;

    // Door Troll:
    // When player gets close to the goal (on the final platform), the goal shifts position
    if (player.x > 600 && player.y < 250) {
       // Check if goal is at original position (roughly)
       if (goal.x > 680) {
          // Move goal to the LEFT side of the platform
          return { platforms, hazards, goal: { ...goal, x: 650 } };
       }
    } else {
        // Reset if player falls or moves back? 
        // Or keep it there. Let's keep it simple.
        if (goal.x < 680 && player.x < 600) {
            return { platforms, hazards, goal: { ...goal, x: 700 } };
        }
    }

    return { platforms, hazards };
  }
};