'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting the rate of spread of future diseases based on historical disease reports.
 *
 * - predictDiseaseSpread - A function that handles the disease spread prediction process.
 * - PredictDiseaseSpreadInput - The input type for the predictDiseaseSpread function.
 * - PredictDiseaseSpreadOutput - The return type for the predictDiseaseSpread function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDiseaseSpreadInputSchema = z.object({
  historicalReports: z
    .string()
    .describe('A string containing historical disease reports data.'),
  animalType: z.string().describe('The type of animal affected by the disease.'),
  diseaseName: z.string().describe('The name of the disease.'),
});
export type PredictDiseaseSpreadInput = z.infer<typeof PredictDiseaseSpreadInputSchema>;

const PredictDiseaseSpreadOutputSchema = z.object({
  predictedSpreadRate: z
    .string()
    .describe('The predicted rate of spread of the disease, including reasoning.'),
});
export type PredictDiseaseSpreadOutput = z.infer<typeof PredictDiseaseSpreadOutputSchema>;

export async function predictDiseaseSpread(input: PredictDiseaseSpreadInput): Promise<PredictDiseaseSpreadOutput> {
  return predictDiseaseSpreadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDiseaseSpreadPrompt',
  input: {schema: PredictDiseaseSpreadInputSchema},
  output: {schema: PredictDiseaseSpreadOutputSchema},
  prompt: `You are an expert in predicting the spread of animal diseases. Analyze the provided historical disease reports for {{animalType}} and {{diseaseName}}, and predict the rate of spread of the disease.

Historical Reports:\n{{{historicalReports}}}

Provide a detailed explanation of your reasoning, including factors considered and any assumptions made. Include the predicted rate of spread as a percentage within the next month.
`,
});

const predictDiseaseSpreadFlow = ai.defineFlow(
  {
    name: 'predictDiseaseSpreadFlow',
    inputSchema: PredictDiseaseSpreadInputSchema,
    outputSchema: PredictDiseaseSpreadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
