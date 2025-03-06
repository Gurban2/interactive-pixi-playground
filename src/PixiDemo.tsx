import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Container, Graphics } from '@pixi/react';
import { Graphics as PixiGraphics, Rectangle } from 'pixi.js';
import type { FederatedPointerEvent } from '@pixi/events';

interface Star {
  id: number;
  x: number;
  y: number;
  color: number;
  scale: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: number;
}

interface Triangle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: number;
}

const PixiDemo: React.FC = () => {
  const [position, setPosition] = useState({ x: 400, y: 300 });
  const [color, setColor] = useState(0x00ff00);
  const [stars, setStars] = useState<Star[]>([
    { id: 1, x: 200, y: 150, color: 0xFFFF00, scale: 1 },
    { id: 2, x: 600, y: 150, color: 0xFF00FF, scale: 1 },
    { id: 3, x: 400, y: 450, color: 0x00FFFF, scale: 1 }
  ]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [triangles, setTriangles] = useState<Triangle[]>([
    { id: 1, x: 100, y: 100, rotation: 0, color: 0xFF0000 },
    { id: 2, x: 700, y: 500, rotation: 0, color: 0x00FF00 }
  ]);

  // Анимация частиц и треугольников
  useEffect(() => {
    const interval = setInterval(() => {
      // Обновляем частицы
      setParticles(prevParticles => 
        prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
            vy: p.vy + 0.1 // Гравитация
          }))
          .filter(p => p.life > 0)
      );

      // Вращаем треугольники
      setTriangles(prevTriangles =>
        prevTriangles.map(t => ({
          ...t,
          rotation: t.rotation + 0.02
        }))
      );
    }, 16); // 60 FPS

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((event: FederatedPointerEvent) => {
    if (event.global) {
      const newX = event.global.x;
      const newY = event.global.y;
      
      // Добавляем частицы при движении
      if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
        setParticles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: position.x,
          y: position.y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 2,
          life: 50,
          color: color
        }]);
      }

      setPosition({ x: newX, y: newY });
    }
  }, [position, color]);

  const handleClick = useCallback(() => {
    setColor(Math.floor(Math.random() * 0xffffff));
  }, []);

  const handleStarHover = useCallback((id: number) => {
    setStars(prevStars => 
      prevStars.map(star => 
        star.id === id ? { ...star, scale: 1.5 } : star
      )
    );
  }, []);

  const handleStarLeave = useCallback((id: number) => {
    setStars(prevStars => 
      prevStars.map(star => 
        star.id === id ? { ...star, scale: 1 } : star
      )
    );
  }, []);

  const handleStarClick = useCallback((id: number) => {
    setStars(prevStars => 
      prevStars.map(star => 
        star.id === id ? { ...star, color: Math.floor(Math.random() * 0xffffff) } : star
      )
    );
  }, []);

  const drawBackground = useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(0xffffff, 0);
    g.drawRect(0, 0, 800, 600);
    g.endFill();
    g.hitArea = new Rectangle(0, 0, 800, 600);
  }, []);

  const drawCircle = useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(color);
    g.drawCircle(position.x, position.y, 30);
    g.endFill();
  }, [position, color]);

  const drawParticle = useCallback((g: PixiGraphics, particle: Particle) => {
    g.clear();
    g.beginFill(particle.color, particle.life / 50);
    g.drawCircle(particle.x, particle.y, 3);
    g.endFill();
  }, []);

  const drawTriangle = useCallback((g: PixiGraphics, triangle: Triangle) => {
    g.clear();
    g.beginFill(triangle.color);
    
    const size = 30;
    const points = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) + triangle.rotation;
      points.push(
        triangle.x + Math.cos(angle) * size,
        triangle.y + Math.sin(angle) * size
      );
    }
    
    g.drawPolygon(points);
    g.endFill();
  }, []);

  const drawStar = useCallback((g: PixiGraphics, x: number, y: number, color: number, scale: number) => {
    g.clear();
    g.beginFill(color);
    
    const points = [];
    const spikes = 5;
    const outerRadius = 20 * scale;
    const innerRadius = 10 * scale;
    
    for(let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      points.push(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
      );
    }
    
    g.drawPolygon(points);
    g.endFill();
  }, []);

  return (
    <Stage 
      width={800} 
      height={600} 
      options={{ 
        backgroundColor: 0x000000,
        eventMode: 'static',
        antialias: true
      }}
    >
      <Container eventMode="static">
        <Graphics 
          draw={drawBackground}
          eventMode="static"
          pointermove={handleMouseMove}
          pointerdown={handleClick}
        />
        {particles.map(particle => (
          <Graphics 
            key={particle.id}
            draw={(g) => drawParticle(g, particle)}
          />
        ))}
        {triangles.map(triangle => (
          <Graphics 
            key={triangle.id}
            draw={(g) => drawTriangle(g, triangle)}
          />
        ))}
        <Graphics draw={drawCircle} />
        {stars.map(star => (
          <Graphics 
            key={star.id}
            draw={(g) => drawStar(g, star.x, star.y, star.color, star.scale)}
            eventMode="static"
            pointerover={() => handleStarHover(star.id)}
            pointerout={() => handleStarLeave(star.id)}
            pointerdown={() => handleStarClick(star.id)}
          />
        ))}
      </Container>
    </Stage>
  );
};

export default PixiDemo;
