import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  url = environment.apiBaseUrl+'team/';
  constructor(private http: HttpClient) { }
  //team related function

  //get team list of latest session
  getTeams(){
    return this.http.get(this.url+'getteams');
  }
  //get team by ID
  getByTeamId(id:any){
    return this.http.get(this.url+'getByTeamId?teamid='+id)
  }
  //post team in latest session
  postTeam(inputdata:any){
    return this.http.post(this.url+'postTeam',inputdata);
  }
  //update team by id
  updateTeam(id:any, inputdata:any){
    return this.http.post(this.url+'updateTeam/?id='+id, inputdata);
  }

}
