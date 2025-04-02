import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  private apiUrl = '/api/packages'; 

  constructor(private http: HttpClient) { }

  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getPackageDependencies(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/dependencies`);
  }
}