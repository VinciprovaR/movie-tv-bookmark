export interface TMDBApiPayload {
  serviceKey: string;
  pathParams?: { [key: string]: string | number };
  queryParams?: { [key: string]: string };
}

export interface OpeanAiApiPayload {
  userPrompt: string;
  queryParams: { [key: string]: string };
}
