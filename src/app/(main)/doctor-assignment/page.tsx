'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Stethoscope, User, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { doctors } from '@/lib/data';
import { getReports, updateReportDoctor } from '@/lib/reports';
import type { Report } from '@/lib/reports';
import { useRouter } from 'next/navigation';


const assignmentSchema = z.object({
  reportId: z.string().min(1, 'Please select a report.'),
  assignedDoctorId: z.string().min(1, 'Please select a doctor.'),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function DoctorAssignmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentComplete, setAssignmentComplete] = useState(false);

  useEffect(() => {
    setReports(getReports().filter(r => r.status !== 'Resolved'));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
  });

  const onSubmit = async (data: AssignmentFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const doctor = doctors.find(d => d.id === data.assignedDoctorId);
      if (!doctor) throw new Error('Doctor not found');

      updateReportDoctor(data.reportId, doctor.name);
      
      toast({
        title: 'Doctor Assigned!',
        description: `Dr. ${doctor.name} has been assigned to report ${data.reportId}.`,
      });
      setAssignmentComplete(true);

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: 'An error occurred while assigning the doctor.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (assignmentComplete) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Assignment Successful!</h2>
              <p className="text-muted-foreground">
                The selected doctor has been notified.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push('/records')} className="h-12">
                  View All Records
                </Button>
                <Button onClick={() => setAssignmentComplete(false)} variant="outline" className="h-12">
                  Assign Another Doctor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary"/>
            Manual Doctor Assignment
          </CardTitle>
          <CardDescription>
            Choose a pending report and assign a veterinarian for consultation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <label className="text-lg font-semibold">Select Report</label>
              <Controller
                name="reportId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a pending report" />
                    </SelectTrigger>
                    <SelectContent>
                      {reports.length > 0 ? reports.map((report) => (
                        <SelectItem key={report.id} value={report.id!}>
                          {report.id} - {report.animalType} ({report.date})
                        </SelectItem>
                      )) : <p className="p-4 text-sm text-muted-foreground">No pending reports found.</p>}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reportId && <p className="text-sm text-red-500">{errors.reportId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold">Select Doctor</label>
              <Controller
                name="assignedDoctorId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose a doctor" />
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
              {errors.assignedDoctorId && <p className="text-sm text-red-500">{errors.assignedDoctorId.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Stethoscope className="mr-2 h-5 w-5" />}
              {isSubmitting ? 'Assigning...' : 'Assign Doctor'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
