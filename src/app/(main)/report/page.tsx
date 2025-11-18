'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Camera, Loader2, Mic, MicOff, Send, Stethoscope, User, X, Sparkles, Lightbulb, ShieldCheck } from 'lucide-react';
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
import { doctors, animalTypes } from '@/lib/data';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { addReport } from '@/lib/reports';
import { diagnoseAnimalHealth, DiagnoseAnimalHealthOutput } from '@/ai/flows/diagnose-animal-health';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const reportSchema = z.object({
  animalType: z.string().min(1, 'Please select an animal type.'),
  symptoms: z.string().min(10, 'Please describe the symptoms in at least 10 characters.'),
  animalImage: z.any().optional(),
  assignedDoctor: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoAssignedDoctor, setAutoAssignedDoctor] = useState<typeof doctors[0] | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnoseAnimalHealthOutput | null>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const { control, register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });
  
  const selectedAnimalType = watch('animalType');

  const handleAnimalTypeChange = (value: string) => {
    setValue('animalType', value);
    const doctor = doctors.find(d => d.specialty.toLowerCase() === value.toLowerCase()) || doctors[0];
    setAutoAssignedDoctor(doctor);
    setValue('assignedDoctor', doctor.id);
  }

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

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    setDiagnosis(null);
    
    try {
      const diagnosisResult = await diagnoseAnimalHealth({
        animalType: data.animalType,
        symptoms: data.symptoms,
        photoDataUri: imagePreview || undefined,
      });
      setDiagnosis(diagnosisResult);

      const assignedDoctor = doctors.find(d=>d.id === data.assignedDoctor);

      const newReport = {
          animalType: data.animalType,
          date: new Date().toISOString().split('T')[0],
          assignedDoctor: assignedDoctor?.name || 'N/A',
          status: 'Pending',
          symptoms: data.symptoms,
          image: imagePreview,
          diagnosis: diagnosisResult,
      };
      addReport(newReport);

      toast({
        title: 'Report Submitted & Analyzed',
        description: `Dr. ${assignedDoctor?.name || 'N/A'} has been assigned. See AI diagnosis below.`,
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An error occurred during diagnosis or submission.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReport = () => {
    reset();
    setImagePreview(null);
    setDiagnosis(null);
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create Disease Report</CardTitle>
          <CardDescription>
            Fill out the form below to get an AI-powered preliminary diagnosis and report the issue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!diagnosis ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Animal Type Selection */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Animal Type</Label>
                <Controller
                  name="animalType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={handleAnimalTypeChange} defaultValue={field.value}>
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

              {/* Symptom Input */}
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

              {/* Image Upload */}
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

              {/* Doctor Assignment */}
              <div className="space-y-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-4">
                <h3 className="text-lg font-semibold">Veterinarian Assignment</h3>
                  {selectedAnimalType ? (
                    <>
                      <div className="space-y-2">
                        <Label>Auto-assigned Veterinarian</Label>
                        <div className="flex items-center gap-3 rounded-md border bg-background p-3">
                          <Stethoscope className="h-6 w-6 text-primary"/>
                          <div>
                            <p className="font-semibold">{autoAssignedDoctor?.name}</p>
                            <p className="text-sm text-muted-foreground">{autoAssignedDoctor?.specialty} Specialist</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Override Assignment (Optional)</Label>
                        <Controller
                          name="assignedDoctor"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Choose a different doctor" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="flex items-center gap-2 p-2">
                                  <User className="h-4 w-4" />
                                  <span>Available Doctors</span>
                                </div>
                                {doctors.map((doc) => (
                                  <SelectItem key={doc.id} value={doc.id}>
                                    {doc.name} - {doc.specialty}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">Select an animal type to see the auto-assigned veterinarian.</p>
                  )}
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Diagnosing...' : 'Get Diagnosis & Submit'}
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
              <div className="flex justify-between gap-4">
                <Button onClick={() => router.push('/records')} className="w-full h-12 text-lg">
                    View All Records
                </Button>
                <Button onClick={handleNewReport} variant="outline" className="w-full h-12 text-lg">
                    Create Another Report
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
