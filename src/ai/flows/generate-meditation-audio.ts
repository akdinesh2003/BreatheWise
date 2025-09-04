'use server';

/**
 * @fileOverview A flow to generate guided meditation audio.
 *
 * - generateMeditationAudio - A function that creates audio for a guided meditation.
 * - GenerateMeditationAudioInput - The input type for the generateMeditationAudio function.
 * - GenerateMeditationAudioOutput - The return type for the generateMeditationAudio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const GenerateMeditationAudioInputSchema = z.object({
  mood: z.string().describe('The current mood of the user (e.g., anxious, tired).'),
  breathingPattern: z.string().describe('The name of the breathing pattern (e.g., box breathing).'),
  patternInstructions: z.string().describe('The instructions for the breathing pattern (e.g., Inhale: 4 seconds, Hold: 4 seconds...).'),
});
export type GenerateMeditationAudioInput = z.infer<typeof GenerateMeditationAudioInputSchema>;

const GenerateMeditationAudioOutputSchema = z.object({
  audio: z.string().describe("A data URI of the generated audio file. It will be a WAV file. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateMeditationAudioOutput = z.infer<typeof GenerateMeditationAudioOutputSchema>;

export async function generateMeditationAudio(input: GenerateMeditationAudioInput): Promise<GenerateMeditationAudioOutput> {
  return generateMeditationAudioFlow(input);
}

const promptTemplate = `Create a short, calming script for a 30-second guided breathing session.
The user is feeling {{mood}}. The breathing exercise is "{{breathingPattern}}".

Instructions:
1. Start with a brief, welcoming sentence that acknowledges the user's mood.
2. Introduce the "{{breathingPattern}}" technique and briefly explain its benefits for their current mood.
3. Clearly state the breathing pattern: "{{patternInstructions}}".
4. Guide them through one full cycle of the pattern, clearly announcing each phase (e.g., "Now, inhale...", "Hold...", "Exhale...").
5. Keep the total script concise, suitable for a text-to-speech generation that will last around 20-25 seconds to fit within the 30-second session time.
`;

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateMeditationAudioFlow = ai.defineFlow(
  {
    name: 'generateMeditationAudioFlow',
    inputSchema: GenerateMeditationAudioInputSchema,
    outputSchema: GenerateMeditationAudioOutputSchema,
  },
  async (input) => {
    // 1. Generate the script
    const { output: scriptOutput } = await ai.generate({
      prompt: promptTemplate,
      context: {
        mood: input.mood,
        breathingPattern: input.breathingPattern,
        patternInstructions: input.patternInstructions,
      },
    });

    const script = scriptOutput.toString();

    // 2. Generate the audio from the script
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: script,
    });

    if (!media) {
      throw new Error('Audio generation failed.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    
    // 3. Convert PCM to WAV
    const wavBase64 = await toWav(audioBuffer);

    return {
      audio: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
