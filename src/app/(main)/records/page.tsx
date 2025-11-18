import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReportsTable } from '@/components/records/reports-table';
import { PredictSpreadCard } from '@/components/records/predict-spread-card';

export default function RecordsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Records Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            View and manage all your past reports.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Past Disease Reports</CardTitle>
                <CardDescription>
                  Here is a list of all reports you have submitted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportsTable />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <PredictSpreadCard />
          </div>
        </div>
      </div>
    </div>
  );
}
