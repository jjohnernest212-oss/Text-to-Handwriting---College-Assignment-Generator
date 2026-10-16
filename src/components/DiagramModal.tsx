import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  PenTool,
  Eraser,
  Square,
  Circle,
  Minus,
  MoveRight,
  RotateCcw,
  Upload,
  Check,
  Palette,
} from 'lucide-react';
import { DiagramElement } from '../types';

interface DiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageIndex: number;
  onAddDiagram: (diagram: DiagramElement) => void;
}

type ToolType = 'pen' | 'eraser' | 'line' | 'arrow' | 'rectangle' | 'circle';

export default function DiagramModal({
  isOpen,
  onClose,
  currentPageIndex,
  onAddDiagram,
}: DiagramModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [strokeColor, setStrokeColor] = useState<string>('#002699');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [diagramTitle, setDiagramTitle] = useState<string>('');

  // Setup canvas
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Reset canvas transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Save initial blank state
      const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([blank]);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (activeTool === 'pen' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    if (activeTool === 'pen') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = strokeWidth * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      // For shapes, restore last snapshot to show preview
      if (history.length > 0) {
        ctx.putImageData(history[history.length - 1], 0, 0);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'arrow') {
        drawArrow(ctx, startPos.x, startPos.y, coords.x, coords.y, strokeWidth);
      } else if (activeTool === 'rectangle') {
        ctx.strokeRect(
          startPos.x,
          startPos.y,
          coords.x - startPos.x,
          coords.y - startPos.y
        );
      } else if (activeTool === 'circle') {
        const radiusX = Math.abs(coords.x - startPos.x) / 2;
        const radiusY = Math.abs(coords.y - startPos.y) / 2;
        const centerX = Math.min(startPos.x, coords.x) + radiusX;
        const centerY = Math.min(startPos.y, coords.y) + radiusY;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot to history
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), snapshot]);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    width: number
  ) => {
    const headLength = 14 + width * 1.5;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = strokeColor;
    ctx.fill();
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop();
    const prevSnapshot = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    if (!canvas || !prevSnapshot) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(prevSnapshot, 0, 0);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([blank]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale image to fit reasonably inside canvas maintaining aspect ratio
        const maxW = canvas.width * 0.85;
        const maxH = canvas.height * 0.85;
        let w = img.width;
        let h = img.height;
        if (w > maxW) {
          h = (maxW / w) * h;
          w = maxW;
        }
        if (h > maxH) {
          w = (maxH / h) * w;
          h = maxH;
        }

        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.drawImage(img, x, y, w, h);
        const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory((prev) => [...prev, snapshot]);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveToPage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas has content
    const dataUrl = canvas.toDataURL('image/png');

    const newDiagram: DiagramElement = {
      id: `diag-${Date.now()}`,
      pageIndex: currentPageIndex,
      dataUrl,
      x: 120, // default position on notebook
      y: 200,
      width: 240,
      height: 160,
      title: diagramTitle || `Figure ${Date.now().toString().slice(-3)}`,
    };

    onAddDiagram(newDiagram);
    onClose();
  };

  const colorOptions = [
    { label: 'Blue Ink', hex: '#002699' },
    { label: 'Navy Pen', hex: '#1a365d' },
    { label: 'Black Ink', hex: '#111827' },
    { label: 'Red Pen', hex: '#dc2626' },
    { label: 'Green Pen', hex: '#15803d' },
    { label: 'Pencil Gray', hex: '#4b5563' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between bg-[#121214]">
          <div>
            <h3 className="font-syne text-base font-extrabold uppercase text-white flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#6366f1]" />
              Diagram &amp; Schematic Studio
            </h3>
            <p className="font-mono-code text-[10px] text-[#e4e4e7]/50 uppercase tracking-wider">
              Draw circuits, biology diagrams, or insert schematics for Page {currentPageIndex + 1}
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Toolbar */}
        <div className="px-5 py-2.5 border-b border-[#27272a] bg-[#121214] flex flex-wrap items-center justify-between gap-3 font-mono-code">
          {/* Tools */}
          <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded border border-[#27272a]">
            <button
              onClick={() => setActiveTool('pen')}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1 transition-all ${
                activeTool === 'pen'
                  ? 'bg-[#6366f1] text-white'
                  : 'text-[#e4e4e7]/60 hover:text-white'
              }`}
              title="Freehand Pen"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pen</span>
            </button>

            <button
              onClick={() => setActiveTool('line')}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1 transition-all ${
                activeTool === 'line'
                  ? 'bg-[#6366f1] text-white'
                  : 'text-[#e4e4e7]/60 hover:text-white'
              }`}
              title="Straight Line"
            >
              <Minus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Line</span>
            </button>

            <button
              onClick={() => setActiveTool('arrow')}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1 transition-all ${
                activeTool === 'arrow'
                  ? 'bg-[#6366f1] text-white'
                  : 'text-[#e4e4e7]/60 hover:text-white'
              }`}
              title="Vector Arrow"
            >
              <MoveRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Arrow</span>
            </button>

            <button
              onClick={() => setActiveTool('rectangle')}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1 transition-all ${
                activeTool === 'rectangle'
                  ? 'bg-[#6366f1] text-white'
                  : 'text-[#e4e4e7]/60 hover:text-white'
              }`}
              title="Box / Block"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Box</span>
            </button>

            <button
              onClick={() => setActiveTool('circle')}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1 transition-all ${
                activeTool === 'circle'
                  ? 'bg-[#6366f1] text-white'
                  : 'text-[#e4e4e7]/60 hover:text-white'
              }`}
              title="Circle / Node"
            >
              <Circle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Circle</span>
            </button>

            <button
              onClick={() => setActiveTool('eraser')}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1 transition-all ${
                activeTool === 'eraser'
                  ? 'bg-rose-600 text-white'
                  : 'text-[#e4e4e7]/60 hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Eraser</span>
            </button>
          </div>

          {/* Stroke Colors */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#e4e4e7]/50 uppercase hidden md:inline">Ink:</span>
            {colorOptions.map((c) => (
              <button
                key={c.hex}
                onClick={() => setStrokeColor(c.hex)}
                className={`cursor-pointer w-5 h-5 rounded transition-transform border-2 ${
                  strokeColor === c.hex ? 'scale-115 border-[#6366f1] ring-1 ring-[#6366f1]' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
            <label className="cursor-pointer relative flex items-center justify-center w-5 h-5 rounded border border-[#27272a] bg-[#18181b] hover:border-[#6366f1]" title="Custom Color">
              <Palette className="w-3 h-3 text-[#e4e4e7]/70" />
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>

          {/* Stroke Width Slider & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#e4e4e7]/50 uppercase">Nib:</span>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-16 accent-[#6366f1] cursor-pointer"
              />
              <span className="text-[10px] text-[#6366f1] font-bold">{strokeWidth}px</span>
            </div>

            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="cursor-pointer p-1 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Undo Stroke"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleClear}
              className="cursor-pointer px-2 py-0.5 text-[10px] uppercase text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded font-bold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Drawing Board Area */}
        <div className="p-6 bg-[#0c0c0e] flex-1 flex flex-col items-center justify-center overflow-auto">
          <div className="relative border-2 border-[#27272a] rounded-lg overflow-hidden bg-white shadow-2xl">
            <canvas
              ref={canvasRef}
              width={650}
              height={380}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              className="cursor-crosshair bg-white touch-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between w-full max-w-[650px] font-mono-code text-[11px] text-[#e4e4e7]/50">
            <span>DRAW FREEHAND / SCHEMATIC ABOVE</span>
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-[#6366f1] hover:text-[#818cf8] font-bold uppercase transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Or Upload Diagram / Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#27272a] bg-[#121214] flex items-center justify-between font-mono-code">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Caption (e.g. FIG 1.2 CIRCUIT)"
              value={diagramTitle}
              onChange={(e) => setDiagramTitle(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#18181b] border border-[#27272a] rounded w-60 text-[#e4e4e7] uppercase focus:outline-hidden focus:border-[#6366f1]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="cursor-pointer px-3 py-1.5 text-xs text-[#e4e4e7]/60 hover:text-white rounded uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveToPage}
              className="cursor-pointer px-4 py-1.5 text-xs bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded font-bold uppercase flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Place onto Page {currentPageIndex + 1}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
