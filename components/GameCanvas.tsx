
import React, { useRef, useEffect, useState } from 'react';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  GRAVITY, 
  JUMP_FORCE, 
  MOVE_SPEED, 
  FRICTION,
  MAX_FALL_SPEED
} from '../constants';
import { LEVELS } from '../levels/index';
import { LevelData, Rect } from '../types';
import { RefreshCw, Play, Maximize, Minimize, Pause } from 'lucide-react';
import { C_CHECKPOINT } from '../theme';

interface GameCanvasProps {
  levelId: number;
  onLevelComplete: () => void;
  onBackToMenu: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Trail {
  x: number;
  y: number;
  w: number;
  h: number;
  alpha: number;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  chars: string;
  color: string;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ levelId, onLevelComplete, onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [deathCount, setDeathCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentZone, setCurrentZone] = useState("ZONE_00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Game State Refs
  const levelDataRef = useRef<LevelData>(LEVELS.find(l => l.id === levelId) || LEVELS[0]);
  
  const playerRef = useRef<{
    x: number; y: number; w: number; h: number;
    vx: number; vy: number;
    grounded: boolean;
    dead: boolean;
    color: string;
  }>({
    x: 0, y: 0, w: 30, h: 30,
    vx: 0, vy: 0,
    grounded: false,
    dead: false,
    color: '#ffffff'
  });

  const cameraRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const respawnPointRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const activatedCheckpointsRef = useRef<Set<string>>(new Set());

  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<Trail[]>([]);
  const rainRef = useRef<RainDrop[]>([]);
  const shakeRef = useRef<number>(0);
  const glitchRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const frameCountRef = useRef(0);

  const getGlitchChar = () => {
    // Binary/Hex for hacker theme
    const chars = '01'; 
    return chars[Math.floor(Math.random() * chars.length)];
  };

  // Initialize Rain
  const initRain = () => {
    rainRef.current = [];
    for (let i = 0; i < 80; i++) {
      rainRef.current.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        speed: Math.random() * 10 + 5,
        chars: getGlitchChar(),
        color: Math.random() > 0.8 ? '#00f3ff' : 'rgba(0, 243, 255, 0.3)' // Bright cyan or faint cyan
      });
    }
  };

