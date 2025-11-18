'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Bell, Calendar as CalendarIcon, Trash2, Syringe, Rabbit, Bird, Dog } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from '@/hooks/use-toast';
import type { Livestock, Reminder } from '@/lib/livestock';
import { addLivestock, getLivestock, addReminder, getReminders, deleteLivestock } from '@/lib/livestock';
import { animalTypes } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const livestockSchema = z.object({
  name: z.string().min(1, 'Animal name is required.'),
  species: z.string().min(1, 'Species is required.'),
});

const reminderSchema = z.object({
  livestockId: z.string().min(1, 'Please select an animal.'),
  vaccineName: z.string().min(1, 'Vaccine name is required.'),
  reminderDate: z.date({ required_error: "A reminder date is required."}),
});

type LivestockFormValues = z.infer<typeof livestockSchema>;
type ReminderFormValues = z.infer<typeof reminderSchema>;

export default function VaccinationRemindersPage() {
  const { toast } = useToast();
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setLivestock(getLivestock());
    setReminders(getReminders());
  }, []);

  const livestockForm = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockSchema),
  });

  const reminderForm = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
  });

  const handleAddLivestock = (data: LivestockFormValues) => {
    addLivestock(data);
    setLivestock(getLivestock());
    toast({
      title: 'Livestock Added!',
      description: `${data.name} has been added to your list.`,
    });
    livestockForm.reset({name: '', species: ''});
  };
  
  const handleDeleteLivestock = (id: string) => {
    deleteLivestock(id);
    setLivestock(getLivestock());
    setReminders(getReminders());
    toast({
        title: 'Livestock Removed',
        description: 'The animal has been removed from your list.',
        variant: 'destructive'
    });
  }

  const handleSetReminder = (data: ReminderFormValues) => {
    addReminder(data);
    setReminders(getReminders());
    toast({
      title: 'Reminder Set!',
      description: `Vaccination reminder for ${data.vaccineName} has been set.`,
    });
    reminderForm.reset();
  };
  
  const getAnimalName = (id: string) => {
    const animal = livestock.find(l => l.id === id);
    return animal ? `${animal.name} (${animal.species})` : 'Unknown Animal';
  }
  
  const animalIcons: { [key: string]: React.ElementType } = {
      cattle: Syringe,
      poultry: Bird,
      swine: Rabbit, // No pig icon, using rabbit
      sheep_goat: Dog, // No goat icon, using dog
      default: Syringe,
  };


  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Vaccination Reminders</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your livestock and schedule important vaccination reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <PlusCircle className="h-6 w-6 text-primary" />
                Add New Livestock
              </CardTitle>
               <CardDescription>Add and manage your livestock here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={livestockForm.handleSubmit(handleAddLivestock)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="e.g., Lakshmi" {...livestockForm.register('name')} />
                   {livestockForm.formState.errors.name && <p className="text-sm text-red-500">{livestockForm.formState.errors.name.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                   <Controller
                    name="species"
                    control={livestockForm.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                            {animalTypes.map(type => (
                                <SelectItem key={type.value} value={type.label}>{type.label}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    )}
                    />
                  {livestockForm.formState.errors.species && <p className="text-sm text-red-500">{livestockForm.formState.errors.species.message}</p>}
                </div>
                <Button type="submit" className="w-full">Add Livestock</Button>
              </form>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Animals</CardTitle>
            </CardHeader>
            <CardContent>
                {livestock.length === 0 ? (
                    <p className="text-muted-foreground">You haven't added any livestock yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {livestock.map(animal => {
                            const Icon = animalIcons[animal.species.toLowerCase().split(' ')[0]] || animalIcons.default;
                            return (
                                <li key={animal.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-semibold">{animal.name}</p>
                                            <p className="text-sm text-muted-foreground">{animal.species}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLivestock(animal.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500"/>
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Bell className="h-6 w-6 text-primary" />
                Set Vaccination Reminder
              </CardTitle>
              <CardDescription>Schedule vaccination reminders for your animals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={reminderForm.handleSubmit(handleSetReminder)} className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Animal</Label>
                  <Controller
                    name="livestockId"
                    control={reminderForm.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={livestock.length === 0}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an animal..." />
                        </SelectTrigger>
                        <SelectContent>
                          {livestock.map((animal) => (
                            <SelectItem key={animal.id} value={animal.id}>
                              {animal.name} ({animal.species})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {reminderForm.formState.errors.livestockId && <p className="text-sm text-red-500">{reminderForm.formState.errors.livestockId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vaccineName">Vaccine Name</Label>
                  <Input id="vaccineName" placeholder="e.g., Anthrax Vaccine" {...reminderForm.register('vaccineName')} />
                  {reminderForm.formState.errors.vaccineName && <p className="text-sm text-red-500">{reminderForm.formState.errors.vaccineName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Reminder Date</Label>
                   <Controller
                    name="reminderDate"
                    control={reminderForm.control}
                    render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                     )}
                    />
                  {reminderForm.formState.errors.reminderDate && <p className="text-sm text-red-500">{reminderForm.formState.errors.reminderDate.message}</p>}
                </div>
                <Button type="submit" className="w-full">Set Reminder</Button>
              </form>
            </CardContent>
          </Card>
          
           <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Upcoming Reminders</h2>
                {reminders.length === 0 ? (
                    <Alert>
                        <Bell className="h-4 w-4" />
                        <AlertTitle>No reminders yet</AlertTitle>
                        <AlertDescription>You have no upcoming vaccination reminders.</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        {reminders.sort((a,b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()).map(reminder => (
                            <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-bold text-lg">{reminder.vaccineName}</p>
                                    <p className="text-sm text-muted-foreground">{getAnimalName(reminder.livestockId)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{format(new Date(reminder.reminderDate), 'PPP')}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(reminder.reminderDate), 'p')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
