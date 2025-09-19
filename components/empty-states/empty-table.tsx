import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyTableProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export function EmptyTable({ 
  title, 
  description, 
  icon: Icon, 
  actionLabel = "Add New", 
  onAction,
  showAction = true 
}: EmptyTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Data Found</CardTitle>
        <CardDescription>Get started by adding your first item</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
          {showAction && onAction && (
            <Button onClick={onAction} className="mt-6">
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}