import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TeamService } from '../../service/team.service';
import { EventService } from '../../service/event.service';
import { PlayerService } from '../../service/player.service';
import { Team } from '../../model/team.model';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-enroll-team',
  templateUrl: './enroll-team.component.html',
  styleUrl: './enroll-team.component.css'
})
export class EnrollTeamComponent implements OnInit{
  
  constructor(private playerService:PlayerService ,private teamService:TeamService, 
    private userService: AuthService,private toastr: ToastrService, 
    private eventService: EventService, private router: Router){
    this.teamObj = new Team();
  }

  ngOnInit(): void {
    this.loadForm();
  }
  
  teamObj:Team; //for two way databinding 
  sports: any[] = []; //to fill sports dropdown. variable is used in loadform func.
  playersList :any[]= []; //hold list of student from load form method and front end iterate through each value
  selectedPlayersReg: any [] = []; // selected stuedent reg num is stored
  showPlayerList = false; // Manage visibility of the player list
  showTeamForm = true; // manage form visiblity
  malefemale;  //holds gender of user
  selectedFile: File | null = null; // To store the selected file
  isSinglePlayerSport = false;
  requiredPlayers = 0;
  maxPlayers = 10;

  get selectedPlayersCount(): number {
    return this.playersList.filter(p => p.selected).length;
  }

  onSportChange(): void {
    const singlePlayerSports = [4, 5, 6, 3007, 3008, 3009, 3010];
    const dualPlayerSports = [3006, 3011, 3012];
    
    this.isSinglePlayerSport = singlePlayerSports.includes(Number(this.teamObj.sport_id));
    
    if (singlePlayerSports.includes(Number(this.teamObj.sport_id))) {
      this.requiredPlayers = 0;
      this.teamObj.TeamType = 'SingleUser';
    } else if (dualPlayerSports.includes(Number(this.teamObj.sport_id))) {
      this.requiredPlayers = 1;
      this.maxPlayers = 1;
      this.teamObj.TeamType = 'DualUser';
    } else {
      this.requiredPlayers = 8;
      this.maxPlayers = 10;
      this.teamObj.TeamType = 'TeamUser';
    }
  }

  private validateForm(): boolean {
    const requiredFields = [
      this.teamObj.Tname,
      this.teamObj.classDescipline,
      this.teamObj.className,
      this.teamObj.classSection,
      this.teamObj.sport_id
    ];

    if (requiredFields.some(field => !field)) {
      this.toastr.warning('Please fill all required fields');
      return false;
    }
    return true;
  }

  private handleTeamSubmissionSuccess(): void {
    this.toastr.success('Request initiated');
    if (this.isSinglePlayerSport) {
      this.completeRegistration();
    } else {
      this.showTeamForm = false;
      this.showPlayerList = true;
      this.loadPlayers();
    }
  }

  private handleTeamSubmissionError(err: any): void {
    this.toastr.error(err.message || 'Submission failed');
    setTimeout(() => location.reload(), 4000);
  }

  private loadPlayers(): void {
    const { classDescipline, className, classSection } = this.teamObj;
    this.playerService.getStudentofSem(classDescipline, className, classSection, this.malefemale)
      .subscribe({
        next: (res) => this.playersList = res as any,
        error: (err) => this.toastr.error('Failed to load players')
      });
  }

  isPlayerSelectionValid(): boolean {
    if (this.isSinglePlayerSport) return true;
    return this.selectedPlayersCount >= this.requiredPlayers && 
           this.selectedPlayersCount <= this.maxPlayers;
  }

  playerFormList(): void {
    if (!this.isPlayerSelectionValid()) {
      this.toastr.warning(`Please select between ${this.requiredPlayers} and ${this.maxPlayers} players`);
      return;
    }

    const regNumbers = [
      ...this.playersList.filter(p => p.selected).map(p => p.reg_no),
      sessionStorage.getItem('registration_no')
    ];

    this.playerService.addPlayersinTeam(regNumbers, this.teamObj.Tname)
      .subscribe({
        next: () => this.completeRegistration(),
        error: (err) => this.handlePlayerSubmissionError(err)
      });
  }

  private completeRegistration(): void {
    this.toastr.success('Registration complete!');
    setTimeout(() => this.router.navigate(['']), 2000);
  }

