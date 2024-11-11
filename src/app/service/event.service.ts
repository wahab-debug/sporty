import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url = environment.apiBaseUrl+'session/';
  gameurl = environment.apiBaseUrl+'game/';

  constructor(private http: HttpClient) { }
  // Session related Functions
  //view all sessions being played
  getAllSession(){
    return this.http.get(this.url+'sessionList');
  }

  getCurrentSession(){
    return this.http.get(this.url+'currentSession')
  }
  //add session data
  addSession(inputData:any){
    return this.http.post(this.url+'sessionAdd',inputData);
  }
  // Sports related Functions 
  //  add games from current session
  addSportinCurrentSession(inputData:any){
    return this.http.post(this.gameurl+'gameAddToLatestSession',inputData);
  }
  // view games by current session
  getSportBySession(){
    return this.http.get(this.gameurl+'gameBySession');
  }
  // view sports from all sport table
  getAllSports(){
    return this.http.get(this.gameurl+'getAllgames');
  }
  addGameToSports(inputData:any){
    return this.http.post(this.gameurl+'addGame',inputData);
  }
}
