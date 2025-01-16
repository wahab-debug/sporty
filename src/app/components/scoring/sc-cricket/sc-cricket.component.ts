import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../service/player.service';
import { MemoriesService } from '../../../service/memories.service';
import { ToastrService } from 'ngx-toastr';
import { ScoringService } from '../../../service/scoring.service';
import { TeamService } from '../../../service/team.service';
import { MatchEventsService } from '../../../service/match-events.service';

@Component({
  selector: 'app-sc-cricket',
  templateUrl: './sc-cricket.component.html',
  styleUrl: './sc-cricket.component.css'
})
export class ScCricketComponent implements OnInit {

  constructor(private router: ActivatedRoute, private playerService: PlayerService, private teamService: TeamService , private imgService: MemoriesService, private toastr: ToastrService, private scoringService: ScoringService, private redirect: Router, private matchEventService: MatchEventsService){}
  ngOnInit(){
    this.teamVal = this.cricketScore.team2_name;
    this.getDropDownValues();
  }
 @Input() cricketScore:{
  team1_name:string,
  team2_name:string,
  score:number,
  overs:number,
  wicket:number,
  comments: string,
  path : string,
  fixture_id: number
  };
  sport;
  teamVal;
  selectedBowler = null;
  selectedEvent = null;
  selectedBatsman = null;
  selectedFielder = null;
  players :any []= [];
  second : any [] = [];
  imagePaths: string[] = [];
  imgPath : string;
  onSelected(f:string, s:string){
    const first = f;
    const second = s;
    if(first){
      this.teamVal = first
      this.playerService.getPlayerByTeamName(first).subscribe({
        next: res=>{
          this.players = res as any;
        }
      });
      this.playerService.getPlayerByTeamName(second).subscribe({
        next: res=>{
          this.second = res as any;          
        }
      });
    }
   }
  onSubmit(s){
    this.router.paramMap.subscribe({
      next:res=>{ 
        this.cricketScore.fixture_id = Number(res.get('id'));        
      }
    });    
    const scoringObj = {
      team_id: this.teamVal,
      score : this.cricketScore.score,
      overs : this.cricketScore.overs,
      wickets: this.cricketScore.wicket,
      FixtureId: this.cricketScore.fixture_id
    };
    this.scoringService.AddOrUpdateCricketScore(scoringObj.team_id,scoringObj.score,scoringObj.overs,scoringObj.wickets,scoringObj.FixtureId).subscribe({
      next:res=>{
        this.toastr.success("Score Updated")
      }
    });
    const eventsObj = {
      fixture_id: this.cricketScore.fixture_id,
      event_time: new Date().toISOString().slice(0,19).replace('T',' '),
      event_description : this.cricketScore.comments,
      player_id : Number(this.selectedBatsman),
      secondary_player_id : Number(this.selectedBowler),
      event : this.selectedEvent,
      fielder_id: Number(this.selectedFielder),
      
    }
    console.log(eventsObj);
    this.onImageChange(this.cricketScore.fixture_id);
  }
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
  //fill dropdown values for players
  getDropDownValues(){
    this.playerService.getPlayerByTeamName(this.teamVal).subscribe({
      next: res=>{
        this.players = res as any;
      }
    });
    let id = 0;
    this.router.paramMap.subscribe({
      next:res=>{ 
        id = Number(res.get('id'));        
      }
    })
    this.teamService.playingTeams(id).subscribe({
      next:(rep: TeamResponse)=>{
        this.cricketScore = {
          team1_name: rep.Team1, 
          team2_name: rep.Team2,
          score: 0,               // Initialize score to 0, modify as per actual data
          overs: 0,               // Initialize overs to 0, modify as per actual data
          wicket: 0,              // Initialize wicket to 0, modify as per actual data
          comments: "",           // Initialize comments, modify as per actual data
          path: "",               // Initialize path, modify as per actual data
          fixture_id: id    
        }
        
      }
    });
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
      this.scoringService.UpdateCricketWinner(currentFixture).subscribe({
        next:res=>{
          this.toastr.success("Match ended!");

          setTimeout(() => {
            this.redirect.navigateByUrl(`/gistAdd/${currentGame}/match/${currentFixture}`);
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
      fixture_id: this.cricketScore.fixture_id,
      event_time: new Date().toISOString().slice(0,19).replace('T',' '),
      event_description : this.cricketScore.comments,
      player_id : Number(this.selectedBatsman),
      secondary_player_id : !this.selectedBowler ? null : Number(this.selectedBowler),
      fielder_id : !this.selectedFielder ? null : Number(this.selectedFielder),
      event_type : this.selectedEvent,
    };//object for events which hold events table data model pattren
    this.matchEventService.AddMatchEvents(eventsObj,path).subscribe({
      next:res=>{
        console.log(eventsObj);
      },
      error:err=>{
        console.log(err.message);
      }
    });
  }
  getValues(){
    let id = 0;
    this.router.paramMap.subscribe({
      next:res=>{ 
        id = Number(res.get('id'));        
      }
    })
    this.teamService.playingTeams(id).subscribe({
      next: (rep: TeamResponse) => {
        this.cricketScore = {
          team1_name: rep.Team1,    // Map Team1 to team1_name
          team2_name: rep.Team2,    // Map Team2 to team2_name
          score: 0,           // Initialize goals for team 1
          wicket: 0,           // Initialize goals for team 2
          fixture_id: id,           // Use the passed fixture id
          overs: 0,                 // Initialize total goals
          comments: "",             // Initialize comments (empty string by default)
          path: ''
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