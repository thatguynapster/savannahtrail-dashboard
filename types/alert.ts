export type AlertType = 'info' | 'warning' | 'error' | 'success';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'dismissed' | 'resolved';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  dismissedAt?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
  actions?: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'destructive';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}