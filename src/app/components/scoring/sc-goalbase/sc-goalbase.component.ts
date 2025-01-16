import { Component, Input, OnInit } from '@angular/core';
import { PlayerService } from '../../../service/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemoriesService } from '../../../service/memories.service';
import { ToastrService } from 'ngx-toastr';
import { ScoringService } from '../../../service/scoring.service';
import { TeamService } from '../../../service/team.service';
import { MatchEventsService } from '../../../service/match-events.service';

@Component({
  selector: 'app-sc-goalbase',
  templateUrl: './sc-goalbase.component.html',
  styleUrl: './sc-goalbase.component.css'
})
export class ScGoalbaseComponent implements OnInit {
  constructor(private playerService: PlayerService,private teamService: TeamService, private imgService: MemoriesService, private scoringService: ScoringService, private matchEventService: MatchEventsService,private toastr: ToastrService, private router: ActivatedRoute, private redirect: Router){}
  
  ngOnInit(){
    this.getValues()
  }
  @Input() goalBase:{
  team1_name:string;
  team2_name:string;
  team1_goals:number;
  team2_goals:number;
  fixture_id: number;
  selectedTeam: any;
  goals: number;
  comments :string;
}
players :any[] = []; //hold player list of selected team
selectedAssist = null; 
selectedEvent = null;
selectedStriker = null;
imagePaths :any[] = []; //hold image paths
imgPath : string;
  //submit scores, events and images of a match
  onSubmit(s){
    this.router.paramMap.subscribe({
      next:res=>{ 
        this.goalBase.fixture_id = Number(res.get('id'));        
      }
    });//gets the ficture id from link
    const goalObj = {
      team_id: this.goalBase.selectedTeam,
      goals: this.goalBase.goals,
      fixture_id: this.goalBase.fixture_id
    };//object for score which hold scoring data model pattren
    //api call for scoring goalbase sports, this will update scores of teams
    this.scoringService.AddOrUpdateGoalBasedScore(goalObj.team_id, goalObj.goals,goalObj.fixture_id).subscribe({
      next:res=>{
        this.toastr.success("Score Updated");
      }
    });
    //function call for uploading image which check if image is selected then it will uploads that image for match
    this.onImageChange(goalObj.fixture_id);
  }
  //fills dropdown values of event players list everytime on selection
  onSelected(f:string){
    const first = f;
    if(first){
      this.playerService.getPlayerByTeamName(first).subscribe({
        next: res=>{
          this.players = res as any;
        }
      });
    }
   }
   //handle images of matches and post those images
   onImageChange(id:any): void{
    // const input = event.target as HTMLInputElement;
    const input = document.querySelector('input[type="file"]') as HTMLInputElement; // Get the file input directly
    if (input.files && input.files.length > 0) {
      // Preview image paths
      this.imagePaths = Array.from(input.files).map((file: File) => URL.createObjectURL(file));

      // Create a FormData object
      const formData = new FormData();
      Array.from(input.files).forEach((file) => {
        formData.append('files', file); // Key should match the backend expectation
      });
      //api call for image upload
      this.imgService.UploadImage(id, formData).subscribe({
        next: (res: ApiResponse) => {
          this.toastr.success('Images uploaded successfully!');
          this.imgPath = res[0];
          this.postEvent(this.imgPath);            
        },
        error: (err) => {
          this.toastr.error('Image upload failed.');// if api returns error in saving image
        }
      });
    } else {
      console.log('No files selected.');// if no image is selected it will log this line
    }
  }
  //this will calculate winner of match and then update winner id of match
  endMatch() {
    let currentFixture :number = 0; //hold match id
    let currentGame: string = ''; //hold game name to redirect after success
    this.router.paramMap.subscribe({
      next:res=>{ 
        currentFixture = Number(res.get('id'));
        currentGame = res.get('game');
      }
    });
    const userConfirmation = confirm("Once the match ends, scores cannot be changed. Are you sure you want to end the match?");
    if (userConfirmation) {      
      // Logic for ending the match
      this.scoringService.UpdateGoalBasedWinner(currentFixture).subscribe({
        next:res=>{
          this.toastr.success("Match ended!");
          setTimeout(() => {
            this.redirect.navigateByUrl("/allsports/schedules/"+currentGame);
          }, 500);//redirect to other screen afer success
        },
        error:err=>{
          this.toastr.error(err.message); //api response error
        }
      });      
    } else {
      this.toastr.show("Match not ended."); //confirmation response show
    }
  }
  //fills name of playing teams
  getValues(){
    let id = 0;
    this.router.paramMap.subscribe({
      next:res=>{ 
        id = Number(res.get('id'));        
      }
    })
    this.teamService.playingTeams(id).subscribe({
      next: (rep: TeamResponse) => {
        this.goalBase = {
          team1_name: rep.Team1,    // Map Team1 to team1_name
          team2_name: rep.Team2,    // Map Team2 to team2_name
          team1_goals: 0,           // Initialize goals for team 1
          team2_goals: 0,           // Initialize goals for team 2
          fixture_id: id,           // Use the passed fixture id
          selectedTeam: null,       // Set to null or modify as needed (e.g., based on logic)
          goals: 0,                 // Initialize total goals
          comments: "",             // Initialize comments (empty string by default)
        };
    
      }
    });
    
  }
  //handle event of match with image path
  postEvent(path:string){
    const eventsObj = {
      fixture_id: this.goalBase.fixture_id,
      event_time: new Date().toISOString().slice(0,19).replace('T',' '),
      event_description : this.goalBase.comments,
      player_id : Number(this.selectedStriker),
      secondary_player_id: !this.selectedAssist ? null : Number(this.selectedAssist),
      event_type : this.selectedEvent,
    };//object for events which hold events table data model pattren
    console.log("testing");
    
    console.log(eventsObj);


    this.matchEventService.AddMatchEvents(eventsObj,path).subscribe({
      next:res=>{
        console.log(eventsObj);
      },
      error:err=>{
        console.log(err.message);
      }
    });
  }
  
}
interface TeamResponse {
  Team1: string;
  Team2: string;
}
interface ApiResponse{
  imagePaths:string[]
}