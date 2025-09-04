'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Loop } from 'lucide-react';
import { useState } from 'react';

import type { Mood, Theme } from '@/lib/types';
import { BreathingAnimator } from '@/components/BreathingAnimator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const themeData: Record<Theme, { image: string, hint: string }> = {
  ocean: { image: 'https://picsum.photos/1920/1080', hint: 'ocean view' },
  forest: { image: 'https://picsum.photos/1920/1081', hint: 'forest canopy' },
  starlight: { image: 'https://picsum.photos/1920/1082', hint: 'galaxy stars' },
};

const moodPatterns: Record<Mood, 'box' | 'triangular' | 'default'> = {
  anxious: 'box',
  tired: 'default',
  energized: 'triangular',
  reflective: 'box',
};

export default function SessionPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = (searchParams.get('mood') as Mood) || 'anxious';
  const theme = (searchParams.get('theme') as Theme) || 'ocean';
  const [isLooping, setIsLooping] = useState(false);

  const pattern = moodPatterns[mood];
  const { image, hint } = themeData[theme];

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Image
        src={image}
        alt={theme}
        fill
        data-ai-hint={hint}
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <BreathingAnimator pattern={pattern} isLooping={isLooping} />
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-4">
        <div className="flex items-center space-x-2 rounded-full bg-black/30 p-2 pr-4 backdrop-blur-sm">
          <Loop className="h-5 w-5 text-white" />
          <Label htmlFor="loop-switch" className="text-white font-medium">Loop</Label>
          <Switch
            id="loop-switch"
            checked={isLooping}
            onCheckedChange={setIsLooping}
            aria-label="Toggle session looping"
          />
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.push('/')}
          className="rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white backdrop-blur-sm h-11 w-11"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">End Session</span>
        </Button>
      </div>
    </main>
  );
}
