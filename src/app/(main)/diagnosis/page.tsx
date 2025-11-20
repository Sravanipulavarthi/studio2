'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Loader2, Mic, MicOff, X, Sparkles, PawPrint, MessageSquare, Bone, ShieldCheck } from 'lucide-react';
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
import { diagnoseAnimalHealth, DiagnoseAnimalHealthOutput, DiagnoseAnimalHealthInput } from '@/ai/flows/diagnose-animal-health';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
  const [submittedData, setSubmittedData] = useState<DiagnoseAnimalHealthInput | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);


  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const { control, register, handleSubmit, formState: { errors }, setValue, reset } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
  });
  
  useEffect(() => {
    if (transcript) {
        setValue('symptoms', transcript);
    }
  }, [transcript, setValue]);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (hasCameraPermission === null) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          // Stop tracks once permission is granted and component unmounts
          return () => {
            stream.getTracks().forEach(track => track.stop());
          };
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      }
    };
    getCameraPermission();
  }, [hasCameraPermission, toast]);


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
    setSubmittedData(null);
    
    try {
      const input: DiagnoseAnimalHealthInput = {
        animalType: data.animalType,
        symptoms: data.symptoms,
      };

      if (imagePreview) {
        input.photoDataUri = imagePreview;
      }
      
      setSubmittedData(input);

      const diagnosisResult = await diagnoseAnimalHealth(input);
      setDiagnosis(diagnosisResult);

      toast({
        title: 'Analysis Complete',
        description: `See AI diagnosis report below.`,
      });

    } catch (error: any) {
      console.error("Diagnosis failed:", error);
      const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded');
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: isOverloaded
          ? 'The AI service is currently busy. Please try again in a moment.'
          : 'An unexpected error occurred. Please check your connection or try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNewDiagnosis = () => {
    reset();
    setImagePreview(null);
    setDiagnosis(null);
    setSubmittedData(null);
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
          {!submittedData ? (
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
                <Label htmlFor="animalImage" className="text-lg font-semibold">Upload Image (Optional)</Label>
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
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                      Please enable camera permissions in your browser settings to use this feature.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Diagnosing...' : 'Get Diagnosis'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
                <Alert variant="destructive">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>
                    This is a preliminary analysis powered by AI. Always consult with a qualified veterinarian for a definitive diagnosis.
                    </AlertDescription>
                </Alert>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">AI Diagnosis Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div>
                            <h3 className="font-semibold text-lg mb-2">Submission Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                <PawPrint className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-semibold">Animal Type</p>
                                    <p className="text-muted-foreground">{submittedData.animalType}</p>
                                </div>
                                </div>
                                <div className="flex items-start gap-4">
                                <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-semibold">Symptoms</p>
                                    <p className="text-muted-foreground">{submittedData.symptoms}</p>
                                </div>
                                </div>
                                {submittedData.photoDataUri && (
                                    <div className="space-y-2">
                                        <p className="font-semibold">Submitted Image</p>
                                        <div className="relative w-full h-48 rounded-md overflow-hidden">
                                        <Image src={submittedData.photoDataUri} alt="Submitted animal" layout="fill" objectFit="cover" />
                                        </div>
                                    </div>
                                )}
                            </div>
                       </div>
                       
                       <Separator />

                       <div>
                            <h3 className="font-semibold text-lg mb-4">AI Analysis</h3>
                             {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2 py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                                    <p className="text-lg">Analyzing...</p>
                                </div>
                            ) : diagnosis ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <ShieldCheck className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <p className="font-semibold">Suspected Disease</p>
                                            <p className="text-lg font-bold">{diagnosis.disease}</p>
                                            <p className="text-sm text-muted-foreground">Confidence: {diagnosis.confidence}</p>
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-4">
                                        <Bone className="h-5 w-5 text-amber-500 mt-1" />
                                        <div>
                                            <p className="font-semibold">Recommended Treatment Plan</p>
                                            <p className="text-muted-foreground">{diagnosis.treatmentPlan}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertTitle>Analysis Failed</AlertTitle>
                                    <AlertDescription>We couldn't generate a diagnosis. Please try again or rephrase your symptoms.</AlertDescription>
                                </Alert>
                            )}
                       </div>
                    </CardContent>
                </Card>

              <div className="flex justify-center gap-4 pt-4">
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
