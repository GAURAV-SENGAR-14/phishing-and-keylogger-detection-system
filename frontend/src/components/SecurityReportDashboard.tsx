import { useState } from 'react';
import { FileText, Download, Filter, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllDetections, useDetectionsByType, useDetectionsByRiskScore } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ThreatType } from '../backend';

export default function SecurityReportDashboard() {
  const [filterType, setFilterType] = useState<'all' | 'phishing' | 'keylogger'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium'>('all');

  const { data: allDetections, isLoading: loadingAll } = useAllDetections();
  const { data: phishingDetections, isLoading: loadingPhishing } = useDetectionsByType(ThreatType.PhishingURL);
  const { data: keyloggerDetections, isLoading: loadingKeylogger } = useDetectionsByType(ThreatType.Keylogger);
  const { data: highRiskDetections, isLoading: loadingHighRisk } = useDetectionsByRiskScore(70);

  const isLoading = loadingAll || loadingPhishing || loadingKeylogger || loadingHighRisk;

  const getFilteredDetections = () => {
    let filtered = allDetections || [];

    if (filterType === 'phishing') {
      filtered = phishingDetections || [];
    } else if (filterType === 'keylogger') {
      filtered = keyloggerDetections || [];
    }

    if (filterRisk === 'high') {
      filtered = filtered.filter((d) => d.riskScore >= 70);
    } else if (filterRisk === 'medium') {
      filtered = filtered.filter((d) => d.riskScore >= 40 && d.riskScore < 70);
    }

    return filtered.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  };

  const filteredDetections = getFilteredDetections();

  const stats = {
    total: allDetections?.length || 0,
    phishing: phishingDetections?.length || 0,
    keylogger: keyloggerDetections?.length || 0,
    highRisk: highRiskDetections?.length || 0,
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Threat Type', 'Risk Score', 'Detection Method', 'Details'].join(','),
      ...filteredDetections.map((d) =>
        [
          new Date(Number(d.timestamp) / 1000000).toISOString(),
          d.threatType,
          d.riskScore.toString(),
          d.detectionMethod,
          `"${d.details.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileText className="h-16 w-16 text-primary" />
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Security Reports</h1>
            <p className="text-muted-foreground mt-2">
              Historical threat detection logs and analytics
            </p>
          </div>
        </div>
        <Button onClick={handleExport} disabled={filteredDetections.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phishing URLs</CardTitle>
            <Badge variant="outline">URL</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.phishing}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keyloggers</CardTitle>
            <Badge variant="outline">Process</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.keylogger}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Badge variant="destructive">≥70</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-destructive">{stats.highRisk}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detection History</CardTitle>
              <CardDescription>
                {filteredDetections.length} detection{filteredDetections.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="keylogger">Keylogger</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={(value: any) => setFilterRisk(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredDetections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No detections found matching the selected filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Threat Type</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Detection Method</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDetections.map((detection, index) => {
                  const riskScore = Number(detection.riskScore);
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(detection.timestamp) / 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {detection.threatType === ThreatType.PhishingURL ? 'Phishing' : 'Keylogger'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={riskScore >= 70 ? 'destructive' : 'default'}
                          className={
                            riskScore >= 70
                              ? 'bg-destructive'
                              : riskScore >= 40
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-safe text-safe-foreground'
                          }
                        >
                          {riskScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{detection.detectionMethod}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                        {detection.details}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
