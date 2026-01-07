
import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD, C_INVISIBLE } from '../theme';
import { CANVAS_HEIGHT } from '../constants';

export const level3: LevelData = {
  id: 3,
  name: "FATAL_EXCEPTION",
  startPos: { x: 50, y: 200 },
  goal: { x: 700, y: 350, w: 40, h: 60 },
  checkpoints: [
    { id: 'start_cp', x: 50, y: 200, w: 20, h: 40, respawnX: 50, respawnY: 200, activated: true },
    { id: 'cp1', x: 350, y: 310, w: 20, h: 40, respawnX: 350, respawnY: 300 }
  ],
  platforms: [
    { id: 'start', type: EntityType.PLATFORM, x: 0, y: 250, w: 150, h: 200, color: C_PLATFORM, visible: true },
    { id: 'middle', type: EntityType.PLATFORM, x: 200, y: 350, w: 350, h: 20, color: C_PLATFORM, visible: true },
    { id: 'end', type: EntityType.PLATFORM, x: 650, y: 410, w: 150, h: 40, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    { id: 'rain1', type: EntityType.HAZARD, x: 250, y: -50, w: 20, h: 40, color: C_HAZARD, visible: true },
    // Moved rain2 away from x=350 (checkpoint) to x=400
    { id: 'rain2', type: EntityType.HAZARD, x: 400, y: -150, w: 20, h: 40, color: C_HAZARD, visible: true },
    { id: 'rain3', type: EntityType.HAZARD, x: 450, y: -250, w: 20, h: 40, color: C_HAZARD, visible: true },
    { id: 'invis_wall', type: EntityType.HAZARD, x: 600, y: 300, w: 20, h: 110, color: C_INVISIBLE, visible: true },
  ],
  update: (player, platforms, hazards) => {
    // TROLL: Intense Rain
    hazards.forEach(h => {
      if (h.id.includes('rain')) {
        if (player.x > 100) {
          h.y += 9;
           if (h.y > CANVAS_HEIGHT) h.y = -100;
        }
      }
    });

    // TROLL: Invisible wall becomes visible when hit
    const wall = hazards.find(h => h.id === 'invis_wall');
    if (wall && player.x > 580 && player.x < 620 && player.y > 300) {
        wall.color = C_HAZARD; 
    }

    // TROLL: Goal slide
    if (player.x > 500) {
      const endP = platforms.find(p => p.id === 'end');
      if (endP) endP.x += 3;
    }

    return { platforms, hazards };
  }
};
