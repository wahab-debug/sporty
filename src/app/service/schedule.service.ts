import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http:HttpClient) { }
  url = environment.apiBaseUrl+'matches';

  //get all matches
  getMatches(inputData:any){
    return this.http.get(this.url+'/getMatches?sportName='+inputData)
  }
}
