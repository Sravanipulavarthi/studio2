'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Login Successful',
      description: 'Welcome back to VetConnect!',
    });
    router.push('/dashboard');
  };

  const handleGuestLogin = () => {
    toast({
      title: 'Welcome, Guest!',
      description: 'You are browsing as a guest.',
    });
    router.push('/dashboard');
  };

  const loginImage = PlaceHolderImages.find(p => p.id === 'login-hero');

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <Card className="grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl">
          <div className="relative hidden md:block">
            {loginImage && (
              <Image
                src={loginImage.imageUrl}
                alt={loginImage.description}
                width={600}
                height={800}
                className="h-full w-full object-cover"
                data-ai-hint={loginImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-8 flex flex-col justify-end">
              <h2 className="text-3xl font-bold text-white shadow-lg">
                Your Trusted Partner in Animal Health
              </h2>
              <p className="mt-2 text-white/90 shadow-md">
                Connecting you with expert veterinary care, anytime, anywhere.
              </p>
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <CardHeader className="p-0 mb-6 text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Logo />
                <CardTitle className="text-3xl font-bold tracking-tight">
                  VetConnect
                </CardTitle>
              </div>
              <CardDescription>
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                  {isClient && isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="p-0 mt-6 flex-col gap-4">
               <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button onClick={handleGuestLogin} variant="outline" className="w-full h-12">
                Continue as Guest
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
