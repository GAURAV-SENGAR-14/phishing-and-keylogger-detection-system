import { useState } from 'react';
import { Activity, AlertTriangle, RefreshCw, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProcessDetection } from '../hooks/useQueries';
import ProcessDetailModal from './ProcessDetailModal';
import type { ThreatDetection } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProcessMonitoringDashboard() {
  const [processName, setProcessName] = useState('');
  const [scannedProcesses, setScannedProcesses] = useState<ThreatDetection[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<ThreatDetection | null>(null);
  const [filter, setFilter] = useState<'all' | 'suspicious'>('all');
  const { mutate: detectKeylogger, isPending } = useProcessDetection();

  const handleScan = () => {
    if (processName.trim()) {
      detectKeylogger(processName, {
        onSuccess: (data) => {
          setScannedProcesses((prev) => [data, ...prev]);
          setProcessName('');
        },
      });
    }
  };

  const filteredProcesses =
    filter === 'suspicious'
      ? scannedProcesses.filter((p) => p.riskScore >= 60)
      : scannedProcesses;

  const suspiciousCount = scannedProcesses.filter((p) => p.riskScore >= 60).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <img 
          src="/assets/generated/process-monitoring-icon.dim_128x128.png" 
          alt="Process Monitoring" 
          className="h-16 w-16"
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Process Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Detect suspicious processes and keylogger behavior
          </p>
        </div>
      </div>

      <Card className="bg-muted/30 border-warning/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Educational Simulation</p>
              <p className="text-muted-foreground">
                Due to browser security constraints, this tool simulates process monitoring by analyzing process names you provide. 
                In a real system deployment, this would connect to actual system process monitoring APIs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scan Process</CardTitle>
          <CardDescription>
            Enter a process name to check for suspicious keylogging patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., chrome.exe, keylogger.exe, svchost.exe"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              disabled={isPending}
              className="flex-1"
            />
            <Button onClick={handleScan} disabled={isPending || !processName.trim()}>
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Scan Process
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scanned Processes</CardTitle>
              <CardDescription>
                {scannedProcesses.length} process{scannedProcesses.length !== 1 ? 'es' : ''} scanned
                {suspiciousCount > 0 && ` • ${suspiciousCount} suspicious`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(value: 'all' | 'suspicious') => setFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  <SelectItem value="suspicious">Suspicious Only</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScannedProcesses([])}
                disabled={scannedProcesses.length === 0}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProcesses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>
                {scannedProcesses.length === 0
                  ? 'No processes scanned yet. Enter a process name above to begin.'
                  : 'No suspicious processes found.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process Name</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detection Method</TableHead>
                  <TableHead>Scanned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process, index) => {
                  const riskScore = Number(process.riskScore);
                  const isSuspicious = riskScore >= 60;
                  return (
                    <TableRow key={index} className={isSuspicious ? 'bg-destructive/5' : ''}>
                      <TableCell className="font-mono text-sm">
                        {process.details.split(' ')[0] || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            riskScore >= 70
                              ? 'text-destructive'
                              : riskScore >= 40
                              ? 'text-warning'
                              : 'text-safe'
                          }`}
                        >
                          {riskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isSuspicious ? 'destructive' : 'secondary'}
                          className={
                            isSuspicious
                              ? 'bg-destructive'
                              : 'bg-safe text-safe-foreground'
                          }
                        >
                          {isSuspicious ? 'Suspicious' : 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {process.detectionMethod}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(process.timestamp) / 1000000).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProcess(process)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedProcess && (
        <ProcessDetailModal
          detection={selectedProcess}
          open={!!selectedProcess}
          onClose={() => setSelectedProcess(null)}
        />
      )}
    </div>
  );
}
