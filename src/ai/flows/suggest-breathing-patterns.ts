// src/ai/flows/suggest-breathing-patterns.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests suitable breathing patterns based on the user's selected mood.
 *
 * @exports suggestBreathingPatterns - An async function that takes a mood string as input and returns a suggestion for a breathing pattern.
 * @exports SuggestBreathingPatternsInput - The input type for the suggestBreathingPatterns function.
 * @exports SuggestBreathingPatternsOutput - The output type for the suggestBreathingPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBreathingPatternsInputSchema = z.object({
  mood: z.string().describe('The user selected mood (e.g., anxious, tired, energized, reflective).'),
});
export type SuggestBreathingPatternsInput = z.infer<typeof SuggestBreathingPatternsInputSchema>;

const SuggestBreathingPatternsOutputSchema = z.object({
  breathingPattern: z.string().describe('Suggested breathing pattern (e.g., box breathing, triangular breathing) and instructions for the user based on their mood.'),
});
export type SuggestBreathingPatternsOutput = z.infer<typeof SuggestBreathingPatternsOutputSchema>;

export async function suggestBreathingPatterns(input: SuggestBreathingPatternsInput): Promise<SuggestBreathingPatternsOutput> {
  return suggestBreathingPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBreathingPatternsPrompt',
  input: {schema: SuggestBreathingPatternsInputSchema},
  output: {schema: SuggestBreathingPatternsOutputSchema},
  prompt: `Based on the user's mood, suggest a breathing pattern that would be most suitable. Return instructions as well.

Mood: {{{mood}}}

Consider these patterns when formulating your suggestion: box breathing, triangular breathing. Incorporate specific timing for each inhale, exhale, and hold, formatted as "Inhale: [seconds], Hold: [seconds], Exhale: [seconds]". For example: "Box Breathing: Inhale: 4 seconds, Hold: 4 seconds, Exhale: 4 seconds, Hold: 4 seconds. Repeat."
`,
});

const suggestBreathingPatternsFlow = ai.defineFlow(
  {
    name: 'suggestBreathingPatternsFlow',
    inputSchema: SuggestBreathingPatternsInputSchema,
    outputSchema: SuggestBreathingPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
