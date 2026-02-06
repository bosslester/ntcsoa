import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TechSOAHeaderCreateDto {
  dateIssued: string | null;
  licensee: string | null;
  address: string | null;
  particulars: string | null;
  periodFrom: string | null;
  periodTo: string | null;
  periodYears: number | null;
}

@Injectable({ providedIn: 'root' })
export class SoaService {
  private iisBase = 'http://192.168.0.187:8080';  //need to change this when deployed and testing need same network

  // ✅ Swagger says controller is AccessSOA
  private baseUrl = `${this.iisBase}/api/AccessSOA`;

  constructor(private http: HttpClient) {}

  // ✅ POST /api/AccessSOA/header
  createHeader(payload: TechSOAHeaderCreateDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/header`, payload);
  }

  // ✅ GET /api/AccessSOA/{id}
  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // (optional) ✅ PUT /api/AccessSOA/{id}/header  (based on swagger)
  updateHeader(id: number, payload: TechSOAHeaderCreateDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/header`, payload);
  }
}