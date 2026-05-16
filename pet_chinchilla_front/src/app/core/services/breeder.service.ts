import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Breeder {
  id: number;
  username: string;
  email: string;
  bio: string;
}

export interface BreederUpdatePayload {
  bio?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class BreederService {
  private url = `${environment.apiUrl}/breeders/`;

  constructor(private http: HttpClient) {}

  getMe(): Observable<Breeder> {
    return this.http.get<Breeder>(`${this.url}me/`);
  }

  updateMe(payload: BreederUpdatePayload): Observable<Breeder> {
    return this.http.patch<Breeder>(`${this.url}me/`, payload);
  }

  getAll(): Observable<Breeder[]> {
    return this.http.get<Breeder[]>(this.url);
  }
}