import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Package, Users } from "lucide-react";
import Link from "next/link";

export function EmptyDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to SavannahTrail</h1>
          <p className="text-muted-foreground">
            Get started by setting up your tour packages and guides
          </p>
        </div>
      </div>

      {/* Getting Started Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-orange-500" />
              <CardTitle>Create Your First Package</CardTitle>
            </div>
            <CardDescription>
              Start by creating tour packages that customers can book
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Tour packages are the foundation of your business. Define destinations, 
              pricing, and itineraries to attract customers.
            </p>
            <Button asChild>
              <Link href="/packages/new">
                <Package className="mr-2 h-4 w-4" />
                Create Package
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <CardTitle>Add Tour Guides</CardTitle>
            </div>
            <CardDescription>
              Add experienced guides to lead your tours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Professional guides are essential for delivering exceptional tour experiences. 
              Add their profiles, specialties, and availability.
            </p>
            <Button asChild variant="outline">
              <Link href="/guides/new">
                <Users className="mr-2 h-4 w-4" />
                Add Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats - Empty State */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Bookings", value: "0", icon: Calendar },
          { label: "Active Packages", value: "0", icon: Package },
          { label: "Tour Guides", value: "0", icon: Users },
          { label: "Revenue", value: "GHS 0", icon: BarChart3 },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold mt-2">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Complete these steps to get your tour business up and running
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Create tour packages</p>
                <p className="text-sm text-muted-foreground">Define your tour offerings with pricing and itineraries</p>
              </div>
              <Button size="sm" asChild>
                <Link href="/packages">Get Started</Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Add tour guides</p>
                <p className="text-sm text-muted-foreground">Register experienced guides to lead your tours</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/guides">Add Guides</Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Configure settings</p>
                <p className="text-sm text-muted-foreground">Set up payment methods and notification preferences</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/settings">Configure</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}