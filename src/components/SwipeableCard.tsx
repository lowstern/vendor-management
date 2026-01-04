import { useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { Company } from '../types';
import CompanyCard from './CompanyCard';

interface SwipeableCardProps {
  company: Company;
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
  totalCards: number;
  onViewConsultants?: () => void;
  onViewSaaS?: () => void;
  onViewLegal?: () => void;
  onViewContracts?: () => void;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_FACTOR = 0.1;

export default function SwipeableCard({ company, onSwipe, index, totalCards, onViewConsultants, onViewSaaS, onViewLegal, onViewContracts }: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeDistance = info.offset.x;

    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
      const direction = swipeDistance > 0 ? 'right' : 'left';
      onSwipe(direction);
    } else {
      // Spring back to center
      x.set(0);
      rotate.set(0);
    }
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    x.set(info.offset.x);
    rotate.set(info.offset.x * ROTATION_FACTOR);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click events during drag
    if (isDragging) {
      e.stopPropagation();
    }
  };

  if (index > 2) return null; // Only show top 3 cards

  const scale = index === 0 ? 1 : index === 1 ? 0.95 : 0.9;
  const yOffset = index * 10;
  const zIndex = totalCards - index;

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full max-w-md"
      style={{
        x,
        rotate,
        scale,
        y: yOffset,
        zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      whileTap={{ scale: 0.98 }}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <CompanyCard 
          company={company} 
          onViewConsultants={onViewConsultants}
          onViewSaaS={onViewSaaS}
          onViewLegal={onViewLegal}
          onViewContracts={onViewContracts}
        />
      </div>
      
      {/* Swipe indicators */}
      {index === 0 && (
        <>
          <motion.div
            className="absolute top-1/2 left-8 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg"
            style={{
              opacity: x.get() > 50 ? Math.min(x.get() / 100, 1) : 0,
            }}
          >
            ✓ ACCEPT
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-8 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg"
            style={{
              opacity: x.get() < -50 ? Math.min(Math.abs(x.get()) / 100, 1) : 0,
            }}
          >
            ✗ REJECT
          </motion.div>
        </>
      )}
    </motion.div>
  );
}


