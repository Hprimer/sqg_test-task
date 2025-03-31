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
}