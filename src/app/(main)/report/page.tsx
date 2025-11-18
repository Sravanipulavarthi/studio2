'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Camera, Loader2, Mic, MicOff, Send, Stethoscope, User, X, FilePlus2, CheckCircle } from 'lucide-react';
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
import { addReport } from '@/lib/reports';

const reportSchema = z.object({
  animalType: z.string().min(1, 'Please select an animal type.'),
  symptoms: z.string().min(10, 'Please describe the symptoms in at least 10 characters.'),
  animalImage: z.any().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);


  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const { control, register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  useEffect(() => {
    if (transcript) {
        setValue('symptoms', transcript);
    }
  }, [transcript, setValue]);
  
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
    
    try {
      const newReport = {
          animalType: data.animalType,
          date: new Date().toISOString().split('T')[0],
          assignedDoctor: 'N/A', // Assigned on a different page
          status: 'Pending' as const,
          symptoms: data.symptoms,
          image: imagePreview,
      };
      addReport(newReport);

      toast({
        title: 'Report Submitted Successfully',
        description: `Your report has been created. You can now assign a doctor.`,
      });

      setReportSubmitted(true);

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An error occurred during submission.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReport = () => {
    reset();
    setImagePreview(null);
    setReportSubmitted(false);
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <FilePlus2 className="h-8 w-8 text-primary"/>
            Create Disease Report
          </CardTitle>
          <CardDescription>
            Fill out this form to submit a new disease report. You can get a diagnosis and assign a doctor on separate pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!reportSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Animal Type Selection */}
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

              {/* Symptom Input */}
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
              
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
              <h2 className="text-2xl font-bold">Report Submitted!</h2>
              <p className="text-muted-foreground">
                Your report has been successfully submitted. What would you like to do next?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => router.push('/records')} className="h-12 text-lg">
                    View All Records
                </Button>
                <Button onClick={() => router.push('/doctor-assignment')} variant="outline" className="h-12 text-lg">
                    Assign a Doctor
                </Button>
                 <Button onClick={handleNewReport} variant="secondary" className="h-12 text-lg">
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
