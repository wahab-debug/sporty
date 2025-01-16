import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }
  url = environment.apiBaseUrl+'player/';
  //player related functions

  //get all players from a team
  getTeamPlayers(id : any){
    return this.http.get(this.url+'getTeamPlayers/?teamid='+id);
  }

  //get all students filter by semester number
  getStudentofSem(descip:any,inputData:any, section:any, gender:any){
    return this.http.get(this.url+'studentList?semsec='+inputData+'&sec='+section+'&descip='+descip+'&Gender='+gender)
  }
  //add players in team with team name
  addPlayersinTeam(inputData:any, teamName:any){
    return this.http.post(this.url+'addPlayer/'+teamName,inputData)
  }
  //get team players based on team name from latest session
  getPlayerByTeamName(teamName:any){
    return this.http.get(this.url+"getPlayerByTeamName?teamName="+teamName)
  }

}
