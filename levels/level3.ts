
import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD, C_INVISIBLE, C_GOAL, C_WALL, C_GOLD } from '../theme';
import { CANVAS_HEIGHT } from '../constants';

export const level3: LevelData = {
  id: 3,
  name: "FATAL_EXCEPTION",
  startPos: { x: 50, y: 200 },
  goal: { x: 3200, y: 300, w: 40, h: 60 }, // Moved far right
  checkpoints: [
    { id: 'start_cp', x: 50, y: 200, w: 20, h: 40, respawnX: 50, respawnY: 200, activated: true },
    { id: 'cp1', x: 650, y: 350, w: 20, h: 40, respawnX: 660, respawnY: 350 },
    { id: 'cp_corrupt', x: 1450, y: 250, w: 20, h: 40, respawnX: 1460, respawnY: 250 },
    { id: 'cp_void', x: 2400, y: 300, w: 20, h: 40, respawnX: 2410, respawnY: 300 }
  ],
  platforms: [
    // --- ZONE 1: Intro (Existing but modified) ---
    { id: 'start', type: EntityType.PLATFORM, x: 0, y: 250, w: 150, h: 400, color: C_PLATFORM, visible: true },
    { id: 'middle', type: EntityType.PLATFORM, x: 200, y: 350, w: 350, h: 20, color: C_PLATFORM, visible: true },
    { id: 'end_z1', type: EntityType.PLATFORM, x: 600, y: 400, w: 150, h: 40, color: C_PLATFORM, visible: true }, // CP1 here

    // --- ZONE 2: Corruption (Static platforms now) (800 - 1400) ---
    { id: 'corr_1', type: EntityType.PLATFORM, x: 850, y: 350, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'corr_2', type: EntityType.PLATFORM, x: 1000, y: 300, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'corr_3', type: EntityType.PLATFORM, x: 1150, y: 250, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'corr_4', type: EntityType.PLATFORM, x: 1300, y: 300, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'cp2_plat', type: EntityType.PLATFORM, x: 1450, y: 300, w: 100, h: 20, color: C_PLATFORM, visible: true }, // CP2

    // --- ZONE 3: The Stack Overflow (Vertical Rain Climb) (1600 - 2400) ---
    // Platforms arranged vertically with gaps
    { id: 'stack_1', type: EntityType.PLATFORM, x: 1650, y: 350, w: 100, h: 20, color: C_PLATFORM, visible: true },
    
    // Gold Block Helper
    { id: 'gold_1', type: EntityType.PLATFORM, x: 1750, y: 220, w: 30, h: 30, color: C_GOLD, visible: true },

    { id: 'stack_2', type: EntityType.PLATFORM, x: 1800, y: 350, w: 80, h: 20, color: C_PLATFORM, visible: true },
    
    // Gold Block Helper 2 (Higher)
    { id: 'gold_2', type: EntityType.PLATFORM, x: 1950, y: 150, w: 30, h: 30, color: C_GOLD, visible: true },

    { id: 'stack_3', type: EntityType.PLATFORM, x: 1950, y: 300, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'stack_4', type: EntityType.PLATFORM, x: 2100, y: 280, w: 80, h: 20, color: C_PLATFORM, visible: true },
    
    // Gold Block Helper 3
    { id: 'gold_3', type: EntityType.PLATFORM, x: 2200, y: 100, w: 30, h: 30, color: C_GOLD, visible: true },

    { id: 'stack_5', type: EntityType.PLATFORM, x: 2250, y: 350, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'cp3_plat', type: EntityType.PLATFORM, x: 2400, y: 350, w: 100, h: 20, color: C_PLATFORM, visible: true }, // CP3

    // --- ZONE 4: Null Void & Final Troll (2500 - 3200) ---
    { id: 'void_1', type: EntityType.PLATFORM, x: 2600, y: 350, w: 40, h: 20, color: C_PLATFORM, visible: true },
    
    // Gold Block to cross void
    { id: 'gold_4', type: EntityType.PLATFORM, x: 2675, y: 200, w: 30, h: 30, color: C_GOLD, visible: true },

    { id: 'void_2', type: EntityType.PLATFORM, x: 2750, y: 300, w: 40, h: 20, color: C_PLATFORM, visible: true },
    
    // Gold Block
    { id: 'gold_5', type: EntityType.PLATFORM, x: 2825, y: 200, w: 30, h: 30, color: C_GOLD, visible: true },

    { id: 'void_3', type: EntityType.PLATFORM, x: 2900, y: 350, w: 40, h: 20, color: C_PLATFORM, visible: true },
    
    { id: 'final_plat', type: EntityType.PLATFORM, x: 3050, y: 350, w: 300, h: 50, color: C_PLATFORM, visible: true },

    // Fake platforms
    { id: 'fake_p1', type: EntityType.PLATFORM, x: 1150, y: 150, w: 80, h: 20, color: 'rgba(0,243,255,0.3)', visible: true }, // Ghost platform
  ],
  hazards: [
    // Intro Rain
    { id: 'rain_i1', type: EntityType.HAZARD, x: 250, y: -50, w: 15, h: 30, color: C_HAZARD, visible: true },
    { id: 'rain_i2', type: EntityType.HAZARD, x: 400, y: -150, w: 15, h: 30, color: C_HAZARD, visible: true },
    
    // Invis Wall Intro
    { id: 'invis_wall', type: EntityType.HAZARD, x: 580, y: 300, w: 20, h: 100, color: C_INVISIBLE, visible: true },

    // Zone 2 Hazards (Corruption Spikes)
    { id: 'spike_c1', type: EntityType.HAZARD, x: 920, y: 100, w: 20, h: 20, color: C_HAZARD, visible: true }, // Falling hazard
    { id: 'floor_void', type: EntityType.HAZARD, x: 800, y: 440, w: 800, h: 10, color: C_HAZARD, visible: true },

    // Zone 3 Heavy Rain (Stack Overflow)
    { id: 'rain_s1', type: EntityType.HAZARD, x: 1700, y: -50, w: 20, h: 40, color: C_HAZARD, visible: true },
    // Removed rain_s2 and rain_s3 for difficulty adjustment
    { id: 'rain_s4', type: EntityType.HAZARD, x: 2150, y: -300, w: 20, h: 40, color: C_HAZARD, visible: true },

    // Zone 4 Void Hazards
    { id: 'void_floor', type: EntityType.HAZARD, x: 2500, y: 440, w: 1000, h: 10, color: C_HAZARD, visible: true },
    { id: 'troll_blocker', type: EntityType.HAZARD, x: 3100, y: 250, w: 20, h: 100, color: C_INVISIBLE, visible: true }, // Invisible wall before goal
  ],
  update: (player, platforms, hazards, frameCount, goal) => {
    // 1. RAIN LOGIC (All hazards with 'rain' in ID fall)
    hazards.forEach(h => {
      if (h.id.includes('rain')) {
        // Fall speed
        h.y += 9;
        // Reset if off screen
        if (h.y > CANVAS_HEIGHT) {
            // Increased range for respawn to decrease frequency
            h.y = -100 - Math.random() * 800; 
        }
      }
    });

    // 2. INVISIBLE WALL REVEAL (Intro)
    const wall = hazards.find(h => h.id === 'invis_wall');
    if (wall && player.x > 560 && player.x < 600 && player.y > 280) {
        wall.color = C_HAZARD; 
    }

    // 3. INVISIBLE WALL REVEAL (Final)
    const wallFinal = hazards.find(h => h.id === 'troll_blocker');
    if (wallFinal && player.x > 3080 && player.x < 3120) {
        wallFinal.color = C_HAZARD;
    }

    // 4. JITTER REMOVED - Platforms are now stable

    // 5. GOAL SLIDE (Troll)
    // If player gets close to goal x, goal moves away slightly, then stops
    if (player.x > 3100 && goal.x < 3350) {
         // It slides away to the right
         return { platforms, hazards, goal: { ...goal, x: goal.x + 2 } };
    }

    // 6. FALLING SPIKE (Zone 2)
    const spike = hazards.find(h => h.id === 'spike_c1');
    if (spike && player.x > 850 && player.x < 1000) {
        spike.y += 7;
    }

    return { platforms, hazards, goal };
  }
};
