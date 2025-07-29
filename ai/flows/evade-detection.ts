'use server';

/**
 * @fileOverview An AI agent that attempts to modify a script to evade detection.
 *
 * - evadeDetection - A function that handles the script modification process.
 * - EvadeDetectionInput - The input type for the function.
 * - EvadeDetectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvadeDetectionInputSchema = z.object({
  script: z.string().describe('The script to be modified.'),
  language: z
    .string()
    .describe('The scripting language of the payload (e.g., powershell, bash).'),
});
export type EvadeDetectionInput = z.infer<typeof EvadeDetectionInputSchema>;

const EvadeDetectionOutputSchema = z.object({
  evadedScript: z.string().describe('The modified script designed to evade detection.'),
  explanation: z
    .string()
    .describe('An explanation of the changes made to evade detection, formatted as markdown.'),
});
export type EvadeDetectionOutput = z.infer<typeof EvadeDetectionOutputSchema>;

export async function evadeDetection(
  input: EvadeDetectionInput
): Promise<EvadeDetectionOutput> {
  return evadeDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evadeDetectionPrompt',
  input: {schema: EvadeDetectionInputSchema},
  output: {schema: EvadeDetectionOutputSchema},
  prompt: `You are an expert penetration tester specializing in malware development and evasion techniques. Your task is to analyze the provided script and rewrite it to avoid detection by common security solutions like antivirus (AV) and endpoint detection and response (EDR) systems.

  Script Language: {{{language}}}
  Original Script:
  \`\`\`
  {{{script}}}
  \`\`\`

  INSTRUCTIONS:
  1.  **Analyze for Detection Signatures**: Scrutinize the script for any functions, commands, strings, or patterns that are commonly flagged as malicious (e.g., 'Invoke-Expression', 'IEX', '/bin/bash -i', 'nc -e').
  2.  **Apply Evasion Techniques**: Rewrite the script to be functionally identical but stealthier. Use techniques such as:
      *   **String Obfuscation**: Break up and concatenate suspicious strings.
      *   **Encoding**: Use Base64 or other encodings where appropriate, along with a decoder stub.
      *   **Alternative Syntax**: Use different, less common ways to achieve the same functionality.
      *   **Variable Renaming**: Change variable names to be less descriptive.
      The final output must be a single, executable command or script.
  3.  **Generate Evaded Script**: Provide the full, modified script in the 'evadedScript' field.
  4.  **Explain the Evasion**: In the 'explanation' field, provide a clear, markdown-formatted explanation using bullet points. For each bullet point, detail a specific evasion technique you applied and which part of the original script it corresponds to.

  Ensure the modified script is functionally identical to the original.
  `,
});

const evadeDetectionFlow = ai.defineFlow(
  {
    name: 'evadeDetectionFlow',
    inputSchema: EvadeDetectionInputSchema,
    outputSchema: EvadeDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
