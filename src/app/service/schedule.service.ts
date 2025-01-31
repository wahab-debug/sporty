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
  //by sessionsport id
  getMatchesbySessionSport(inputData:any){
    return this.http.get(this.url+'/getMatchesbySessionSport?sessionSportID='+inputData)
  }
  //set schedules
  setSchedule(inputData:any, emReg:string){
    return this.http.post(this.url+'/setSchedule?EmRegNo='+emReg,inputData);
  }
  //get all fixtures that are ready to set
  AllScheduledFixtures(inputData:any){
    return this.http.get(this.url+'/AllScheduledFixtures?emRegNo='+inputData);
  }
  //update schedule tabel with team names based on fixture id
  UpdateFixture(inputData:any){
    return this.http.put(this.url+'/UpdateFixture',inputData);
  }
  //start match and make winner id 0
  startMatch(inputData:any){
    return this.http.put(this.url+'/startMatch?fixtureId='+inputData,inputData)
  }
}
