import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface GymRegistration {
  gymName: string;
  ownerName: string;
  mobile: string;
  email: string;
  userId: string;
  password: string;
}

export interface GymRegistrationResult {
  gym: { id: number; name: string; logoUrl: string | null };
  owner: { id: number; name: string; email: string; userId: string };
}

/** Shape of 400/409 responses from the API. */
export interface ApiFieldErrors {
  message: string;
  errors?: Partial<Record<keyof GymRegistration | 'logo', string>>;
}

@Injectable({ providedIn: 'root' })
export class GymApi {
  private readonly http = inject(HttpClient);

  /** Sent as multipart/form-data so an optional logo image can ride along. */
  register(registration: GymRegistration, logo: File | null = null): Observable<GymRegistrationResult> {
    const body = new FormData();
    for (const [key, value] of Object.entries(registration)) {
      body.append(key, value);
    }
    if (logo) {
      body.append('logo', logo);
    }
    return this.http.post<GymRegistrationResult>('/api/gyms', body);
  }
}
