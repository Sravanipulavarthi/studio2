'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Camera, Loader2, Mic, MicOff, X, Sparkles, Lightbulb, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { animalTypes } from '@/lib/data';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { diagnoseAnimalHealth, DiagnoseAnimalHealthOutput } from '@/ai/flows/diagnose-animal-health';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const diagnosisSchema = z.object({
  animalType: z.string().min(1, 'Please select an animal type.'),
  symptoms: z.string().min(10, 'Please describe the symptoms in at least 10 characters.'),
  animalImage: z.any().optional(),
});

type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

export default function DiagnosisPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnoseAnimalHealthOutput | null>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const { control, register, handleSubmit, formState: { errors }, setValue, reset } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('animalImage', file);
    }
  };

  const onSubmit = async (data: DiagnosisFormValues) => {
    setIsSubmitting(true);
    setDiagnosis(null);
    
    try {
      const diagnosisResult = await diagnoseAnimalHealth({
        animalType: data.animalType,
        symptoms: data.symptoms,
        photoDataUri: imagePreview || undefined,
      });
      setDiagnosis(diagnosisResult);

      toast({
        title: 'Analysis Complete',
        description: `See AI diagnosis below.`,
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: 'An error occurred during AI analysis.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNewDiagnosis = () => {
    reset();
    setImagePreview(null);
    setDiagnosis(null);
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">AI-Powered Diagnosis</CardTitle>
          <CardDescription>
            Fill out the form below to get an AI-powered preliminary diagnosis for an animal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!diagnosis ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Animal Type</Label>
                <Controller
                  name="animalType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select the type of animal" />
                      </SelectTrigger>
                      <SelectContent>
                        {animalTypes.map((animal) => (
                          <SelectItem key={animal.value} value={animal.value}>
                            {animal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.animalType && <p className="text-sm text-red-500">{errors.animalType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-lg font-semibold">Symptoms</Label>
                <div className="relative">
                  <Textarea
                    id="symptoms"
                    placeholder="e.g., The cow is lethargic, has a high fever, and is not eating..."
                    className="min-h-[150px] text-base pr-12"
                    {...register('symptoms')}
                    defaultValue={transcript}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3"
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>
                {isListening && <p className="text-sm text-primary animate-pulse">Listening...</p>}
                {errors.symptoms && <p className="text-sm text-red-500">{errors.symptoms.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="animalImage" className="text-lg font-semibold">Upload Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center relative">
                    {imagePreview ? (
                      <>
                        <Image src={imagePreview} alt="Animal preview" layout="fill" objectFit="cover" className="rounded-lg"/>
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => {setImagePreview(null); setValue('animalImage', null)}}>
                          <X className="h-4 w-4"/>
                        </Button>
                      </>
                    ) : (
                       <div className="text-center text-muted-foreground">
                        <Camera className="mx-auto h-8 w-8" />
                        <p className="text-sm">Click to upload or use camera</p>
                      </div>
                    )}
                    <Input id="animalImage" type="file" accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Diagnosing...' : 'Get Diagnosis'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="text-xl">AI Diagnosis Complete</AlertTitle>
                <AlertDescription>
                  This is a preliminary analysis. Always consult with a qualified veterinarian.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                        <ShieldCheck className="h-8 w-8 text-primary"/>
                        <CardTitle>Suspected Disease</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{diagnosis.disease}</p>
                        <p className="text-sm text-muted-foreground">Confidence: {diagnosis.confidence}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                        <Lightbulb className="h-8 w-8 text-amber-500"/>
                        <CardTitle>Recommended Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{diagnosis.treatmentPlan}</p>
                    </CardContent>
                </Card>
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={handleNewDiagnosis} variant="outline" className="w-full max-w-sm h-12 text-lg">
                    Start New Diagnosis
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
