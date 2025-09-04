'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Repeat, Loader, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import type { Mood, Theme } from '@/lib/types';
import { BreathingAnimator } from '@/components/BreathingAnimator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { generateMeditationAudio } from '@/ai/flows/generate-meditation-audio';

const themeData: Record<Theme, { image: string, hint: string }> = {
  ocean: { image: 'https://picsum.photos/1920/1080', hint: 'ocean view' },
  forest: { image: 'https://picsum.photos/1920/1081', hint: 'forest canopy' },
  starlight: { image: 'https://picsum.photos/1920/1082', hint: 'galaxy stars' },
};

const moodPatterns: Record<Mood, { name: 'box' | 'triangular' | 'default', instructions: string }> = {
  anxious: { name: 'box', instructions: 'Inhale: 4s, Hold: 4s, Exhale: 4s, Hold: 4s' },
  tired: { name: 'default', instructions: 'Inhale: 4s, Exhale: 6s' },
  energized: { name: 'triangular', instructions: 'Inhale: 4s, Hold: 4s, Exhale: 4s' },
  reflective: { name: 'box', instructions: 'Inhale: 4s, Hold: 4s, Exhale: 4s, Hold: 4s' },
};

export default function SessionPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = (searchParams.get('mood') as Mood) || 'anxious';
  const theme = (searchParams.get('theme') as Theme) || 'ocean';

  const [isLooping, setIsLooping] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { name: pattern, instructions } = moodPatterns[mood];
  const { image, hint } = themeData[theme];

  useEffect(() => {
    const fetchAudio = async () => {
      setIsAudioLoading(true);
      try {
        const result = await generateMeditationAudio({
          mood,
          breathingPattern: pattern,
          patternInstructions: instructions,
        });
        setAudioData(result.audio);
      } catch (error) {
        console.error('Failed to generate meditation audio:', error);
      } finally {
        setIsAudioLoading(false);
      }
    };

    fetchAudio();
  }, [mood, pattern, instructions]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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

      {audioData && (
        <audio ref={audioRef} src={audioData} autoPlay onEnded={() => {
          if (isLooping && audioRef.current) {
            audioRef.current.play();
          }
        }}/>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <BreathingAnimator pattern={pattern} isLooping={isLooping} />
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-4">
        <div className="flex items-center space-x-2 rounded-full bg-black/30 p-2 pr-4 backdrop-blur-sm">
           <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="rounded-full h-7 w-7 text-white hover:bg-white/20"
            disabled={isAudioLoading}
          >
            {isAudioLoading ? <Loader className="animate-spin" /> : isMuted ? <VolumeX /> : <Volume2 />}
            <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
          </Button>
          <Repeat className="h-5 w-5 text-white" />
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
