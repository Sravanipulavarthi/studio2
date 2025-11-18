'use client';

import { AlertCircle, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { APIProvider } from '@vis.gl/react-google-maps';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MapView from '@/components/hospitals/map-view';
import { hospitals } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function HospitalsPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleGetDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Nearby Veterinary Hospitals</CardTitle>
            <CardDescription>
              Find veterinary hospitals and clinics near your current location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!apiKey || apiKey === "YOUR_API_KEY_HERE" ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Google Maps API Key Missing</AlertTitle>
                <AlertDescription>
                  The map cannot be displayed. Please add your Google Maps API key to the 
                  <code className="mx-1 font-mono bg-muted px-1.5 py-0.5 rounded">.env.local</code> file as{' '}
                  <code className="font-mono bg-muted px-1.5 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.
                  You can get a key from the Google Cloud Console.
                </AlertDescription>
              </Alert>
            ) : (
              <APIProvider apiKey={apiKey}>
                <div className="h-[50vh] w-full rounded-lg overflow-hidden">
                  <MapView />
                </div>
              </APIProvider>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="shadow-lg flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={hospital.image}
                  alt={hospital.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  data-ai-hint="hospital building"
                />
              </div>
              <CardHeader>
                <CardTitle>{hospital.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <MapPin className="h-4 w-4" />
                    {hospital.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {hospital.phone}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild className="w-full">
                  <a href={`tel:${hospital.phone}`}>
                    <Phone className="mr-2 h-4 w-4" /> Call
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGetDirections(hospital.lat, hospital.lng)}
                >
                  <MapPin className="mr-2 h-4 w-4" /> Directions
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
