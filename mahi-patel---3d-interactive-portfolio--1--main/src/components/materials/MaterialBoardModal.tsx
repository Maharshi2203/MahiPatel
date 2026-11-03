import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Sparkles, Layers, Check } from 'lucide-react';
import { MATERIALS_BOARD_DATA, MaterialBoardItem } from '../../data/materialsBoardData';
import { audioHaptics } from '../../utils/audioHaptics';

interface MaterialBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMaterialId?: string;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const MaterialBoardModal: React.FC<MaterialBoardModalProps> = ({
  isOpen,
  onClose,
  selectedMaterialId,
  onCursorChange,
}) => {
  const [activeMaterial, setActiveMaterial] = useState<MaterialBoardItem>(
    MATERIALS_BOARD_DATA[0]
  );
  const [isMuted, setIsMuted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHoveringSwatch, setIsHoveringSwatch] = useState(false);
  const swatchCardRef = useRef<HTMLDivElement>(null);

  // Sync active material with prop when opened from a specific 3D click
  useEffect(() => {
    if (selectedMaterialId) {
      const match = MATERIALS_BOARD_DATA.find((m) => m.id === selectedMaterialId);
      if (match) {
        setActiveMaterial(match);
      }
    }
  }, [selectedMaterialId, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectMaterial = (item: MaterialBoardItem) => {
    setActiveMaterial(item);
    audioHaptics.playMaterialSound(item.soundType);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioHaptics.setMuted(nextMuted);
    if (!nextMuted) {
      audioHaptics.playMaterialSound('metal');
    }
  };

  const handleSwatchPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swatchCardRef.current) return;
    const rect = swatchCardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#141413]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FAF9F5] border border-[#E5E2DA] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* ---------------------------------------------------- */}
            {/* Header Strip                                         */}
            {/* ---------------------------------------------------- */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DA] bg-[#FFFFFF]">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#9A773E] animate-pulse" />
                <div>
                  <h2 className="font-display text-lg md:text-xl font-light text-[#141413] tracking-tight">
                    Pop Up Shop · Materiality & Finishes Board
                  </h2>
                  <p className="font-mono-code text-[11px] text-[#7A7770]">
                    Tactile study · CAD V · Indus University · Mahi Patel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound Haptics Toggle */}
                <button
                  onClick={toggleSound}
                  onMouseEnter={() => onCursorChange?.('link')}
                  onMouseLeave={() => onCursorChange?.('default')}
                  className="p-2 border border-[#E5E2DA] hover:border-[#9A773E] rounded-full text-[#7A7770] hover:text-[#141413] transition-colors bg-[#FAF9F5]"
                  title={isMuted ? 'Unmute Audio Haptics' : 'Mute Audio Haptics'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#9A773E]" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  onMouseEnter={() => onCursorChange?.('link')}
                  onMouseLeave={() => onCursorChange?.('default')}
                  className="p-2 border border-[#E5E2DA] hover:border-[#141413] rounded-full text-[#7A7770] hover:text-[#141413] transition-colors bg-[#FAF9F5]"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Modal Body: Two-column Interactive Tactile Board     */}
            {/* ---------------------------------------------------- */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E2DA]">
              {/* Left Column: Swatch Selection Palette (5 cols) */}
              <div className="lg:col-span-5 p-5 md:p-6 bg-[#FAF9F5]/70 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[11px] text-[#7A7770] uppercase tracking-wider">
                    Material Swatches ({MATERIALS_BOARD_DATA.length})
                  </span>
                  <span className="font-mono-code text-[10px] text-[#9A773E]">
                    Hover to feel resonance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                  {MATERIALS_BOARD_DATA.map((item) => {
                    const isSelected = activeMaterial.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectMaterial(item)}
                        onMouseEnter={() => {
                          audioHaptics.playMaterialSound(item.soundType);
                          onCursorChange?.('link');
                        }}
                        onMouseLeave={() => onCursorChange?.('default')}
                        className={`group relative text-left p-3 rounded-xl border transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-[#FFFFFF] border-[#9A773E] shadow-sm ring-1 ring-[#9A773E]/20'
                            : 'bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] border-[#E8E5DD] hover:border-[#D0CCC2]'
                        }`}
                      >
                        {/* Physical Swatch Pill */}
                        <div
                          className="w-11 h-11 rounded-lg border border-black/10 shadow-inner flex-shrink-0 relative overflow-hidden"
                          style={{
                            backgroundColor: item.hex,
                            backgroundImage: item.secondaryHex
                              ? `linear-gradient(135deg, ${item.hex} 0%, ${item.secondaryHex} 100%)`
                              : undefined,
                          }}
                        >
                          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
                        </div>

                        {/* Text info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-display text-sm font-medium text-[#141413] truncate">
                              {item.name}
                            </span>
                            {isSelected && (
                              <span className="h-4 w-4 rounded-full bg-[#9A773E] text-white flex items-center justify-center flex-shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono-code text-[10px] text-[#9A773E] uppercase tracking-wider">
                              {item.paletteBadge}
                            </span>
                            <span className="text-[#D0CCC2]">·</span>
                            <span className="font-mono-code text-[10px] text-[#7A7770] truncate">
                              {item.textureGrade.relief}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Tactile "Feel the Material" Simulator (7 cols) */}
              <div className="lg:col-span-7 p-6 md:p-8 bg-[#FFFFFF] flex flex-col justify-between gap-6">
                <div className="space-y-6">
                  {/* Top: Active Material Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-code text-[10px] bg-[#9A773E]/10 text-[#9A773E] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                          {activeMaterial.category}
                        </span>
                        <span className="font-mono-code text-[11px] text-[#7A7770]">
                          {activeMaterial.application}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-light text-[#141413] tracking-tight">
                        {activeMaterial.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono-code text-xs text-[#7A7770] bg-[#FAF9F5] px-3 py-1.5 rounded-lg border border-[#E5E2DA] flex-shrink-0">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: activeMaterial.hex }}
                      />
                      <span>{activeMaterial.hex.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* ------------------------------------------------ */}
                  {/* Interactive Dynamic Light Tactile Swatch Disc     */}
                  {/* ------------------------------------------------ */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-code text-[#7A7770]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#9A773E]" />
                        <span>Interactive Tactile Light Simulator</span>
                      </span>
                      <span>Move cursor across surface to feel sheen</span>
                    </div>

                    <div
                      ref={swatchCardRef}
                      onPointerMove={handleSwatchPointerMove}
                      onPointerEnter={() => {
                        setIsHoveringSwatch(true);
                        audioHaptics.playMaterialSound(activeMaterial.soundType);
                      }}
                      onPointerLeave={() => setIsHoveringSwatch(false)}
                      onClick={() => audioHaptics.playMaterialSound(activeMaterial.soundType)}
                      className="relative h-48 md:h-56 w-full rounded-2xl border border-[#E5E2DA] overflow-hidden cursor-crosshair shadow-inner select-none transition-shadow"
                      style={{
                        backgroundColor: activeMaterial.hex,
                      }}
                    >
                      {/* Procedural texture overlay */}
                      <div
                        className="absolute inset-0 mix-blend-overlay opacity-30"
                        style={{
                          backgroundImage:
                            activeMaterial.category === 'Timber'
                              ? 'repeating-linear-gradient(90deg, #000 0px, transparent 2px, #fff 4px, transparent 6px)'
                              : activeMaterial.category === 'Metals'
                              ? 'radial-gradient(ellipse at center, transparent 30%, rgba(255,255,255,0.4) 100%)'
                              : activeMaterial.category === 'Textiles'
                              ? 'repeating-radial-gradient(#000 0 1px, transparent 2px 4px)'
                              : 'radial-gradient(rgba(0,0,0,0.15) 15%, transparent 16%)',
                          backgroundSize:
                            activeMaterial.category === 'Timber'
                              ? '48px 100%'
                              : activeMaterial.category === 'Textiles'
                              ? '6px 6px'
                              : '12px 12px',
                        }}
                      />

                      {/* Dynamic light reflection tracking pointer */}
                      <div
                        className="absolute pointer-events-none transition-opacity duration-200"
                        style={{
                          opacity: isHoveringSwatch ? 0.85 : 0.45,
                          left: `${mousePos.x * 100}%`,
                          top: `${mousePos.y * 100}%`,
                          width: '260px',
                          height: '260px',
                          transform: 'translate(-50%, -50%)',
                          background:
                            activeMaterial.category === 'Metals'
                              ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 30%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 45%, transparent 75%)',
                        }}
                      />

                      {/* Corner badge indicating tactile action */}
                      <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-mono-code tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Tap to sound material</span>
                      </div>
                    </div>
                  </div>

                  {/* ------------------------------------------------ */}
                  {/* Sensory & Tactile Qualities Grid                 */}
                  {/* ------------------------------------------------ */}
                  <div className="space-y-3">
                    <span className="font-mono-code text-[11px] text-[#7A7770] uppercase tracking-wider block">
                      Sensory & Tactile Fingerprint
                    </span>

                    <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD] space-y-2.5">
                      <p className="font-sans text-sm text-[#141413] leading-relaxed">
                        <strong className="text-[#9A773E] font-medium">Tactile Feel: </strong>
                        {activeMaterial.tactileFeel}
                      </p>
                      <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed border-t border-[#E8E5DD] pt-2">
                        <strong className="text-[#141413] font-medium">Macro Grain: </strong>
                        {activeMaterial.macroDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E5DD]">
                        <span className="font-mono-code text-[10px] text-[#7A7770] uppercase block">
                          Surface Relief
                        </span>
                        <span className="font-display text-xs font-medium text-[#141413] mt-1 block truncate">
                          {activeMaterial.textureGrade.relief}
                        </span>
                      </div>

                      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E5DD]">
                        <span className="font-mono-code text-[10px] text-[#7A7770] uppercase block">
                          Light Sheen
                        </span>
                        <span className="font-display text-xs font-medium text-[#141413] mt-1 block truncate">
                          {activeMaterial.textureGrade.sheen}
                        </span>
                      </div>

                      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E5DD]">
                        <span className="font-mono-code text-[10px] text-[#7A7770] uppercase block">
                          Thermal Touch
                        </span>
                        <span className="font-display text-xs font-medium text-[#141413] mt-1 block truncate">
                          {activeMaterial.textureGrade.thermalTouch}
                        </span>
                      </div>

                      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E5DD]">
                        <span className="font-mono-code text-[10px] text-[#7A7770] uppercase block">
                          Acoustics
                        </span>
                        <span className="font-display text-xs font-medium text-[#141413] mt-1 block truncate">
                          {activeMaterial.textureGrade.acousticValue.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Architectural Specifications */}
                  <div className="border-t border-[#E8E5DD] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
                    <div>
                      <span className="text-[#7A7770] block">Provenance:</span>
                      <span className="text-[#141413] mt-0.5 block">{activeMaterial.provenance}</span>
                    </div>
                    <div>
                      <span className="text-[#7A7770] block">Specification Detail:</span>
                      <span className="text-[#141413] mt-0.5 block">{activeMaterial.specs}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Action */}
                <div className="border-t border-[#E8E5DD] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-[#7A7770]">
                    <Layers className="w-3.5 h-3.5 text-[#9A773E]" />
                    <span>Applied to: <strong>{activeMaterial.application}</strong></span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-[11px] font-mono-code text-[#9A773E]">
                      Rotate 3D model in background to infuse colors
                    </span>

                    <button
                      onClick={onClose}
                      onMouseEnter={() => onCursorChange?.('link')}
                      onMouseLeave={() => onCursorChange?.('default')}
                      className="px-5 py-2 bg-[#9A773E] hover:bg-[#856533] text-white rounded-full text-xs font-mono-code transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
