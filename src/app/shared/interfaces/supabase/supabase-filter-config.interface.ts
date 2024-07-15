export interface SortyByConfig {
  [key: string]: { field: string; rule: { ascending: boolean } };
}
