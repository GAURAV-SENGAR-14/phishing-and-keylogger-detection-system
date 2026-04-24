import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ThreatDetection } from '../backend';
import { ThreatType } from '../backend';
import { toast } from 'sonner';

export function useAllDetections() {
  const { actor, isFetching } = useActor();

  return useQuery<ThreatDetection[]>({
    queryKey: ['detections', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDetections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDetectionsByType(threatType: ThreatType) {
  const { actor, isFetching } = useActor();

  return useQuery<ThreatDetection[]>({
    queryKey: ['detections', 'type', threatType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDetectionsByType({ [threatType]: null } as any);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDetectionsByRiskScore(minScore: number) {
  const { actor, isFetching } = useActor();

  return useQuery<ThreatDetection[]>({
    queryKey: ['detections', 'riskScore', minScore],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDetectionsByRiskScore(BigInt(minScore));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useURLAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.analyzeURL(url);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['detections'] });
      const riskScore = Number(data.riskScore);
      if (riskScore >= 70) {
        toast.error('High Risk URL Detected!', {
          description: `Risk score: ${riskScore}. Do not proceed with this URL.`,
        });
      } else if (riskScore >= 40) {
        toast.warning('Suspicious URL Detected', {
          description: `Risk score: ${riskScore}. Exercise caution.`,
        });
      } else {
        toast.success('URL Analysis Complete', {
          description: `Risk score: ${riskScore}. URL appears safe.`,
        });
      }
    },
    onError: (error) => {
      toast.error('Analysis Failed', {
        description: error instanceof Error ? error.message : 'Failed to analyze URL',
      });
    },
  });
}

export function useProcessDetection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (processName: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.detectKeylogger(processName);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['detections'] });
      const riskScore = Number(data.riskScore);
      if (riskScore >= 70) {
        toast.error('Suspicious Process Detected!', {
          description: `Risk score: ${riskScore}. Potential keylogger behavior.`,
        });
      } else if (riskScore >= 40) {
        toast.warning('Process Flagged', {
          description: `Risk score: ${riskScore}. Monitor this process.`,
        });
      } else {
        toast.success('Process Scanned', {
          description: `Risk score: ${riskScore}. Process appears normal.`,
        });
      }
    },
    onError: (error) => {
      toast.error('Scan Failed', {
        description: error instanceof Error ? error.message : 'Failed to scan process',
      });
    },
  });
}
