import { AlertTriangle, CheckCircle, Shield, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { ThreatDetection } from '../backend';
import { ThreatType } from '../backend';

interface ThreatAlertProps {
  detection: ThreatDetection;
  onDismiss?: () => void;
}

export default function ThreatAlert({ detection, onDismiss }: ThreatAlertProps) {
  const riskScore = Number(detection.riskScore);
  const isHighRisk = riskScore >= 70;
  const isMediumRisk = riskScore >= 40 && riskScore < 70;

  const variant = isHighRisk ? 'destructive' : 'default';
  const Icon = isHighRisk ? AlertTriangle : isMediumRisk ? Shield : CheckCircle;

  const recommendations = {
    [ThreatType.PhishingURL]: [
      'Do not enter any personal information on this website',
      'Do not click any links or download files from this URL',
      'Report this URL to your IT security team',
      'Clear your browser cache and cookies',
    ],
    [ThreatType.Keylogger]: [
      'Terminate the suspicious process immediately',
      'Run a full system antivirus scan',
      'Change all passwords from a secure device',
      'Monitor your accounts for unauthorized access',
    ],
  };

  const threatRecommendations = recommendations[detection.threatType] || [];

  return (
    <Alert variant={variant} className={isMediumRisk ? 'border-warning bg-warning/5' : ''}>
      <Icon className={`h-4 w-4 ${isMediumRisk ? 'text-warning' : ''}`} />
      <AlertTitle className="flex items-center justify-between">
        <span>
          {isHighRisk ? 'High Risk Threat Detected' : isMediumRisk ? 'Suspicious Activity Detected' : 'Low Risk Detection'}
        </span>
        {onDismiss && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p className="font-medium">
          {detection.threatType === ThreatType.PhishingURL ? 'Phishing URL' : 'Keylogger Process'} - Risk Score: {riskScore}
        </p>
        {threatRecommendations.length > 0 && (
          <div className="mt-3">
            <p className="font-medium mb-2">Recommended Actions:</p>
            <ul className="space-y-1 text-sm">
              {threatRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