  // Helper: Spawn Particles
  const spawnParticles = (x: number, y: number, color: string, count: number, speed = 2) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const v = Math.random() * speed;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life: 1.0,
        maxLife: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  };

  const triggerShake = (amount: number) => {
    shakeRef.current = amount;
  };

  const resetLevel = (fullReset: boolean = false) => {
    const originalLevel = LEVELS.find(l => l.id === levelId);
    if (!originalLevel) return;

    // 1. Handle Checkpoint & Respawn Logic
    if (fullReset) {
        // New Level: Clear history
        activatedCheckpointsRef.current.clear();
        respawnPointRef.current = { ...originalLevel.startPos };
        setCurrentZone("ZONE_START");
        cameraRef.current = { x: 0, y: 0 };
        
        // Activate default checkpoints
        if (originalLevel.checkpoints) {
             originalLevel.checkpoints.forEach(cp => {
                 if (cp.activated) activatedCheckpointsRef.current.add(cp.id);
             });
        }
    }

    // 2. Clone Level Data (Manually to preserve functions)
    const newLevelData: LevelData = {
        ...originalLevel,
        platforms: originalLevel.platforms.map(p => ({ ...p })),
        hazards: originalLevel.hazards.map(h => ({ ...h })),
        checkpoints: originalLevel.checkpoints ? originalLevel.checkpoints.map(c => ({ ...c })) : [],
        goal: { ...originalLevel.goal },
        update: originalLevel.update 
    };

    // 3. Restore activated state to the new level objects
    if (newLevelData.checkpoints) {
        newLevelData.checkpoints.forEach(cp => {
            if (activatedCheckpointsRef.current.has(cp.id)) {
                cp.activated = true;
            }
        });
    }

    levelDataRef.current = newLevelData;

    // 4. Reset Player
    const startX = fullReset ? originalLevel.startPos.x : respawnPointRef.current.x;
    const startY = fullReset ? originalLevel.startPos.y : respawnPointRef.current.y;
    
    playerRef.current = {
      x: startX,
      y: startY,
      w: 30, h: 30,
      vx: 0, vy: 0,
      grounded: false,
      dead: false,
      color: '#ffffff'
    };

    // Reset camera to player if partial reset
    if (!fullReset) {
        // Immediate snap
        cameraRef.current.x = Math.max(0, startX - CANVAS_WIDTH * 0.3);
    }

    frameCountRef.current = 0;
    particlesRef.current = [];
    trailRef.current = [];
    shakeRef.current = 0;
    glitchRef.current = 0;
    initRain();
  };

  useEffect(() => {
    resetLevel(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'KeyR') {
        setDeathCount(d => d + 1);
        spawnParticles(playerRef.current.x, playerRef.current.y, '#fff', 20);
        resetLevel(false);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const checkCollision = (r1: Rect, r2: Rect) => {
    return (
      r1.x < r2.x + r2.w &&
      r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h &&
      r1.y + r1.h > r2.y
    );
  };

  const update = () => {
    if (isPaused) return;

    // Shake decay
    if (shakeRef.current > 0) shakeRef.current *= 0.9;
    if (shakeRef.current < 0.5) shakeRef.current = 0;

    // Glitch chance
    if (Math.random() < 0.01) glitchRef.current = Math.random() * 10;
    if (glitchRef.current > 0) glitchRef.current--;

    // Update Rain
    rainRef.current.forEach(d => {
      d.y += d.speed;
      if (d.y > CANVAS_HEIGHT) {
        d.y = -20;
        d.x = Math.random() * CANVAS_WIDTH;
        d.chars = getGlitchChar();
      }
      if (Math.random() < 0.1) d.chars = getGlitchChar();
    });

    // Particles Update
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) particlesRef.current.splice(i, 1);
    }

    if (playerRef.current.dead) return;

    const player = playerRef.current;
    const level = levelDataRef.current;
    frameCountRef.current++;

    // --- CAMERA LOGIC ---
    // Target X: Player position minus some offset (e.g. 30% of screen)
    const targetCamX = player.x - CANVAS_WIDTH * 0.35;
    // Smooth Lerp
    const lerpSpeed = 0.1;
    let nextCamX = cameraRef.current.x + (targetCamX - cameraRef.current.x) * lerpSpeed;
    // Clamp Left (Assuming levels start at 0)
    nextCamX = Math.max(0, nextCamX);
    cameraRef.current.x = nextCamX;
    // --------------------

    // Trail
    if (frameCountRef.current % 3 === 0 && (Math.abs(player.vx) > 1 || Math.abs(player.vy) > 1)) {
       trailRef.current.push({ x: player.x, y: player.y, w: player.w, h: player.h, alpha: 0.5 });
    }
    // Update Trail
    for (let i = trailRef.current.length - 1; i >= 0; i--) {
       trailRef.current[i].alpha -= 0.05;
       if (trailRef.current[i].alpha <= 0) trailRef.current.splice(i, 1);
    }

    // 1. Level Logic
    if (level.update) {
      const { platforms, hazards, goal } = level.update(
        player, 
        level.platforms, 
        level.hazards, 
        frameCountRef.current,
        level.goal
      );
      level.platforms = platforms;
      level.hazards = hazards;
      if (goal) level.goal = goal;
    }

    // 2. Checkpoints
    if (level.checkpoints) {
        for (const cp of level.checkpoints) {
            // Check collision
            if (checkCollision(player, cp)) {
                if (!cp.activated) {
                    cp.activated = true;
                    activatedCheckpointsRef.current.add(cp.id);
                    respawnPointRef.current = { x: cp.respawnX, y: cp.respawnY };
                    setCurrentZone(`ZONE_${cp.id.toUpperCase()}`);
                    spawnParticles(cp.x + cp.w/2, cp.y + cp.h/2, C_CHECKPOINT, 30, 4);
                    triggerShake(5);
                }
            }
        }
    }

    // 3. Gravity
    player.vy += GRAVITY;
    if (player.vy > MAX_FALL_SPEED) player.vy = MAX_FALL_SPEED;

    // 4. Horizontal
    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
      player.vx += 1;
      if (player.vx > MOVE_SPEED) player.vx = MOVE_SPEED;
    } else if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
      player.vx -= 1;
      if (player.vx < -MOVE_SPEED) player.vx = -MOVE_SPEED;
    } else {
      player.vx *= FRICTION;
      if (Math.abs(player.vx) < 0.1) player.vx = 0;
    }

    // 5. Jump
    if ((keysRef.current['Space'] || keysRef.current['ArrowUp'] || keysRef.current['KeyW']) && player.grounded) {
      player.vy = JUMP_FORCE;
      player.grounded = false;
      spawnParticles(player.x + player.w/2, player.y + player.h, '#fff', 5, 1);
    }

    // 6. X Collision
    player.x += player.vx;
    player.grounded = false; 
    
    for (const plat of level.platforms) {
      if (!plat.visible && !plat.hidden) continue; 
      
      const isSolid = plat.visible || plat.id.includes('ceil') || plat.id.includes('invis');
      if (!isSolid) continue;

      if (checkCollision(player, plat)) {
        if (player.vx > 0) {
          player.x = plat.x - player.w;
          player.vx = 0;
        } else if (player.vx < 0) {
          player.x = plat.x + plat.w;
          player.vx = 0;
        }
      }
    }

    // 7. Y Collision
    player.y += player.vy;
    
    if (player.y > CANVAS_HEIGHT + 100) {
      killPlayer();
      return;
    }

    for (const plat of level.platforms) {
      const isSolid = plat.visible || plat.id.includes('ceil') || plat.id.includes('invis');
      if (!isSolid) continue;

      if (checkCollision(player, plat)) {
        if (player.vy > 0) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.grounded = true;
          // Landing particles if hitting hard
          if (player.vy > 10) spawnParticles(player.x + player.w/2, player.y + player.h, '#00f3ff', 8);
        } else if (player.vy < 0) {
          player.y = plat.y + plat.h;
          player.vy = 0;
        }
      }
    }

    // 8. Hazard
    for (const hazard of level.hazards) {
      const hazardHitbox = { 
        x: hazard.x + 6, y: hazard.y + 6, 
        w: hazard.w - 12, h: hazard.h - 12 
      };
      
      if (checkCollision(player, hazardHitbox)) {
         if (hazard.visible) {
             killPlayer();
             return;
         }
      }
    }

    // 9. Goal
    if (checkCollision(player, level.goal)) {
      spawnParticles(player.x, player.y, '#fcee0a', 30, 5);
      onLevelComplete();
    }
  };

  const killPlayer = () => {
    playerRef.current.dead = true;
    setDeathCount(prev => prev + 1);
    spawnParticles(playerRef.current.x + 15, playerRef.current.y + 15, '#ff003c', 20, 4);
    triggerShake(10);
    // Short delay then reset
    setTimeout(() => resetLevel(false), 600);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const camX = cameraRef.current.x;
    
    // Shake transform (applies to world)
    const dx = (Math.random() - 0.5) * shakeRef.current;
    const dy = (Math.random() - 0.5) * shakeRef.current;
    
    // 1. Clear Screen (Screen Space)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 

    // 2. Background Rain (Screen Space - Overlay feel)
    ctx.font = '14px "VT323", monospace';
    rainRef.current.forEach(r => {
        ctx.fillStyle = r.color;
        if (Math.random() > 0.95) ctx.fillStyle = '#fff'; 
        ctx.fillText(r.chars, r.x, r.y);
    });
    
    // 3. World Rendering
    ctx.save();
    // Translate everything by camera position
    ctx.translate(-camX + dx, dy);

    // Grid (World Space - Infinite effect)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Optimize grid drawing to only visible area
    const startGridX = Math.floor(camX / 40) * 40;
    const endGridX = startGridX + CANVAS_WIDTH + 40;
    for(let x=startGridX; x<endGridX; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x, CANVAS_HEIGHT); }
    for(let y=0; y<CANVAS_HEIGHT; y+=40) { ctx.moveTo(camX,y); ctx.lineTo(camX + CANVAS_WIDTH, y); }
    ctx.stroke();

    const level = levelDataRef.current;

    // Glitch background rects (World Space)
    if (glitchRef.current > 0) {
       ctx.fillStyle = `rgba(${Math.random()*255}, 0, ${Math.random()*255}, 0.1)`;
       ctx.fillRect(camX, Math.random()*CANVAS_HEIGHT, CANVAS_WIDTH, Math.random()*50);
    }

    // Draw Checkpoints
    if (level.checkpoints) {
        level.checkpoints.forEach(cp => {
            if (cp.id === 'start_cp') return; 

            ctx.fillStyle = cp.activated ? C_CHECKPOINT : 'rgba(57, 255, 20, 0.2)';
            ctx.shadowBlur = cp.activated ? 20 : 0;
            ctx.shadowColor = C_CHECKPOINT;
            
            ctx.fillRect(cp.x, cp.y, cp.w, cp.h);
            
            if (cp.activated) {
                 ctx.fillStyle = '#fff';
                 ctx.font = '12px "VT323"';
                 ctx.fillText("SAVED", cp.x - 5, cp.y - 10);
            }
            ctx.shadowBlur = 0;
        });
    }

    // Platforms
    level.platforms.forEach(plat => {
      if (!plat.visible && !plat.id.includes('invis') && !plat.id.includes('ceil')) return;
      if (!plat.visible) return;

      // Optimization: Don't draw if off screen
      if (plat.x + plat.w < camX || plat.x > camX + CANVAS_WIDTH) return;

      ctx.shadowBlur = 10;
      ctx.shadowColor = plat.color;
      ctx.fillStyle = plat.color;
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
      ctx.shadowBlur = 0;
      
      // Cyber texture
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      for(let i=0; i<plat.w; i+=10) {
          ctx.moveTo(plat.x + i, plat.y);
          ctx.lineTo(plat.x + i + 5, plat.y + plat.h);
      }
      ctx.stroke();
    });

    // Hazards
    level.hazards.forEach(haz => {
      if (!haz.visible) return; 
      if (haz.x + haz.w < camX || haz.x > camX + CANVAS_WIDTH) return;

      ctx.shadowBlur = 15;
      ctx.shadowColor = haz.color;
      ctx.fillStyle = haz.color;
      
      if (haz.id.includes('laser')) {
         ctx.fillRect(haz.x, haz.y, haz.w, haz.h);
         ctx.fillStyle = '#fff';
         ctx.fillRect(haz.x + 2, haz.y, haz.w - 4, haz.h);
      } else {
         // Spikes
         ctx.fillRect(haz.x, haz.y, haz.w, haz.h);
         ctx.fillStyle = '#fff';
         ctx.globalAlpha = 0.3;
         ctx.beginPath();
         ctx.moveTo(haz.x, haz.y);
         ctx.lineTo(haz.x + haz.w, haz.y);
         ctx.lineTo(haz.x + haz.w/2, haz.y + haz.h);
         ctx.fill();
         ctx.globalAlpha = 1.0;
      }
      ctx.shadowBlur = 0;
    });

    // Goal
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fcee0a';
    ctx.fillStyle = '#fcee0a';
    ctx.fillRect(level.goal.x, level.goal.y, level.goal.w, level.goal.h);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(level.goal.x + 5, level.goal.y + 5, level.goal.w - 10, level.goal.h - 10);
    ctx.fillStyle = '#fff';
    const t = frameCountRef.current;
    const swirlX = level.goal.x + level.goal.w/2 + Math.cos(t*0.1) * 5;
    const swirlY = level.goal.y + level.goal.h/2 + Math.sin(t*0.1) * 10;
    ctx.fillRect(swirlX, swirlY, 4, 4);
    ctx.shadowBlur = 0;

    // Trail
    trailRef.current.forEach(t => {
      ctx.fillStyle = `rgba(0, 243, 255, ${t.alpha})`;
      ctx.fillRect(t.x, t.y, t.w, t.h);
    });

    // Player
    const p = playerRef.current;
    if (!p.dead) {
      // Glitch Player
      const px = p.x + (glitchRef.current > 0 ? (Math.random()-0.5)*10 : 0);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f3ff';
      ctx.fillStyle = '#000';
      ctx.fillRect(px, p.y, p.w, p.h);
      
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(px, p.y, p.w, p.h);

      // Eyes
      ctx.fillStyle = '#fff';
      const eyeOff = (p.vx > 0) ? 12 : (p.vx < 0 ? -4 : 4);
      ctx.fillRect(px + 8 + eyeOff, p.y + 8, 4, 4);
      ctx.fillRect(px + 18 + eyeOff, p.y + 8, 4, 4);
      ctx.shadowBlur = 0;
    }

    // Particles
    particlesRef.current.forEach(pt => {
      ctx.globalAlpha = pt.life;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Restore context for next frame
    ctx.restore();
  };

  const loop = () => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
      {/* Wrapper to maintain aspect ratio and fill screen */}
      <div className="relative w-full aspect-video max-h-full flex flex-col items-center shadow-[0_0_50px_rgba(0,243,255,0.1)]">
        
        {/* HUD Header */}
        <div className="w-full flex justify-between items-center text-[#00f3ff] font-bold text-xl uppercase tracking-widest bg-black/80 p-2 border-b border-[#00f3ff] z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBackToMenu} className="hover:text-white transition-colors"> &lt; MENU</button>
            <div className="flex flex-col items-start leading-none">
              <span>SEC: 0{levelId}</span>
              <span className="text-[10px] text-gray-400">{currentZone}</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[#ff003c] hidden sm:inline">FAILS: {deathCount.toString().padStart(3, '0')}</span>
            
            <button onClick={toggleFullscreen} className="hover:text-white transition-colors" title="Toggle Fullscreen">
               {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            <button onClick={() => setIsPaused(!isPaused)} className="hover:text-white transition-colors" title="Pause">
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button onClick={() => { setDeathCount(d => d+1); killPlayer(); }} className="hover:text-white transition-colors" title="Restart">
              <RefreshCw size={24} />
            </button>
          </div>
        </div>

        {/* Game Container */}
        <div className="relative w-full h-full bg-black border-4 border-[#1a1a1a] border-t-0 overflow-hidden group">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block w-full h-full object-contain cursor-none"
            style={{ imageRendering: 'pixelated' }}
          />
          {/* CRT Overlay Effect */}
          <div className="absolute inset-0 crt-overlay pointer-events-none mix-blend-overlay opacity-50"></div>
          
          {isPaused && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
              <div className="text-center">
                  <h2 className="text-[#00f3ff] text-6xl font-black tracking-widest mb-4">SYSTEM PAUSED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all"
                  >
                    RESUME
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-8 text-gray-500 text-sm font-mono absolute bottom-4 opacity-50 hover:opacity-100 transition-opacity">
        <span>MOVE: WASD / ARROWS</span>
        <span>JUMP: SPACE</span>
        <span>RETRY: R</span>
        <span>FULLSCREEN: F11 / BTN</span>
      </div>
    </div>
  );
};

export default GameCanvas;
