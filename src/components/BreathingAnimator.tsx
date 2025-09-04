'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathingPattern = 'box' | 'triangular' | 'default';

interface BreathingAnimatorProps {
  pattern: BreathingPattern;
  isLooping: boolean;
}

const patterns = {
  default: [
    { name: 'Inhale', duration: 4000 },
    { name: 'Exhale', duration: 6000 },
  ],
  box: [
    { name: 'Inhale', duration: 4000 },
    { name: 'Hold', duration: 4000 },
    { name: 'Exhale', duration: 4000 },
    { name: 'Hold', duration: 4000 },
  ],
  triangular: [
    { name: 'Inhale', duration: 4000 },
    { name: 'Hold', duration: 4000 },
    { name: 'Exhale', duration: 4000 },
  ],
};

const SESSION_DURATION = 30000;

export function BreathingAnimator({ pattern, isLooping }: BreathingAnimatorProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const currentPattern = patterns[pattern];
  const currentPhase = currentPattern[phaseIndex];

  useEffect(() => {
    if (!isClient) return;

    const sessionTimeout = setTimeout(() => {
      if (isLooping) {
        setAnimationKey(prev => prev + 1);
        setPhaseIndex(0);
      }
    }, SESSION_DURATION);

    const phaseTimeout = setTimeout(() => {
      setPhaseIndex(prev => (prev + 1) % currentPattern.length);
    }, currentPhase.duration);

    return () => {
      clearTimeout(sessionTimeout);
      clearTimeout(phaseTimeout);
    };
  }, [animationKey, phaseIndex, isClient, currentPattern, currentPhase.duration, isLooping]);

  useEffect(() => {
    if (!isLooping && isClient) {
      setAnimationKey(prev => prev + 1);
      setPhaseIndex(0);
    }
  }, [isLooping, isClient]);

  if (!isClient) {
    return <div className="h-64 w-64" />;
  }

  return (
    <div key={animationKey} className="flex flex-col items-center justify-center text-center text-white">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <motion.div
          className="absolute rounded-full bg-white/20"
          animate={{
            scale: currentPhase.name === 'Inhale' ? 1 : 0.7,
            opacity: currentPhase.name.includes('Hold') ? 0.8 : 1,
          }}
          transition={{ duration: currentPhase.duration / 1000, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%' }}
        />
        <motion.div
          className="absolute rounded-full bg-white/30"
          animate={{
            scale: currentPhase.name === 'Inhale' ? 0.8 : 0.6,
             opacity: currentPhase.name.includes('Hold') ? 0.7 : 0.9,
          }}
          transition={{ duration: currentPhase.duration / 1000, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%' }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="z-10"
          >
            <h2 className="text-4xl font-bold tracking-wider font-headline">
              {currentPhase.name}
            </h2>
            <p className="text-lg">for {currentPhase.duration / 1000} seconds</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
