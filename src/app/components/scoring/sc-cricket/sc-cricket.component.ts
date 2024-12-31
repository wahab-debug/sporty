import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../service/player.service';
import { MemoriesService } from '../../../service/memories.service';
import { ToastrService } from 'ngx-toastr';
import { ScoringService } from '../../../service/scoring.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sc-cricket',
  templateUrl: './sc-cricket.component.html',
  styleUrl: './sc-cricket.component.css'
})
export class ScCricketComponent implements OnInit {

  constructor(private router: ActivatedRoute, private playerService: PlayerService, private imgService: MemoriesService, private toastr: ToastrService, private scoringService: ScoringService, private redirect: Router){}
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
  finish:boolean = false;
  selectedBowler = null;
  selectedEvent = null;
  selectedBatsman = null;
  selectedFielder = null;
  players :any []= [];
  second : any [] = [];
  imagePaths: string[] = [];
  onSelected(f:string, s:string){
    const first = f;
    const second = s;
    if(first){
      this.teamVal = first
      this.playerService.getPlayerByTeamName(first).subscribe({
        next: res=>{
          this.players = res as any;
          console.log(this.players);
        }
      });
      this.playerService.getPlayerByTeamName(second).subscribe({
        next: res=>{
          this.second = res as any;
          console.log(this.players);
          
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
      fixture_id: this.cricketScore.fixture_id
    };
    this.scoringService.AddOrUpdateCricketScore(scoringObj.team_id,scoringObj.score,scoringObj.overs,scoringObj.wickets,scoringObj.fixture_id).subscribe({
      next:res=>{
        this.toastr.success("Score Updated")
      }
    });
    console.log(scoringObj);
    const imageObj = {
      fixture_id: this.cricketScore.fixture_id,
      image_time: new Date().toISOString().slice(0,19).replace('T',' ')

    }
    console.log(imageObj);
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
    console.log(this.finish);  
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
      this.imgService.UploadImage(id, formData).subscribe({
        next: (res) => {
          this.toastr.success('Images uploaded successfully!');
          console.log('Upload response:', res);
        },
        error: (err) => {
          this.toastr.error('Image upload failed.');
          console.error('Upload error:', err);
        }
      });
    } else {
      console.log('No files selected.');
    }

  }
  getDropDownValues(){
    this.playerService.getPlayerByTeamName(this.teamVal).subscribe({
      next: res=>{
        this.players = res as any;
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

}
