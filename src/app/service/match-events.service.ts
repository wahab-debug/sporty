import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MatchEventsService {

  constructor(private http: HttpClient) { }
  url = environment.apiBaseUrl+'MatchEvents/'

  AddMatchEvents(matchEvent:any, imgpath:string){
    return this.http.post(this.url+'AddMatchEvents?ImgPath='+imgpath,matchEvent);
  }
  getMatchEvents(matchId:any){
    return this.http.get(this.url+'getMatchEvents?matchId='+matchId);
  }
}
