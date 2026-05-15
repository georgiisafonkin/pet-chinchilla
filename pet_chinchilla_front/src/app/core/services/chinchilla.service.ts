import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Chinchilla {
  id: number;
  name: string;
  age: number | null;
  breed: string;
  fur_type: string;
  color: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface ChinchillaPayload {
  name: string;
  age?: number | null;
  breed?: string;
  fur_type?: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class ChinchillaService {
  private url = `${environment.apiUrl}/chinchillas/`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Chinchilla[]> {
    return this.http.get<Chinchilla[]>(this.url);
  }

  getOne(id: number): Observable<Chinchilla> {
    return this.http.get<Chinchilla>(`${this.url}${id}/`);
  }

  create(payload: ChinchillaPayload): Observable<Chinchilla> {
    return this.http.post<Chinchilla>(this.url, payload);
  }

  update(id: number, payload: Partial<ChinchillaPayload>): Observable<Chinchilla> {
    return this.http.patch<Chinchilla>(`${this.url}${id}/`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}