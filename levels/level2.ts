
import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD, C_LASER, C_GOAL } from '../theme';

export const level2: LevelData = {
  id: 2,
  name: "FIREWALL_BREACH",
  startPos: { x: 50, y: 350 },
  // Goal moved to the end of the expanded level
  goal: { x: 2850, y: 160, w: 40, h: 60 },
  checkpoints: [
    { id: 'start_cp', x: 50, y: 350, w: 20, h: 40, respawnX: 50, respawnY: 350, activated: true },
    { id: 'cp_grid', x: 750, y: 250, w: 20, h: 40, respawnX: 760, respawnY: 250 },
    { id: 'cp_stream', x: 1600, y: 250, w: 20, h: 40, respawnX: 1610, respawnY: 250 },
    { id: 'cp_firewall', x: 2350, y: 300, w: 20, h: 40, respawnX: 2360, respawnY: 300 }
  ],
  platforms: [
    // --- ZONE 1: Intro (0 - 800) ---
    { id: 'p1', type: EntityType.PLATFORM, x: 0, y: 400, w: 300, h: 50, color: C_PLATFORM, visible: true },
    { id: 'p2', type: EntityType.PLATFORM, x: 350, y: 320, w: 100, h: 20, color: C_PLATFORM, visible: true },
    { id: 'p3', type: EntityType.PLATFORM, x: 500, y: 280, w: 200, h: 20, color: C_PLATFORM, visible: true }, // Leading to CP1

    // --- ZONE 2: The Laser Grid (800 - 1600) ---
    { id: 'cp1_plat', type: EntityType.PLATFORM, x: 750, y: 300, w: 100, h: 20, color: C_PLATFORM, visible: true },
    
    // Long floor with lasers
    { id: 'grid_floor', type: EntityType.PLATFORM, x: 900, y: 300, w: 600, h: 20, color: C_PLATFORM, visible: true },
    { id: 'grid_step', type: EntityType.PLATFORM, x: 1520, y: 270, w: 60, h: 20, color: C_PLATFORM, visible: true },

    // --- ZONE 3: Data Stream (Moving Platforms) (1600 - 2400) ---
    { id: 'cp2_plat', type: EntityType.PLATFORM, x: 1600, y: 300, w: 100, h: 20, color: C_PLATFORM, visible: true },
    
    // Moving platforms (positions updated in loop)
    { id: 'move_plat_1', type: EntityType.PLATFORM, x: 1750, y: 280, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'move_plat_2', type: EntityType.PLATFORM, x: 2000, y: 250, w: 80, h: 20, color: C_PLATFORM, visible: true },
    
    // Landing platform (Extended to fill gap from removed block)
    { id: 'cp3_plat', type: EntityType.PLATFORM, x: 2300, y: 350, w: 220, h: 20, color: C_PLATFORM, visible: true },

    // --- ZONE 4: The Firewall (Climb) (2400+) ---
    // User requested removal of climb_1 (the block at 2500)
    
    { id: 'climb_2', type: EntityType.PLATFORM, x: 2650, y: 260, w: 60, h: 20, color: C_PLATFORM, visible: true },
    { id: 'climb_3', type: EntityType.PLATFORM, x: 2550, y: 150, w: 60, h: 20, color: C_PLATFORM, visible: true },
    
    // Goal Platform
    { id: 'final_plat', type: EntityType.PLATFORM, x: 2750, y: 220, w: 250, h: 20, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    // Zone 1: Simple Laser
    { id: 'laser_intro', type: EntityType.HAZARD, x: 420, y: 200, w: 10, h: 120, color: C_LASER, visible: true },

    // Zone 2: The Grid (Three lasers that toggle)
    { id: 'grid_l1', type: EntityType.HAZARD, x: 1000, y: 220, w: 15, h: 80, color: C_LASER, visible: true },
    { id: 'grid_l2', type: EntityType.HAZARD, x: 1200, y: 220, w: 15, h: 80, color: C_LASER, visible: true },
    { id: 'grid_l3', type: EntityType.HAZARD, x: 1400, y: 220, w: 15, h: 80, color: C_LASER, visible: true },

    // Zone 3: Pit & Air Mines
    { id: 'pit_death', type: EntityType.HAZARD, x: 1700, y: 440, w: 600, h: 10, color: C_HAZARD, visible: true },
    { id: 'mine_1', type: EntityType.HAZARD, x: 1880, y: 200, w: 20, h: 20, color: C_HAZARD, visible: true },
    { id: 'mine_2', type: EntityType.HAZARD, x: 2150, y: 180, w: 20, h: 20, color: C_HAZARD, visible: true },

    // Zone 4: The Firewall (Large Vertical Beam)
    { id: 'firewall_beam', type: EntityType.HAZARD, x: 2600, y: 50, w: 20, h: 250, color: C_LASER, visible: true },
  ],
  update: (player, platforms, hazards, frameCount, goal) => {
    // 1. INTRO LASER (Simple Blink)
    const introL = hazards.find(h => h.id === 'laser_intro');
    if (introL) introL.visible = (frameCount % 120) < 60;

    // 2. GRID LASERS (Wave Pattern)
    // 0-60: L1 Off
    // 60-120: L2 Off
    // 120-180: L3 Off
    const cycle = frameCount % 180;
    const l1 = hazards.find(h => h.id === 'grid_l1');
    const l2 = hazards.find(h => h.id === 'grid_l2');
    const l3 = hazards.find(h => h.id === 'grid_l3');

    if (l1) l1.visible = !(cycle < 60);       // Safe 0-60
    if (l2) l2.visible = !(cycle >= 60 && cycle < 120); // Safe 60-120
    if (l3) l3.visible = !(cycle >= 120);     // Safe 120-180

    // 3. MOVING PLATFORMS
    const mp1 = platforms.find(p => p.id === 'move_plat_1');
    if (mp1) {
        // Range 1700 to 1900
        mp1.x = 1700 + 100 + Math.sin(frameCount * 0.03) * 100;
    }

    const mp2 = platforms.find(p => p.id === 'move_plat_2');
    if (mp2) {
        // Range 1950 to 2200
        mp2.x = 1950 + 125 + Math.sin(frameCount * 0.04) * 125;
    }

    // 4. FIREWALL BEAM (Fast Flicker)
    const fw = hazards.find(h => h.id === 'firewall_beam');
    if (fw) {
        // On for 3 sec, off for 1 sec
        // 240 frames total. Off for last 60.
        fw.visible = (frameCount % 240) < 180;
    }

    // 5. TROLL GOAL
    // When player reaches the final platform and gets close to goal
    if (player.x > 2750 && player.x < 2900 && player.y < 250) {
       // If player gets too close to the left side of goal
       if (goal.x === 2850 && player.x > 2800) {
          // Shift goal to the RIGHT edge
          return { platforms, hazards, goal: { ...goal, x: 2950 } };
       }
    }
    
    // Reset goal if player falls off or resets (optional, but good for retries without death)
    if (player.y > 400) {
         return { platforms, hazards, goal: { ...goal, x: 2850 } };
    }

    return { platforms, hazards };
  }
};
