'use server';

/**
 * @fileOverview Flow for generating mood-based microfiction stories.
 *
 * - generateMicrofiction - A function that generates microfiction based on mood.
 * - GenerateMicrofictionInput - The input type for the generateMicrofiction function.
 * - GenerateMicrofictionOutput - The return type for the generateMicrofiction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicrofictionInputSchema = z.object({
  mood: z.string().describe('The current mood of the user.'),
});
export type GenerateMicrofictionInput = z.infer<typeof GenerateMicrofictionInputSchema>;

const GenerateMicrofictionOutputSchema = z.object({
  story: z.string().describe('A short, mood-based microfiction story.'),
});
export type GenerateMicrofictionOutput = z.infer<typeof GenerateMicrofictionOutputSchema>;

export async function generateMicrofiction(input: GenerateMicrofictionInput): Promise<GenerateMicrofictionOutput> {
  return generateMicrofictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMicrofictionPrompt',
  input: {schema: GenerateMicrofictionInputSchema},
  output: {schema: GenerateMicrofictionOutputSchema},
  prompt: `You are a creative writer specializing in microfiction.

  Write a short story, between 50 and 70 words, based on the following mood: {{{mood}}}. The goal is to enhance the meditative experience with imaginative storytelling.
  `,
});

const generateMicrofictionFlow = ai.defineFlow(
  {
    name: 'generateMicrofictionFlow',
    inputSchema: GenerateMicrofictionInputSchema,
    outputSchema: GenerateMicrofictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
