import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SessionperformanceService {

   constructor(private http: HttpClient) { }
   
    url = environment.apiBaseUrl+'TopPerformer/';
   
  sessionGistforAdmin(sessionId:number){
    return this.http.get(this.url+'sessionGistforAdmin?sessionId='+sessionId)
  }
  Getplayerrunsbybymatches(inputData:string){
    return this.http.get(this.url+'Getplayerrunsbybymatches?regNo='+inputData+'&sessionId=3');
  }
  //return search query data
  GetUserTeams(inputData:string){
    return this.http.get(this.url+'GetUserTeams?regNo='+inputData);
  }
}
