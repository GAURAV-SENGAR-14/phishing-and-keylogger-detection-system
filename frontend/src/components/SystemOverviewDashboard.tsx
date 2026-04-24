import { useNavigate } from '@tanstack/react-router';
import { Shield, AlertTriangle, Search, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SecurityStatusIndicator from './SecurityStatusIndicator';
import { useAllDetections } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ThreatType } from '../backend';

export default function SystemOverviewDashboard() {
  const navigate = useNavigate();
  const { data: detections, isLoading } = useAllDetections();

  const recentDetections = detections?.slice(0, 5) || [];
  const highRiskCount = detections?.filter((d) => d.riskScore >= 70).length || 0;
  const mediumRiskCount = detections?.filter((d) => d.riskScore >= 40 && d.riskScore < 70).length || 0;
  const totalDetections = detections?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Security Overview</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring and threat detection dashboard
          </p>
        </div>
        <img 
          src="/assets/generated/security-shield-logo.dim_256x256.png" 
          alt="Security Shield" 
          className="h-20 w-20 opacity-50"
        />
      </div>

      <SecurityStatusIndicator detections={detections || []} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-threat-high bg-gradient-to-br from-card to-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-destructive">{highRiskCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Risk score ≥ 70</p>
          </CardContent>
        </Card>

        <Card className="border-threat-medium bg-gradient-to-br from-card to-warning/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk Threats</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-warning">{mediumRiskCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Risk score 40-69</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{totalDetections}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/url-analyzer' })}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/phishing-hook-icon.dim_128x128.png" 
                alt="Phishing Detection" 
                className="h-12 w-12"
              />
              <div>
                <CardTitle>URL Phishing Analyzer</CardTitle>
                <CardDescription>Scan URLs for phishing indicators</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze suspicious URLs using pattern matching, domain reputation, and behavioral analysis.
            </p>
            <Button className="w-full" onClick={() => navigate({ to: '/url-analyzer' })}>
              <Search className="mr-2 h-4 w-4" />
              Start URL Analysis
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/process-monitoring' })}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/process-monitoring-icon.dim_128x128.png" 
                alt="Process Monitoring" 
                className="h-12 w-12"
              />
              <div>
                <CardTitle>Process Monitoring</CardTitle>
                <CardDescription>Detect keylogger behavior</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor and analyze process names for suspicious keylogging patterns and behaviors.
            </p>
            <Button className="w-full" onClick={() => navigate({ to: '/process-monitoring' })}>
              <Activity className="mr-2 h-4 w-4" />
              Monitor Processes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/alert-warning-icon.dim_128x128.png" 
              alt="Recent Alerts" 
              className="h-10 w-10"
            />
            <div>
              <CardTitle>Recent Threat Detections</CardTitle>
              <CardDescription>Latest security alerts and findings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentDetections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No threats detected yet. Your system is secure.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDetections.map((detection, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        detection.riskScore >= 70
                          ? 'destructive'
                          : detection.riskScore >= 40
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        detection.riskScore >= 70
                          ? 'bg-destructive'
                          : detection.riskScore >= 40
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-safe text-safe-foreground'
                      }
                    >
                      {detection.threatType === ThreatType.PhishingURL ? 'Phishing' : 'Keylogger'}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{detection.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Number(detection.timestamp) / 1000000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Risk: {Number(detection.riskScore)}</p>
                    <p className="text-xs text-muted-foreground">{detection.detectionMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isLoading && recentDetections.length > 0 && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate({ to: '/security-reports' })}
            >
              View All Reports
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
