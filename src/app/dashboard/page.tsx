import { Suspense } from "react";
import { DashboardContent } from "@/components/DashboardContent";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-medium">Initializing dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
