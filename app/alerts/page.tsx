'use client';

import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Check,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertType, AlertPriority, AuditLog } from '@/types/alert';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { mockAlerts, mockAuditLogs } from "@/data/dummy";


const getAlertTypeIcon = (type: AlertType) => {
  const icons = {
    info: <Info className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
  };
  return icons[type];
};

const getAlertTypeColor = (type: AlertType) => {
  const colors = {
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  };
  return colors[type];
};

const getPriorityColor = (priority: AlertPriority) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };
  return colors[priority];
};

export default function AlertsPage() {
  const [alertsPage, setAlertsPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const limit = 20;

  // const { data: alertsData, isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
  //   queryKey: ['alerts', alertsPage, limit],
  //   queryFn: () => alertsApi.getAlerts(alertsPage, limit),
  //   initialData: {
  //     alerts: mockAlerts,
  //     total: mockAlerts.length,
  //     page: 1,
  //     limit: 20,
  //   },
  // });

  const alertsData = { alerts: [...mockAlerts] }

  // const { data: auditData, isLoading: auditLoading } = useQuery({
  //   queryKey: ['audit-logs', auditPage, limit, searchTerm],
  //   queryFn: () => alertsApi.getAuditLogs(auditPage, limit, { search: searchTerm }),
  //   initialData: {
  //     logs: mockAuditLogs,
  //     total: mockAuditLogs.length,
  //     page: 1,
  //     limit: 20,
  //   },
  // });
  const auditData = { logs: [...mockAuditLogs] }

  const handleDismissAlert = async (alertId: string) => {
    try {
      // await alertsApi.dismissAlert(alertId);
      // refetchAlerts();
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      // await alertsApi.resolveAlert(alertId);
      // refetchAlerts();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const handleExecuteAction = async (alertId: string, actionId: string) => {
    try {
      // await alertsApi.executeAlertAction(alertId, actionId);
      // refetchAlerts();
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Alerts & Audit</h1>
              <p className="text-muted-foreground">
                Monitor system alerts and track user activities
              </p>
            </div>
            <Button disabled>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="alerts">Alerts (--)</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              <TableSkeleton 
                title="System Alerts" 
                description="Loading alerts data..."
                rows={4}
                columns={1}
              />
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <TableSkeleton 
                title="Audit Logs" 
                description="Loading audit logs..."
                rows={6}
                columns={1}
              />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Audit</h1>
            <p className="text-muted-foreground">
              Monitor system alerts and track user activities
            </p>
          </div>
          {/* <Button onClick={() => refetchAlerts()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button> */}
        </div>

        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">
              Alerts ({alertsData.alerts.filter(a => a.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Monitor and manage system alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alertsData.alerts.length === 0 ? (
                  <EmptyTable
                    title="No alerts found"
                    description="System alerts and notifications will appear here when they occur."
                    icon={AlertTriangle}
                    showAction={false}
                  />
                ) : (
                  <div className="space-y-4">
                    {alertsData.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getAlertTypeIcon(alert.type)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{alert.title}</h4>
                              <Badge className={getAlertTypeColor(alert.type)}>
                                {alert.type}
                              </Badge>
                              <Badge className={getPriorityColor(alert.priority)}>
                                {alert.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {alert.message}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm')} • {alert.source}
                            </div>
                            {alert.actions && alert.actions.length > 0 && (
                              <div className="flex space-x-2 pt-2">
                                {alert.actions.map((action) => (
                                  <Button
                                    key={action.id}
                                    size="sm"
                                    variant={action.type === 'primary' ? 'default' : 'outline'}
                                    onClick={() => handleExecuteAction(alert.id, action.id)}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {alert.status === 'active' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismissAlert(alert.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  Track all user activities and system changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search audit logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>

                <div className="space-y-3">
                  {auditData.logs.length === 0 ? (
                    <EmptyTable
                      title="No audit logs found"
                      description="User activities and system changes will be tracked here."
                      icon={Eye}
                      showAction={false}
                    />
                  ) : (
                    auditData.logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{log.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.action.replace('_', ' ').toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Modified {log.resource} {log.resourceId}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')} • {log.ipAddress}
                          </div>
                        </div>

                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}