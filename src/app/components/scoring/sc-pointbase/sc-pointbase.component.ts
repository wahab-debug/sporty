import { Component, Input } from '@angular/core';
import { PlayerService } from '../../../service/player.service';
import { ScoringService } from '../../../service/scoring.service';
import { ToastrService } from 'ngx-toastr';
import { MemoriesService } from '../../../service/memories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchEventsService } from '../../../service/match-events.service';
import { TeamService } from '../../../service/team.service';

@Component({
  selector: 'app-sc-pointbase',
  templateUrl: './sc-pointbase.component.html',
  styleUrl: './sc-pointbase.component.css'
})
export class ScPointbaseComponent {
  @Input() pointBase: {
    team1_name: string;
    team2_name: string;
    setsWon: number;
    comments: string;
    fixture_id: number;
    selectedTeam
  };

  players: any[] = [];  // List of players
  selectedEvent: any = null;
  selectedStriker: any = null;
  selectedAssist: any = null;
  imagePaths: any[] = []; // Image paths for selected images
  imgPath : string;
  

  constructor(
    private playerService: PlayerService, 
    private scoringService: ScoringService, 
    private toastr: ToastrService, 
    private imgService: MemoriesService, 
    private router: ActivatedRoute, 
    private redirect: Router,
    private matchEventService : MatchEventsService,
    private teamService : TeamService
  ) {}

  // Function to handle form submission
  onSubmit(s) {
    this.router.paramMap.subscribe({
      next: res => {
        this.pointBase.fixture_id = Number(res.get('id'));
      }
    });

    // Scoring information to be sent to API
    const scoreObj = {
      team_id: this.pointBase.selectedTeam,
      setsWon: this.pointBase.setsWon,
      fixture_id: this.pointBase.fixture_id
    };
    // Call API to update scores
    this.scoringService.AddOrUpdatePointBasedScore(scoreObj.team_id, scoreObj.setsWon, scoreObj.fixture_id).subscribe({
      next: res => {
        this.toastr.success("Score Updated");
      }
    });
    // Handle image upload
    this.onImageChange(scoreObj.fixture_id);
  }

  // Handle player selection and load players dynamically
  onSelected(f: string) {
    const first = f;
    if (first) {
      this.playerService.getPlayerByTeamName(first).subscribe({
        next: res => {
          this.players = res as any;
        }
      });
    }
  }

  // Handle image change and upload
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
      this.scoringService.UpdatePointBasedWinner(currentFixture).subscribe({
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
    //handle event of match with image path
  postEvent(path:string){
      const eventsObj = {
        fixture_id: this.pointBase.fixture_id,
        event_time: new Date().toISOString().slice(0,19).replace('T',' '),
        event_description : this.pointBase.comments,
        player_id : Number(this.selectedStriker),
        secondary_player_id : !this.selectedAssist ? null : Number(this.selectedAssist),
        event_type : this.selectedEvent,
      };//object for events which hold events table data model pattren
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
        this.pointBase = {
          team1_name: rep.Team1,    // Map Team1 to team1_name
          team2_name: rep.Team2,    // Map Team2 to team2_name
          setsWon: 0,           // Initialize goals for team 1
          fixture_id: id,           // Use the passed fixture id
          selectedTeam: null,       // Set to null or modify as needed (e.g., based on logic)
          comments: "",             // Initialize comments (empty string by default)
        };
    
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