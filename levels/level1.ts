
import { LevelData, EntityType } from '../types';
import { C_PLATFORM, C_HAZARD, C_GOAL, C_INVISIBLE } from '../theme';

export const level1: LevelData = {
  id: 1,
  name: "SYSTEM_INIT",
  startPos: { x: 50, y: 300 },
  // Goal moved further right due to expansion
  goal: { x: 3150, y: 200, w: 40, h: 60 },
  checkpoints: [
    { id: 'start_cp', x: 50, y: 300, w: 20, h: 40, respawnX: 50, respawnY: 300, activated: true },
    { id: 'mid_cp', x: 800, y: 250, w: 20, h: 40, respawnX: 810, respawnY: 250 },
    // Moved high_cp to the end of the new section
    { id: 'high_cp', x: 2350, y: 200, w: 20, h: 40, respawnX: 2360, respawnY: 200 }
  ],
  platforms: [
    // --- ZONE 1: Introduction (0 - 600) ---
    { id: 'floor1', type: EntityType.PLATFORM, x: 0, y: 380, w: 300, h: 70, color: C_PLATFORM, visible: true },
    { id: 'step1', type: EntityType.PLATFORM, x: 350, y: 320, w: 100, h: 20, color: C_PLATFORM, visible: true },
    { id: 'step2', type: EntityType.PLATFORM, x: 500, y: 280, w: 100, h: 20, color: C_PLATFORM, visible: true },
    
    // --- ZONE 2: The Crumbling Bridge & Expanded Gap (600 - 2400) ---
    { id: 'cp1_plat', type: EntityType.PLATFORM, x: 750, y: 300, w: 150, h: 20, color: C_PLATFORM, visible: true },
    
    // Original Safety Blocks
    { id: 'helper_block', type: EntityType.PLATFORM, x: 940, y: 240, w: 40, h: 40, color: C_PLATFORM, visible: true },
    { id: 'safety_block', type: EntityType.PLATFORM, x: 1040, y: 220, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'safety_block_2', type: EntityType.PLATFORM, x: 1200, y: 220, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'safety_block_3', type: EntityType.PLATFORM, x: 1360, y: 220, w: 80, h: 20, color: C_PLATFORM, visible: true },

    // The Troll Bridge (starts falling)
    { id: 'troll_bridge', type: EntityType.PLATFORM, x: 1000, y: 300, w: 400, h: 20, color: C_PLATFORM, visible: true },

    // --- EXPANSION START ---
    // New Platform 1 (Static)
    { id: 'exp_p1', type: EntityType.PLATFORM, x: 1520, y: 220, w: 60, h: 20, color: C_PLATFORM, visible: true },
    
    // New Platform 2 (Blinking/Glitch)
    { id: 'exp_p2_blink', type: EntityType.PLATFORM, x: 1680, y: 250, w: 60, h: 20, color: C_PLATFORM, visible: true },
    
    // New Platform 3 (Static)
    { id: 'exp_p3', type: EntityType.PLATFORM, x: 1840, y: 200, w: 60, h: 20, color: C_PLATFORM, visible: true },

    // New Platform 4 (Moving)
    { id: 'exp_p4_move', type: EntityType.PLATFORM, x: 2000, y: 250, w: 80, h: 20, color: C_PLATFORM, visible: true },

    // New Platform 5 (Static leading to CP)
    { id: 'exp_p5', type: EntityType.PLATFORM, x: 2200, y: 220, w: 60, h: 20, color: C_PLATFORM, visible: true },
    // --- EXPANSION END ---
    
    // --- ZONE 3: Vertical Ascent (Shifted to > 2400) ---
    { id: 'ascend1', type: EntityType.PLATFORM, x: 2350, y: 250, w: 100, h: 20, color: C_PLATFORM, visible: true }, // High CP here
    { id: 'ascend2', type: EntityType.PLATFORM, x: 2600, y: 200, w: 80, h: 20, color: C_PLATFORM, visible: true },
    { id: 'ascend3', type: EntityType.PLATFORM, x: 2800, y: 150, w: 80, h: 20, color: C_PLATFORM, visible: true },
    
    // --- ZONE 4: Final Stretch ---
    { id: 'final_plat', type: EntityType.PLATFORM, x: 3000, y: 260, w: 300, h: 50, color: C_PLATFORM, visible: true },
    
    // Troll block near end
    { id: 'fake_block', type: EntityType.PLATFORM, x: 2900, y: 260, w: 50, h: 20, color: C_PLATFORM, visible: true },
  ],
  hazards: [
    // Zone 1 Spikes
    { id: 'pit_spike1', type: EntityType.HAZARD, x: 300, y: 440, w: 450, h: 10, color: C_HAZARD, visible: true },
    
    // Zone 2 Spikes (Bridge Troll) - Extended length to cover expansion
    { id: 'bridge_spike', type: EntityType.HAZARD, x: 1000, y: 400, w: 1300, h: 50, color: C_HAZARD, visible: true },
    
    // Moving hazard
    { id: 'patrol1', type: EntityType.HAZARD, x: 1000, y: 270, w: 20, h: 20, color: C_HAZARD, visible: true, vx: 3 },
    
    // Zone 3 Rain / Lasers (Shifted)
    { id: 'laser_wall', type: EntityType.HAZARD, x: 2750, y: 100, w: 10, h: 200, color: C_HAZARD, visible: true },
  ],
  update: (player, platforms, hazards, frameCount) => {
    // 1. Manage Projectiles (Move & Cleanup)
    let activeHazards = hazards.filter(h => {
        if (h.id.startsWith('proj_')) {
            h.y += (h.vy || 0);
            return h.y > -50; // Keep if on screen (remove if above)
        }
        return true;
    });

    // 2. Spawn Projectiles from the pit
    // Extended range to 2300 to cover new section
    if (player.x > 1000 && player.x < 2300) {
        // Shoot every 40 frames
        if (frameCount % 40 === 0) {
             activeHazards.push({
                 id: `proj_${frameCount}`,
                 type: EntityType.HAZARD,
                 x: player.x + (Math.random() * 60 - 30), // Target player with some randomness
                 y: 400, // Start from the hazard pit
                 w: 12,
                 h: 12,
                 color: C_HAZARD,
                 visible: true,
                 vy: -6 // Shoot upwards
             });
        }
    }

    // 3. Platform Mechanics in Expansion
    
    // Blinking Platform
    const blinkP = platforms.find(p => p.id === 'exp_p2_blink');
    if (blinkP) {
        // Blink every 60 frames (1 sec approx)
        blinkP.visible = Math.floor(frameCount / 60) % 2 === 0;
    }

    // Moving Platform
    const moveP = platforms.find(p => p.id === 'exp_p4_move');
    if (moveP) {
        // Move back and forth
        moveP.x = 2000 + Math.sin(frameCount * 0.05) * 80;
    }

    // TROLL: Bridge drops when player is on it
    const bridge = platforms.find(p => p.id === 'troll_bridge');
    if (bridge && player.x > 1000 && player.x < 1400) {
       // Slow drop
       bridge.y += 1.5;
       
       // Patrol moves faster
       const patrol = activeHazards.find(h => h.id === 'patrol1');
       if (patrol) patrol.vx = 5; 
    }

    // HAZARD: Patrolling spike on bridge
    const patrol = activeHazards.find(h => h.id === 'patrol1');
    if (patrol) {
      patrol.x += (patrol.vx || 3);
      if (patrol.x > 1380 || patrol.x < 1000) patrol.vx = -(patrol.vx || 3);
    }
    
    // TROLL: Laser wall blink (Shifted position logic)
    const laser = activeHazards.find(h => h.id === 'laser_wall');
    if (laser) {
        // Simple blink based on time
        if (player.x > 2700 && player.x < 2800) {
             laser.visible = Math.floor(Date.now() / 200) % 2 === 0;
        } else {
             laser.visible = true;
        }
    }

    return { platforms, hazards: activeHazards };
  }
};
