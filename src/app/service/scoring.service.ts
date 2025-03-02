import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  constructor(private http: HttpClient) { }
  url = environment.apiBaseUrl+'scoring/';

  //get match scores
  matchScores(matchid:number){
    return this.http.get(this.url+'matchScores?matchId='+matchid);
  }

  //cicket scoring
  AddOrUpdateCricketScore(teamName:string,score:number,over:number,wickets:number,FixtureId:number){
    const matchObj = {
      teamName,
      score,
      over,
      wickets,
      FixtureId
    };
    return this.http.post(this.url+'AddOrUpdateCricketScore',matchObj);
  }
  //calculate cricket winner
  UpdateCricketWinner(fixtureId:number){
    return this.http.post(this.url+'UpdateCricketWinner',fixtureId);
  }
  //goal-base scoring
  AddOrUpdateGoalBasedScore(teamid,goals,fixture_id){
    const req = {
      teamid,
      goals,
      fixture_id
    };
    return this.http.post(this.url+'AddOrUpdateGoalBasedScore',req);
  }
  //calculate goal base winner
  UpdateGoalBasedWinner(fixtureId:number){
    return this.http.put(this.url+'UpdateGoalBasedWinner',fixtureId);
  }
  //pointbase scoring
  AddOrUpdatePointBasedScore(data:any){
    return this.http.post(this.url+'AddOrUpdatePointBasedScore',data);
  }
  //calculate goal base winner
  UpdatePointBasedWinner(fixtureId:number){
    return this.http.post(this.url+'UpdatePointBasedWinner',fixtureId);
  }
  //post winner of turnbase
  UpdateTurnBasedWinner(inputData:any){
    return this.http.post(this.url+'UpdateTurnBasedWinner',inputData);
  }

  //post hight scorer in scorecard table
  PostHighScorer(inputData:any){
    return this.http.post(this.url+'PostHighScorer',inputData);
  }

}
