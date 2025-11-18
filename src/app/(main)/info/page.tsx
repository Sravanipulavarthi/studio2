'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { diseases, animalTypes } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Search } from 'lucide-react';

export default function InfoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('all');

  const filteredDiseases = diseases.filter(
    (disease) =>
      (disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedAnimal === 'all' || disease.animalType.toLowerCase() === selectedAnimal)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">About VetConnect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                    VetConnect is a modern web application designed to provide immediate veterinary assistance to farmers and pet owners.
                    </p>
                    <p>
                    Our platform leverages technology to bridge the gap between animal caretakers and professional veterinary services, ensuring timely and effective care.
                    </p>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary"/>
                Disease Information Search
              </CardTitle>
              <CardDescription>
                Look up information on common livestock and pet diseases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by disease name or symptom..."
                    className="h-12 pl-10 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                  <SelectTrigger className="h-12 text-base sm:w-[200px]">
                    <SelectValue placeholder="Filter by animal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    {animalTypes.map(animal => (
                        <SelectItem key={animal.value} value={animal.value}>{animal.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredDiseases.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredDiseases.map((disease) => (
                    <AccordionItem key={disease.id} value={disease.id}>
                      <AccordionTrigger className="text-lg">
                        <div className="flex items-center gap-4">
                          <span>{disease.name}</span>
                          <Badge variant="secondary">{disease.animalType}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-base">
                        <p className="text-muted-foreground">{disease.description}</p>
                        <div>
                          <h4 className="font-semibold">Common Symptoms:</h4>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {disease.symptoms.map((symptom, i) => (
                              <li key={i}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                         <div>
                          <h4 className="font-semibold">Treatment:</h4>
                           <p className="text-muted-foreground">{disease.treatment}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No diseases found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
