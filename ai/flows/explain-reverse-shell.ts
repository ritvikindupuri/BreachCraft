'use server';

/**
 * @fileOverview An AI agent that explains reverse shell scripts in a structured format for security analysis.
 *
 * - explainReverseShell - A function that handles the reverse shell explanation process.
 * - ExplainReverseShellInput - The input type for the explainReverseShell function.
 * - ExplainReverseShellOutput - The return type for the explainReverseShell function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainReverseShellInputSchema = z.object({
  reverseShellScript: z
    .string()
    .describe('The reverse shell script to be explained.'),
  targetIp: z.string().describe('The attacker IP used in the script.'),
  targetPort: z.string().describe('The attacker port used in the script.'),
});
export type ExplainReverseShellInput = z.infer<typeof ExplainReverseShellInputSchema>;

const ExplainReverseShellOutputSchema = z.object({
  summary: z.string().describe('A brief, one-sentence summary of the payload\'s purpose.'),
  components: z.array(z.object({
      name: z.string().describe('The name of the script component (e.g., "Network Connection", "Process Execution", "I/O Redirection").'),
      description: z.string().describe('A detailed explanation of what this component does and why it is significant.'),
  })).describe('A breakdown of the individual technical components of the script.'),
  indicatorsOfCompromise: z.object({
      network: z.array(z.string()).describe('A list of specific network-based IOCs a defender could hunt for (e.g., "Outbound TCP traffic to {{targetIp}} on port {{targetPort}}").'),
      host: z.array(z.string()).describe('A list of specific host-based IOCs a defender could hunt for (e.g., "Execution of /bin/sh with -i argument", "Suspicious command line arguments containing base64 strings").'),
  }).describe('A list of actionable Indicators of Compromise (IOCs) that a security analyst could use for threat hunting.'),
  risk: z.string().describe('A brief analysis of the risk and potential impact of a successful execution of this payload on a target system.'),
  riskScore: z.number().min(1).max(10).describe('A numerical risk score from 1 (low) to 10 (critical), representing the payload\'s severity, detectability, and potential impact.'),
});
export type ExplainReverseShellOutput = z.infer<typeof ExplainReverseShellOutputSchema>;

export async function explainReverseShell(input: ExplainReverseShellInput): Promise<ExplainReverseShellOutput> {
  return explainReverseShellFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainReverseShellPrompt',
  input: {schema: ExplainReverseShellInputSchema},
  output: {schema: ExplainReverseShellOutputSchema},
  prompt: `You are a Senior Security Analyst. Your task is to analyze the provided reverse shell script and produce a structured security report.

  Reverse Shell Script:
  \`\`\`
  {{{reverseShellScript}}}
  \`\`\`

  Attacker C2 Details:
  - IP Address: {{{targetIp}}}
  - Port: {{{targetPort}}}

  INSTRUCTIONS:
  1.  **Summary**: Provide a concise, one-sentence summary of what the script does.
  2.  **Component Breakdown**: Analyze the script and break it down into its core technical components (e.g., "Network Connection", "Process Execution", "I/O Redirection"). For each component, explain what that part of the script does and why it's important for the payload to function.
  3.  **Indicators of Compromise (IOCs)**: Based on the script and C2 details, generate specific, actionable IOCs that a defender could use for threat hunting.
      -   **Network IOCs**: Detail the network traffic patterns, including the destination IP and port.
      -   **Host IOCs**: Detail the host-based artifacts, like suspicious process execution, command-line arguments, or file system activity. Be specific.
  4.  **Risk Analysis**: Briefly explain the potential impact if this payload is successfully executed on a target machine.
  5.  **Risk Score**: Based on all analysis, provide a numerical risk score in the 'riskScore' field from 1 (low risk, e.g., a simple, noisy netcat shell) to 10 (critical risk, e.g., an obfuscated, memory-resident, or fileless payload).
  `,
});

const explainReverseShellFlow = ai.defineFlow(
  {
    name: 'generateReverseShellFlow',
    inputSchema: ExplainReverseShellInputSchema,
    outputSchema: ExplainReverseShellOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
