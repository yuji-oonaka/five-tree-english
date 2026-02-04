import { Scenario } from '@/types/conversation';
import { cafeScenario } from './cafe';

export const allScenarios: Scenario[] = [
  cafeScenario,
  // 今後、convenienceScenario などが増えていく
];

export const getScenarioById = (id: string) => 
  allScenarios.find(s => s.id === id);