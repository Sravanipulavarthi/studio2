'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BrainCircuit, Loader2 } from 'lucide-react';

import { predictDiseaseSpread } from '@/ai/flows/predict-disease-spread';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const predictionSchema = z.object({
  diseaseName: z.string().min(1, 'Disease name is required.'),
  animalType: z.string().min(1, 'Animal type is required.'),
  historicalReports: z.string().min(20, 'Please provide more historical data.'),
});

type PredictionFormValues = z.infer<typeof predictionSchema>;

const sampleHistoricalData = `Report 1 (2023-01-15): 5 cases of Avian Influenza in chickens reported in Region A. Mild symptoms, contained locally.
Report 2 (2023-02-10): 20 cases of Avian Influenza in chickens in Region B, adjacent to A. Increased mortality rate.
Report 3 (2023-02-25): 150 cases across three regions (A, B, C). Evidence of rapid transmission between farms.
Report 4 (2023-03-05): 500+ cases. Declared a regional outbreak. Travel restrictions for poultry being considered.`;

export function PredictSpreadCard() {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
        diseaseName: 'Avian Influenza',
        animalType: 'Chicken',
        historicalReports: sampleHistoricalData,
    }
  });

  const handlePrediction = async (data: PredictionFormValues) => {
    setIsPredicting(true);
    setPrediction(null);
    try {
      const result = await predictDiseaseSpread(data);
      setPrediction(result.predictedSpreadRate);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: 'An error occurred while generating the prediction.',
      });
    }
    setIsPredicting(false);
  };

  return (
    <Card className="shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          Predict Disease Spread
        </CardTitle>
        <CardDescription>
          Use AI to predict the spread rate of a disease based on historical data.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handlePrediction)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diseaseName">Disease Name</Label>
            <Input id="diseaseName" {...register('diseaseName')} />
            {errors.diseaseName && <p className="text-sm text-red-500">{errors.diseaseName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="animalType">Animal Type</Label>
            <Input id="animalType" {...register('animalType')} />
            {errors.animalType && <p className="text-sm text-red-500">{errors.animalType.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="historicalReports">Historical Reports</Label>
            <Textarea
              id="historicalReports"
              className="min-h-[150px] font-mono text-xs"
              {...register('historicalReports')}
            />
            {errors.historicalReports && <p className="text-sm text-red-500">{errors.historicalReports.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPredicting}>
            {isPredicting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPredicting ? 'Analyzing...' : 'Generate Prediction'}
          </Button>
        </CardFooter>
      </form>
      {(isPredicting || prediction) && (
        <div className="p-6 pt-0">
          {isPredicting && <SkeletonLoader />}
          {prediction && (
            <Alert>
              <BrainCircuit className="h-4 w-4" />
              <AlertTitle>Prediction Result</AlertTitle>
              <AlertDescription className="mt-2 whitespace-pre-wrap">
                {prediction}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </Card>
  );
}

const SkeletonLoader = () => (
    <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
    </div>
)
