'use client';

import { useState } from 'react';
import type { Mood, Theme } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import {
  BrainCircuit,
  Loader,
  Sparkles,
  Wind,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateMicrofiction } from '@/ai/flows/generate-microfiction';
import { suggestBreathingPatterns } from '@/ai/flows/suggest-breathing-patterns';
import { Logo } from '@/components/icons/logo';

const moods: { name: Mood; emoji: string }[] = [
  { name: 'anxious', emoji: '😟' },
  { name: 'tired', emoji: '😴' },
  { name: 'energized', emoji: '⚡' },
  { name: 'reflective', emoji: '🤔' },
];

const themes: {
  name: Theme;
  label: string;
  image: string;
  hint: string;
}[] = [
  { name: 'ocean', label: 'Ocean Drift', image: 'https://picsum.photos/800/600', hint: 'ocean wave' },
  { name: 'forest', label: 'Forest Pulse', image: 'https://picsum.photos/800/601', hint: 'forest path' },
  { name: 'starlight', label: 'Starlight Flow', image: 'https://picsum.photos/800/602', hint: 'starry night' },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<Mood>('anxious');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('ocean');
  const [fiction, setFiction] = useState('');
  const [isFictionLoading, setIsFictionLoading] = useState(false);
  const [breathingPattern, setBreathingPattern] = useState('');
  const [isBreathingLoading, setIsBreathingLoading] = useState(false);

  const handleGenerateFiction = async () => {
    setIsFictionLoading(true);
    setFiction('');
    try {
      const result = await generateMicrofiction({ mood: selectedMood });
      setFiction(result.story);
    } catch (e) {
      console.error(e);
      setFiction('Could not generate a story. Please try again.');
    } finally {
      setIsFictionLoading(false);
    }
  };

  const handleSuggestBreathing = async () => {
    setIsBreathingLoading(true);
    setBreathingPattern('');
    try {
      const result = await suggestBreathingPatterns({ mood: selectedMood });
      setBreathingPattern(result.breathingPattern);
    } catch (e) {
      console.error(e);
      setBreathingPattern('Could not suggest a pattern. Please try again.');
    } finally {
      setIsBreathingLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="flex items-center gap-2 p-4 sm:p-6">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground font-headline">BreatheWise</h1>
      </header>

      <main className="flex-1 px-4 sm:px-6 pb-12">
        <div className="mx-auto grid max-w-5xl gap-12">
          <section className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight font-headline">
                Create Your ZenFrame
              </h2>
              <p className="text-muted-foreground">
                Select a mood and a theme to begin your personalized meditation
                session.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">1. How are you feeling?</h3>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.name}
                    variant={selectedMood === mood.name ? 'default' : 'outline'}
                    onClick={() => setSelectedMood(mood.name)}
                    className="capitalize"
                  >
                    {mood.emoji} {mood.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">2. Choose your scene</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(theme.name)}
                    className={cn(
                      'relative overflow-hidden rounded-lg border-2 transition-all group',
                      selectedTheme === theme.name
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <Image
                      src={theme.image}
                      alt={theme.label}
                      width={800}
                      height={600}
                      data-ai-hint={theme.hint}
                      className="aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-0 w-full p-4 text-left">
                      <h4 className="font-bold text-white font-headline">{theme.label}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={`/session?mood=${selectedMood}&theme=${selectedTheme}`}
              passHref
            >
              <Button size="lg" className="w-full sm:w-auto">
                Start 30-Second Session <Wind className="ml-2" />
              </Button>
            </Link>
          </section>

          <section className="grid gap-8 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Sparkles className="text-accent" />
                  Microfiction MoodMorph
                </CardTitle>
                <CardDescription>
                  A short, mood-based story to enhance your meditative
                  experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fiction || 'initial'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm min-h-[6rem] rounded-md border bg-muted/50 p-4 italic"
                  >
                    {isFictionLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader className="animate-spin text-primary" />
                      </div>
                    ) : (
                      fiction ||
                      'Click "Generate Story" to get a micro-story based on your mood.'
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={handleGenerateFiction}
                  disabled={isFictionLoading}
                >
                  Generate Story
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <BrainCircuit className="text-accent" />
                  AI Breath Coach
                </CardTitle>
                <CardDescription>
                  Let AI suggest a breathing pattern tailored to your current
                  mood.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={breathingPattern || 'initial'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm min-h-[6rem] rounded-md border bg-muted/50 p-4"
                  >
                    {isBreathingLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader className="animate-spin text-primary" />
                      </div>
                    ) : (
                      breathingPattern ||
                      'Click "Suggest Pattern" to get a recommended breathing exercise.'
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={handleSuggestBreathing}
                  disabled={isBreathingLoading}
                >
                  Suggest Pattern
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
