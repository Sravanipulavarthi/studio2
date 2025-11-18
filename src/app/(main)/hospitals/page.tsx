'use client';

import { AlertCircle } from 'lucide-react';
import { APIProvider } from '@vis.gl/react-google-maps';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MapView from '@/components/hospitals/map-view';

export default function HospitalsPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="container mx-auto px-4 py-12">
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
              <div className="h-[60vh] w-full rounded-lg overflow-hidden">
                <MapView />
              </div>
            </APIProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
