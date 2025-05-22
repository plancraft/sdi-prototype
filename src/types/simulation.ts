export interface SimulationResponse {
  simulationId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface SimulationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}