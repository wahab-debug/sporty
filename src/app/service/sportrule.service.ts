import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SportruleService {

  constructor(private http: HttpClient) { }
  url = environment.apiBaseUrl+'rule/';

  viewRules(inputData:any){
    return this.http.get(this.url+'viewRules?sportId='+inputData);
  }
  updateRules(inputData:any){
    return this.http.post(this.url+'updateRules',inputData);
  }
}
