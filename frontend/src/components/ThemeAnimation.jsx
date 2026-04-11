import './ThemeAnimation.css';
import React, { useEffect, useRef } from 'react';

const ThemeAnimation = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = theme === 'dark' ? Math.random() * 3 + 1 : Math.random() * 5 + 2;
        this.speed = theme === 'dark' ? Math.random() * 1 + 0.5 : Math.random() * 0.5 + 0.5;
        this.velX = Math.random() * 0.5 - 0.25;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
        // Snow = White, Flowers = Soft Pink/Peach
        this.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 182, 193, 0.6)';
      }

      update() {
        this.y += this.speed;
        this.x += this.velX + Math.sin(this.angle) * 0.5;
        this.angle += this.spin;

        if (this.y > canvas.height) this.reset();
      }

      draw() {
        ctx.beginPath();
        if (theme === 'dark') {
          // Circular Snowflake
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else {
          // Petal Shape (Ellipse)
          ctx.ellipse(this.x, this.y, this.size, this.size / 2, this.angle, 0, Math.PI * 2);
        }
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      particles = Array.from({ length: 50 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-runs whenever theme changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none', // Allows clicks to pass through to buttons
        zIndex: 0,
        opacity: 0.6
      }}
    />
  );
};

export default ThemeAnimation;