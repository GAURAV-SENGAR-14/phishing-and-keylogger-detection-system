import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ThreatDetection } from '../backend';

interface SecurityStatusIndicatorProps {
  detections: ThreatDetection[];
}

export default function SecurityStatusIndicator({ detections }: SecurityStatusIndicatorProps) {
  const highRiskCount = detections.filter((d) => d.riskScore >= 70).length;
  const mediumRiskCount = detections.filter((d) => d.riskScore >= 40 && d.riskScore < 70).length;

  let status: 'safe' | 'caution' | 'critical';
  let statusText: string;
  let statusColor: string;
  let Icon: typeof Shield;

  if (highRiskCount > 0) {
    status = 'critical';
    statusText = 'Critical - Immediate Action Required';
    statusColor = 'text-destructive';
    Icon = AlertTriangle;
  } else if (mediumRiskCount > 0) {
    status = 'caution';
    statusText = 'Caution - Review Recommended';
    statusColor = 'text-warning';
    Icon = Shield;
  } else {
    status = 'safe';
    statusText = 'Secure - No Active Threats';
    statusColor = 'text-safe';
    Icon = CheckCircle;
  }

  return (
    <Card
      className={`border-2 ${
        status === 'critical'
          ? 'border-destructive bg-destructive/5'
          : status === 'caution'
          ? 'border-warning bg-warning/5'
          : 'border-safe bg-safe/5'
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-full ${
              status === 'critical'
                ? 'bg-destructive/20'
                : status === 'caution'
                ? 'bg-warning/20'
                : 'bg-safe/20'
            }`}
          >
            <Icon className={`h-8 w-8 ${statusColor}`} />
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${statusColor}`}>{statusText}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {highRiskCount > 0 && `${highRiskCount} high-risk threat${highRiskCount > 1 ? 's' : ''} detected. `}
              {mediumRiskCount > 0 && `${mediumRiskCount} medium-risk threat${mediumRiskCount > 1 ? 's' : ''} detected. `}
              {highRiskCount === 0 && mediumRiskCount === 0 && 'System is operating normally.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
