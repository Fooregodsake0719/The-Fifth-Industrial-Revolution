
import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyser) return;
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Color palette: Rusty Amber
        ctx.fillStyle = `rgb(${dataArray[i] + 100}, 140, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
      
      // Mirror the bars for a "symmetrical" look
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    };

    draw();
  }, [analyser]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={100} 
        className="w-full h-24 border-b border-zinc-800"
      />
      <p className="mt-4 text-xs text-zinc-500 uppercase tracking-widest animate-pulse">
        System Processing Voice Stream...
      </p>
    </div>
  );
};

export default Visualizer;
