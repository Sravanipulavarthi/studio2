'use client';

import { useState, useEffect } from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { hospitals } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export default function MapView() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(`Error getting location: ${err.message}. Using default location.`);
          setCenter({ lat: 34.052235, lng: -118.243683 }); // Default to LA
        }
      );
    } else {
      setError("Geolocation is not supported by this browser. Using default location.");
      setCenter({ lat: 34.052235, lng: -118.243683 }); // Default to LA
    }
  }, []);

  if (!center) {
    return <Skeleton className="h-[60vh] w-full" />;
  }

  return (
    <>
    {error && (
        <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Location Info</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )}
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={center}
      defaultZoom={11}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={{ lat: hospital.lat, lng: hospital.lng }}
          title={hospital.name}
        />
      ))}
       <Marker
          position={center}
          title={"Your Location"}
        />
    </Map>
    </>
  );
}
