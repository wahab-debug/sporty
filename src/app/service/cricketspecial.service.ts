import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CricketspecialService {
url = environment.apiBaseUrl+'CricketScoring/';
  constructor(private http: HttpClient) { }
  //get cricket score
  getMatchScore(matchId:number){
    return this.http.get(this.url+'getMatchScore?matchid='+matchId);
  }
  //post criket score
  AddCricketScore(Score:any){
    return this.http.post(this.url+'AddCricketScore',Score)
  }
  AddMotm(motm:any){
    return this.http.post(this.url+'AddMotm',motm);
  }
  ballbyballscore(id:number){
    return this.http.get(this.url+'ballByballData?specificFixtureId='+id);
  }
  GetImagePath(fixtureId:number){
    return this.http.get(this.url+'GetImagePath?fixid='+fixtureId);
  }
}
