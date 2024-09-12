export interface TMDBApiPayload {
  serviceKey: string;
  pathParams?: { [key: string]: string | number };
  queryParams?: { [key: string]: string };
}
