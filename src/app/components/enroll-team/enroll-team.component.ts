import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TeamService } from '../../service/team.service';
import { EventService } from '../../service/event.service';
import { PlayerService } from '../../service/player.service';

@Component({
  selector: 'app-enroll-team',
  templateUrl: './enroll-team.component.html',
  styleUrl: './enroll-team.component.css'
})
export class EnrollTeamComponent implements OnInit{
  constructor(private playerService:PlayerService ,private teamService:TeamService, private toastr: ToastrService, private eventService: EventService){
    this.teamObj = new Team();
  }

  ngOnInit(): void {
    this.loadForm();
  }
  
  teamObj:Team; //for two way databinding 
  sports: any[] = []; //to fill sports dropdown. variable is used in loadform func.
  selectedSportId: string | null = null; // holds selected sport id
  playersList :any[]= []; //hold list of student from load form method and front end iterate through each value
  selectedPlayersReg: string | null = null; // selected stuedent reg num is stored
  showPlayerList: boolean = false; // Manage visibility of the player list
  showTeamForm: boolean = true; // manage form visiblity
  
  //method to add team in team table with team status 0
  onSubmit(formData: any) {
    const isValid = this.nextStep();
    if(isValid){
      const teamData = {
        ...formData.value,
        captain_id: this.teamObj.captain_id,
        teamStatus: this.teamObj.teamStatus,
        image_path: this.teamObj.image_path
      };
                      this.teamService.postTeam(teamData).subscribe(
                        {
                          next:res=>{
                                      this.toastr.success("Request initiated, Please add players to proceed further");
                                    },
                          error:err=>{
                                        this.toastr.warning(err.message);
                                      }
                        }
                  );    
                }
          
    
      
  }
  //method that accept list of players selected and post in plater table
  playerFormList(selectedOptions:any){
    
  }
  // New method to handle "Next" button
  nextStep() :boolean{
    if (!this.teamObj.Tname || !this.teamObj.className || !this.teamObj.sport_id) {
      this.toastr.warning('Please fill in all required fields: Team Name, Class Name, and Sport.');
      return false; // Stop execution if any field is empty and return false
    }
    this.onSelectingSem(this.teamObj.className);    
    // Hide team form and show player selection
    this.showPlayerList = true; 
    this.showTeamForm = false;
    return true; 
  }
  //execute getCaptainId() and also get sports that are offered in current session
  loadForm(){
    this.getCaptainId();
    this.eventService.getSportBySession().subscribe(
      res=>{
        this.sports = res as any
      },  
      err=>{
        this.toastr.error('Failed to load sports : '+err.message);
      }
    );
  }
  //send selected students to players table
  onSelectingSem(classname:any){
    this.playerService.getStudentofSem(classname).subscribe(
      res=>{
        this.playersList = res as any
      },  
      err=>{
        this.toastr.error('Failed to load players : '+err.message);
      }
    );
  }
  //get id of curent user logged in & assign to captain id of team
  getCaptainId() {
    const id = sessionStorage.getItem('id');
    if (id) {
      this.teamObj.captain_id = Number(id); // Set the retrieved id to captain_id
    }
  }
  //with logging purpose
  logSelectedPlayers(){
    const selectedPlayers = this.playersList.filter(player => player.selected).map(player => player.reg_no);
    console.log(selectedPlayers+"with twist");
    
    const regNumbers = selectedPlayers.map(player => player.reg_no);
    console.log('Selected Registration Numbers:', regNumbers);
  }
  
  
   
}
//team model class
class Team{
  teamId : number;
  Tname : string;
  className : string;
  session_Id : number;
  captain_id : number;
  sport_id : number;
  image_path : string;
  teamStatus : number;
  constructor() {
    this.teamId = 0 ;
    this.Tname = '';
    this.className = '';
    this.session_Id = 0;
    this.captain_id = 0;
    this.sport_id = 0;
    this.image_path = null;
    this.teamStatus = 0;
  }
}