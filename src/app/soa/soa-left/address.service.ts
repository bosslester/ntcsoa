import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AddressTownDto = { townCity: string; barangays: string[] };
export type AddressProvinceDto = { province: string; towns: AddressTownDto[] };

@Injectable({ providedIn: 'root' })
export class AddressService {
  private baseUrl = '/api/Address';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<AddressProvinceDto[]> {
    return this.http.get<AddressProvinceDto[]>(`${this.baseUrl}/provinces`);
  }
}