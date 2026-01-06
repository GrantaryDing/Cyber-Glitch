import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD } from '../theme';

export const level4: LevelData = {
  id: 4,
  name: "MEM_LEAK",
  startPos: { x: 50, y: 350 },
  goal: { x: 700, y: 150, w: 40, h: 60 },
  checkpoints: [
    { id: 'start_cp', x: 50, y: 350, w: 20, h: 40, respawnX: 50, respawnY: 350, activated: true },
    { id: 'cp1', x: 370, y: 260, w: 20, h: 40, respawnX: 390, respawnY: 260 }
  ],
  platforms: [
    { id: 'start', type: EntityType.PLATFORM, x: 0, y: 400, w: 150, h: 50, color: C_PLATFORM, visible: true },
    { id: 'b1', type: EntityType.PLATFORM, x: 200, y: 350, w: 80, h: 20, color: C_PLATFORM, visible: true },
    // b2 is the checkpoint platform
    { id: 'b2', type: EntityType.PLATFORM, x: 350, y: 300, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'b3', type: EntityType.PLATFORM, x: 500, y: 250, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'b4', type: EntityType.PLATFORM, x: 650, y: 200, w: 150, h: 20, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    { id: 'floor_lava', type: EntityType.HAZARD, x: 0, y: 440, w: 800, h: 10, color: C_HAZARD, visible: true },
  ],
  update: (player, platforms, hazards, frameCount) => {
    // TROLL: Platforms blink on/off every 60 frames
    const cycle = 120;
    const t = frameCount % cycle;

    const b1 = platforms.find(p => p.id === 'b1');
    if (b1) b1.visible = t < 60; 

    // b2 (Checkpoint Platform) - Ensure it's visible at t=0 (respawn time)
    // Original was: t >= 40 && t < 100
    // New: Visible from 0 to 60.
    const b2 = platforms.find(p => p.id === 'b2');
    if (b2) b2.visible = t < 60; 

    const b3 = platforms.find(p => p.id === 'b3');
    if (b3) b3.visible = t >= 40 && t < 100; // Shifted b3 instead
    
    // TROLL: Fake goal logic - sinking platform
    const b4 = platforms.find(p => p.id === 'b4');
    if (b4 && player.x > 650 && player.y + player.h <= b4.y + 5) {
       b4.y += 5; 
    }

    return { platforms, hazards };
  }
};