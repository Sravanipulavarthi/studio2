import Link from 'next/link';
import {
  FileText,
  HeartPulse,
  LayoutGrid,
  Map,
  PlusCircle,
  Stethoscope,
  PhoneMissed,
  BookOpen,
  BrainCircuit,
  Syringe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'New Disease Report',
    description: 'Create a new report for an animal showing symptoms.',
    icon: PlusCircle,
    href: '/report',
    cta: 'Create Report',
  },
   {
    title: 'AI Diagnosis',
    description: 'Get a quick AI-powered diagnosis for animal health issues.',
    icon: BrainCircuit,
    href: '/diagnosis',
    cta: 'Get Diagnosis',
  },
  {
    title: 'View Past Records',
    description: 'Access and review all your previous disease reports.',
    icon: LayoutGrid,
    href: '/records',
    cta: 'View Dashboard',
  },
  {
    title: 'Nearby Hospitals',
    description: 'Find veterinary hospitals and clinics near you.',
    icon: Map,
    href: '/hospitals',
    cta: 'Find Hospitals',
  },
  {
    title: 'Disease Lookup',
    description: 'Search our database for information on animal diseases.',
    icon: BookOpen,
    href: '/info',
cta: 'Search Diseases',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <header className="bg-gray-50 dark:bg-gray-900/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to VetConnect
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your all-in-one solution for animal health management.
          </p>
        </div>
      </header>
      <main className="flex-1 bg-white dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary/5 dark:bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <HeartPulse className="w-6 h-6" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-12">
                  <Link href="/report">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Report
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="h-12">
                   <Link href="/records">
                    <LayoutGrid className="mr-2 h-5 w-5" />
                    View My Records
                  </Link>
                </Button>
                 <Button asChild variant="outline" size="lg" className="h-12">
                  <Link href="/diagnosis">
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Get AI Diagnosis
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {features.slice(2).map((feature) => (
              <Card
                key={feature.title}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                       <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <span>{feature.title}</span>
                  </CardTitle>
                  <CardDescription className="pt-2">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href={feature.href}>{feature.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            
             <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-start gap-4">
                    <div className="bg-purple-500/10 p-3 rounded-full">
                       <Syringe className="h-6 w-6 text-purple-500" />
                    </div>
                    <span>Vaccination Reminders</span>
                  </CardTitle>
                  <CardDescription className="pt-2">Manage your livestock and set vaccination reminders.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href="/vaccination-reminders">Set Reminder</Link>
                  </Button>
                </CardContent>
              </Card>

             <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-start gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-full">
                       <Stethoscope className="h-6 w-6 text-blue-500" />
                    </div>
                    <span>Manual Doctor Assignment</span>
                  </CardTitle>
                  <CardDescription className="pt-2">Manually select a veterinarian for consultation or a second opinion.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href="/doctor-assignment">Choose Doctor</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-start gap-4">
                    <div className="bg-orange-500/10 p-3 rounded-full">
                       <PhoneMissed className="h-6 w-6 text-orange-500" />
                    </div>
                    <span>Missed-Call Service</span>
                  </CardTitle>
                  <CardDescription className="pt-2">No smartphone? Give us a missed call and we will get in touch with you.</CardDescription>
                </CardHeader>
                 <CardContent>
                  <Button variant="outline" disabled>Request Call</Button>
                </CardContent>
              </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
