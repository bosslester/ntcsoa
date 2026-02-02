import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccessSOAPayload {
  id?: number;

  dateIssued?: string | null;
  licensee?: string | null;
  address?: string | null;
  particulars?: string | null;
  periodCovered?: string | null;

  rslRadioStation?: number | null;
  rocOperatorFee?: number | null;
  rslSurcharge?: number | null;
  dst?: number | null;

  // ⚠️ OR NUMBER in SQL is usually INT, so better make this number:
  orNumber?: number | null;
  datePaid?: string | null;

  remarksNote?: string | null;
  totalAmount?: number | null;
}

@Injectable({ providedIn: 'root' })
export class SoaService {

  // ✅ LOCAL dev:
  // private baseUrl = 'https://localhost:5081/api/AccessSOA';

  // ✅ IIS / shared on LAN (example):
  private baseUrl = 'http://10.2.11.164:8080/api/AccessSOA';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // =========================
  // ✅ HEADER-ONLY endpoints
  // =========================
  createHeader(payload: AccessSOAPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/header`, payload);
  }

  updateHeader(id: number, payload: AccessSOAPayload): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/header`, payload);
  }

  // =========================
  // Full endpoints (optional)
  // =========================
  create(payload: AccessSOAPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  update(id: number, payload: AccessSOAPayload): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}


