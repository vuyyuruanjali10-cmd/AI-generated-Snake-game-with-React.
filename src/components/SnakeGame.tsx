import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    setGameState('PLAYING');
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        setDirection(nextDirection);

        // Check collisions (walls and self)
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameState('GAME_OVER');
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            if (nextScore > highScore) setHighScore(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [gameState, nextDirection, food, speed, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Background (Subtle)
      ctx.strokeStyle = '#1a1a1f';
      ctx.lineWidth = 0.5;
      const step = canvas.width / GRID_SIZE;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0);
        ctx.lineTo(i * step, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * step);
        ctx.lineTo(canvas.width, i * step);
        ctx.stroke();
      }

      // Draw Snake
      snake.forEach((segment, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#00f3ff' : '#00b8c2';
        ctx.shadowBlur = isHead ? 15 : 5;
        ctx.shadowColor = '#00f3ff';
        
        const x = segment.x * step + 1;
        const y = segment.y * step + 1;
        const size = step - 2;
        
        ctx.fillRect(x, y, size, size);
      });

      // Draw Food
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff00ff';
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(
        food.x * step + step / 2,
        food.y * step + step / 2,
        step / 2 - 4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    draw();
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* HUD */}
      <div className="w-full max-w-[400px] flex justify-between items-end font-mono">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-neon-cyan opacity-70 mb-1">Score</div>
          <div className="text-3xl font-bold tracking-tight text-white">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-neon-magenta opacity-70 mb-1">High Score</div>
          <div className="text-xl font-bold tracking-tight text-white/50 flex items-center justify-end gap-2">
            <Trophy size={14} className="text-neon-magenta" />
            {highScore.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      {/* Main Game Window */}
      <div className="relative group">
        {/* Glow background effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
        
        <div className="relative bg-dark-surface border border-white/10 rounded-lg overflow-hidden backdrop-blur-xl">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="block"
          />

          <AnimatePresence>
            {gameState !== 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm"
              >
                {gameState === 'IDLE' ? (
                  <>
                    <div className="mb-6 border-2 border-neon-cyan px-6 py-2 text-2xl font-bold text-neon-cyan neon-glow-cyan tracking-widest uppercase">
                      Snake Game
                    </div>
                    <h2 className="text-4xl font-bold mb-2 tracking-tighter text-white">NEON SNAKE</h2>
                    <p className="text-gray-400 text-sm mb-8 font-mono">USE ARROW KEYS TO NAVIGATE</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-3 bg-neon-cyan text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                    >
                      <Play fill="currentColor" size={20} />
                      Start Game
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-neon-magenta text-5xl font-black mb-4 tracking-tighter italic">GAME OVER</div>
                    <div className="text-white text-2xl font-mono mb-8">Score: {score}</div>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:scale-105 transition-transform active:scale-95"
                    >
                      <RotateCcw size={20} />
                      Try Again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Controls info */}
      <div className="text-[10px] uppercase font-mono text-white/30 tracking-[0.2em]">
        Move: [Arrow Keys] • Stop: [Esc]
      </div>
    </div>
  );
}
