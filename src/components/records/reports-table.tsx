'use client';

import { useEffect, useState } from 'react';
import { getReports } from '@/lib/reports';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Report = {
    id?: string;
    animalType: string;
    date: string;
    assignedDoctor: string;
    status: 'Resolved' | 'Pending' | 'Urgent';
};


export function ReportsTable() {
  const [pastReports, setPastReports] = useState<Report[]>([]);
  
  useEffect(() => {
    setPastReports(getReports());
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Report ID</TableHead>
            <TableHead>Animal</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assigned Vet</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.animalType}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.assignedDoctor}</TableCell>
              <TableCell className="text-right">
                <Badge
                  className={cn({
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': report.status === 'Resolved',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': report.status === 'Pending',
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': report.status === 'Urgent',
                  })}
                >
                  {report.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
