import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useURLAnalysis } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import ThreatAlert from './ThreatAlert';
import { ThreatType } from '../backend';

export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const { mutate: analyzeURL, data: result, isPending, reset } = useURLAnalysis();

  const handleAnalyze = () => {
    if (url.trim()) {
      analyzeURL(url);
    }
  };

  const handleNewScan = () => {
    setUrl('');
    reset();
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'Dangerous', color: 'destructive', icon: AlertTriangle };
    if (score >= 40) return { level: 'Suspicious', color: 'warning', icon: Shield };
    return { level: 'Safe', color: 'safe', icon: CheckCircle };
  };

  const riskInfo = result ? getRiskLevel(Number(result.riskScore)) : null;
  const RiskIcon = riskInfo?.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <img 
          src="/assets/generated/phishing-hook-icon.dim_128x128.png" 
          alt="Phishing Detection" 
          className="h-16 w-16"
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">URL Phishing Analyzer</h1>
          <p className="text-muted-foreground mt-2">
            Analyze URLs for phishing indicators and security threats
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter URL to Analyze</CardTitle>
          <CardDescription>
            Submit a URL to check for phishing patterns, suspicious domains, and security risks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              disabled={isPending}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={isPending || !url.trim()}>
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {isPending && (
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {result && !isPending && riskInfo && RiskIcon && (
            <div className="space-y-4 pt-4">
              <ThreatAlert detection={result} onDismiss={handleNewScan} />

              <Card
                className={`border-2 ${
                  riskInfo.color === 'destructive'
                    ? 'border-destructive bg-destructive/5'
                    : riskInfo.color === 'warning'
                    ? 'border-warning bg-warning/5'
                    : 'border-safe bg-safe/5'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        riskInfo.color === 'destructive'
                          ? 'bg-destructive/20'
                          : riskInfo.color === 'warning'
                          ? 'bg-warning/20'
                          : 'bg-safe/20'
                      }`}
                    >
                      <RiskIcon
                        className={`h-6 w-6 ${
                          riskInfo.color === 'destructive'
                            ? 'text-destructive'
                            : riskInfo.color === 'warning'
                            ? 'text-warning'
                            : 'text-safe'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">Threat Level: {riskInfo.level}</h3>
                        <Badge
                          variant={riskInfo.color === 'destructive' ? 'destructive' : 'default'}
                          className={
                            riskInfo.color === 'warning'
                              ? 'bg-warning text-warning-foreground'
                              : riskInfo.color === 'safe'
                              ? 'bg-safe text-safe-foreground'
                              : ''
                          }
                        >
                          Risk Score: {Number(result.riskScore)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{result.details}</p>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Detection Method:</span>
                          <span className="font-medium">{result.detectionMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Threat Type:</span>
                          <span className="font-medium">
                            {result.threatType === ThreatType.PhishingURL ? 'Phishing URL' : 'Keylogger'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Analyzed:</span>
                          <span className="font-medium">
                            {new Date(Number(result.timestamp) / 1000000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleNewScan} variant="outline" className="w-full">
                Analyze Another URL
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">What We Check</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-safe" />
              <span>Suspicious keywords commonly used in phishing attacks (login, verify, secure, account)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-safe" />
              <span>IP-based domains instead of proper domain names</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-safe" />
              <span>Excessive subdomains that may indicate domain spoofing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-safe" />
              <span>Missing HTTPS encryption on sensitive pages</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
