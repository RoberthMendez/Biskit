import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getLastTreatmentCount(){
    return this.http.get<number>('http://localhost:8080/vet/admin/ultimos-tratamientos-count');
  }
}
