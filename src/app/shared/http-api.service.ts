import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  baseUrl = 'http://localhost:8006/'
  constructor(private http: HttpClient) { }

  public getApi(url) {
    return this.http.get(this.baseUrl + url);
  }

  public postApi(url, formData) {
    return this.http.post(this.baseUrl + url, formData);
  }
}
