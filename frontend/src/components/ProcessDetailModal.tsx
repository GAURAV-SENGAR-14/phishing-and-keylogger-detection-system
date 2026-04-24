import { AlertTriangle, Shield, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ThreatDetection } from '../backend';
import { ThreatType } from '../backend';

interface ProcessDetailModalProps {
  detection: ThreatDetection;
  open: boolean;
  onClose: () => void;
}

export default function ProcessDetailModal({ detection, open, onClose }: ProcessDetailModalProps) {
  const riskScore = Number(detection.riskScore);
  const isHighRisk = riskScore >= 70;
  const isMediumRisk = riskScore >= 40 && riskScore < 70;

  const recommendations = [
    isHighRisk && 'Immediately terminate this process if confirmed malicious',
    isHighRisk && 'Run a full system antivirus scan',
    isMediumRisk && 'Monitor this process for unusual behavior',
    'Check the process origin and digital signature',
    'Review recent system changes and installations',
    'Consider updating your security software',
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isHighRisk ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Shield className="h-5 w-5 text-warning" />
            )}
            Process Threat Analysis
          </DialogTitle>
          <DialogDescription>Detailed security assessment and recommendations</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border-2 ${
              isHighRisk
                ? 'border-destructive bg-destructive/5'
                : isMediumRisk
                ? 'border-warning bg-warning/5'
                : 'border-safe bg-safe/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Risk Assessment</h3>
              <Badge
                variant={isHighRisk ? 'destructive' : 'default'}
                className={
                  isMediumRisk
                    ? 'bg-warning text-warning-foreground'
                    : !isHighRisk
                    ? 'bg-safe text-safe-foreground'
                    : ''
                }
              >
                Risk Score: {riskScore}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{detection.details}</p>
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Threat Type:</span>
              <span className="font-medium">
                {detection.threatType === ThreatType.Keylogger ? 'Keylogger Process' : 'Phishing URL'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Detection Method:</span>
              <span className="font-medium">{detection.detectionMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Detected:</span>
              <span className="font-medium">
                {new Date(Number(detection.timestamp) / 1000000).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Recommended Actions</h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={onClose} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