  private handlePlayerSubmissionError(err: HttpResponse<any>): void {
    const errorMessage = err.body?.message || 'Player submission failed';
    this.toastr.error(errorMessage);
  }
  //method to add team in team table with team status 0
  onSubmit(formData: any) {
    const isValid = this.nextStep();
    if(isValid){
      const teamData = {
        ...formData.value,
        captain_id: this.teamObj.captain_id,
        teamStatus: this.teamObj.teamStatus,
        image_path: this.teamObj.image_path,
        className: this.teamObj.classDescipline+this.teamObj.className+this.teamObj.classSection,
        teamType : this.teamObj.TeamType 
      };
      
                      this.teamService.postTeam(teamData).subscribe(
                        {
                          next:res=>{
                                      this.toastr.success("Request initiated, Please add players to proceed further");
                                      this.showPlayerList = true;
                                    },
                          error:err=>{
                                        this.toastr.warning('Failed to load players : ' +err.error.Message);
                                        this.showPlayerList = false;
                                        setTimeout(() => {
                                          location.reload(); // Reload the page after 2 seconds
                                        }, 3000);
                                      }
                        }
                  );    
                }
          
    
      
  }
  //method to add players in team via checkbox with captain as well
  // playerFormList(){
  //   const regNum = sessionStorage.getItem('registration_no');
  //   const selectedPlayers = this.playersList.filter(player => player.selected).map(player => player.reg_no).concat(regNum);
  //   if(this.holdSelectedPlayers()){
  //     this.playerService.addPlayersinTeam(selectedPlayers,this.teamObj.Tname).subscribe({
  //       next:(res)=>{
  //         this.toastr.success("Team and Players submitted successfully.Please wait for manager's approval.");
  //         setTimeout(() => {
  //           this.route.navigate(['']);
  //         }, 2000);
  //       },
  //       error:(err:HttpResponse<any>)=>{
  //         if(err.status===409){
  //           this.toastr.error(err.body);
  //         }
  //         else if(err.status===400){
  //           this.toastr.error(err.body);
  //         }
  //         else if(err.status===404){
  //           this.toastr.error(err.body);
  //         }
  //       }
  //     });
  //   }
  // }
  // onSportChange(){
  // this.holdSelectedPlayers();
  // }
  // New method to handle "Next" button. hide team form and show player checkboxs form
  nextStep() :boolean{
    if (!this.teamObj.Tname || !this.teamObj.className || !this.teamObj.sport_id || !this.teamObj.classDescipline) {
      this.toastr.warning('Please fill in all required fields: Team Name, Class Name, and Sport.');
      return false; // Stop execution if any field is empty and return false
    }
    this.onSelectingSem(this.teamObj.classDescipline,this.teamObj.className, this.teamObj.classSection);   
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
        this.sports = res as any;
      },  
      err=>{
        this.toastr.error('Failed to load sports : '+err.error);
      }
    );
  }
  //get students on base of semester and section selected
  onSelectingSem(descip:any,classname: any, classSection: any){
    if(descip && classname && classSection){
      this.playerService.getStudentofSem(descip,classname,classSection,this.malefemale).subscribe(
        res=>{
          this.playersList = res as any;
        },  
        err=>{
          this.toastr.error('Failed to load players : '+err.error);
        }
      );
    }
    else{
    }
    
  }
  //get id of curent user logged in & assign to captain id of team also get gender of user
  getCaptainId() {
    const id = sessionStorage.getItem('id');
    if (id) {
      this.teamObj.captain_id = Number(id); // Set the retrieved id to captain_id
      this.userService.HandleUser(this.teamObj.captain_id).subscribe({
        next :res=>{
          this.malefemale = res;
        },
        error: err=>{}
      });
    }
  }
  //with logging purpose
  holdSelectedPlayers(): boolean {
    const selectedPlayers = this.playersList.filter(player => player.selected).map(player => player.reg_no);
    const sportId = Number(this.teamObj.sport_id);
  
    // Handle sport_id conditions
    if ([4, 5, 6, 3007, 3008, 3009, 3010].includes(sportId)) {
      // For these sport_ids, no players should be selected (minimum and maximum = 0)
      if (selectedPlayers.length > 0) {
        this.toastr.warning('Please submit the team without selecting any players.');
        this.teamObj.TeamType = 'SingleUser'
        return false;
      }
    } else if ([3006, 3011, 3012].includes(sportId)) {
      // For these sport_ids, only 1 player can be selected
      if (selectedPlayers.length > 1) {
        this.toastr.warning('You can only select 1 player.');
        this.teamObj.TeamType = 'Not SingleUser'
        return false;
      } else if (selectedPlayers.length === 0) {
        this.toastr.warning('Please select 1 player.');
        this.teamObj.TeamType = 'Not SingleUser'
        return false;
      }
    } else {
      // For other sport_ids, enforce the 8-10 player rule
      if (selectedPlayers.length < 8) {
        this.toastr.warning('Please select at least 8 players.');
        return false;
      } else if (selectedPlayers.length > 10) {
        this.toastr.warning('You can select up to 10 players only.');
        return false;
      }
    }
  
    return true;  // If all conditions pass, return true
  }

  //create form data object
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
  
      // Generate a Blob URL for local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove quotes from the start and end of the Base64 string (if present)
        const base64String = reader.result as string;
        this.teamObj.image_path = base64String.replace(/^"|"$/g, ''); // Remove starting and ending quotes
      };
    reader.readAsDataURL(this.selectedFile); // Read file as Base64-encoded string
    }
    
    
  }
  
   
}
