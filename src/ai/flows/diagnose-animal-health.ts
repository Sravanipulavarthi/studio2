'use server';
/**
 * @fileOverview An animal health diagnosis AI agent.
 *
 * - diagnoseAnimalHealth - A function that handles the animal diagnosis process.
 * - DiagnoseAnimalHealthInput - The input type for the diagnoseAnimalHealth function.
 * - DiagnoseAnimalHealthOutput - The return type for the diagnoseAnimalHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseAnimalHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of an animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  symptoms: z.string().describe("A description of the animal's symptoms."),
  animalType: z.string().describe('The type of animal.'),
});
export type DiagnoseAnimalHealthInput = z.infer<typeof DiagnoseAnimalHealthInputSchema>;

const DiagnoseAnimalHealthOutputSchema = z.object({
  disease: z.string().describe('The suspected disease name.'),
  confidence: z.string().describe('A confidence score (e.g., High, Medium, Low) for the diagnosis.'),
  treatmentPlan: z.string().describe('A recommended treatment plan.'),
});
export type DiagnoseAnimalHealthOutput = z.infer<typeof DiagnoseAnimalHealthOutputSchema>;

export async function diagnoseAnimalHealth(input: DiagnoseAnimalHealthInput): Promise<DiagnoseAnimalHealthOutput> {
  return diagnoseAnimalHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseAnimalHealthPrompt',
  input: {schema: DiagnoseAnimalHealthInputSchema},
  output: {schema: DiagnoseAnimalHealthOutputSchema},
  prompt: `You are an expert veterinary assistant. Your task is to provide a preliminary diagnosis based on the information provided.

Analyze the symptoms and, if available, the photo to identify a potential disease. Provide a confidence level for your diagnosis and suggest a basic treatment plan.

Animal Type: {{animalType}}
Symptoms: {{{symptoms}}}
{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}

IMPORTANT: Your response must be a preliminary diagnosis and for informational purposes only. Always recommend consulting a qualified veterinarian for a definitive diagnosis and treatment. Do not provide a diagnosis that could be harmful if acted upon without professional consultation.
`,
});

const diagnoseAnimalHealthFlow = ai.defineFlow(
  {
    name: 'diagnoseAnimalHealthFlow',
    inputSchema: DiagnoseAnimalHealthInputSchema,
    outputSchema: DiagnoseAnimalHealthOutputSchema,
  },
  async input => {
    if (!input.symptoms && !input.photoDataUri) {
      throw new Error("Symptoms or a photo are required for diagnosis.");
    }
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Unable to get a diagnosis from the model.");
    }
    return output;
  }
);
