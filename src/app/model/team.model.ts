export class Team {
  teamId : number;
  Tname : string;
  className : string;
  session_Id : number;
  captain_id : number;
  sport_id : number;
  image_path : string;
  teamStatus : number;
  classSection: string;
  classDescipline: string;
  TeamType: string;
  constructor() {
    this.teamId = 0 ;
    this.Tname = '';
    this.className = '';
    this.session_Id = 0;
    this.captain_id = 0;
    this.sport_id = 0;
    this.image_path = null;
    this.teamStatus = 0;
    this.TeamType = ''
  }
}
