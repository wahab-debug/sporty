import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemoriesService } from '../../../service/memories.service';
import { PlayerService } from '../../../service/player.service';
import { ScoringService } from '../../../service/scoring.service';

@Component({
  selector: 'app-sc-turnbase',
  templateUrl: './sc-turnbase.component.html',
  styleUrls: ['./sc-turnbase.component.css']
})
export class ScTurnbaseComponent {
   constructor(
      private playerService: PlayerService, 
      private scoringService: ScoringService, 
      private toastr: ToastrService, 
      private imgService: MemoriesService, 
      private router: ActivatedRoute, 
      private redirect: Router
    ) {}
    @Input() turnBase : {
      team1_name: string;
      team2_name: string;
    }  
  // Define properties to store form data
  gameState = {
    player1_name: 'Spades',   // Example default names
    player2_name: 'Dragon',   // Example default names
    move_details: '',           // Details of the move
    event_type: '1',            // Event type (default to 1)
    player_involved: '1',       // Player involved (default to Player 1)
  };
 
  selectedTeam;
  players : any [] = [];
  selectedPlayer;
  imagePaths: any [] = [];

  // Handle form submission
  onSubmit(action: string): void {
    console.log(this.selectedTeam);
    
    this.onImageChange(2);

  }
  onImageChange(id: any): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagePaths = Array.from(input.files).map((file: File) => URL.createObjectURL(file));

      const formData = new FormData();
      Array.from(input.files).forEach((file) => {
        formData.append('files', file);
      });
      console.log(this.imagePaths);
      
      // this.imgService.UploadImage(id, formData).subscribe({
      //   next: (res) => {
      //     this.toastr.success('Images uploaded successfully!');
      //   },
      //   error: (err) => {
      //     this.toastr.error('Image upload failed.');
      //   }
      // });
    } else {
      console.log('No files selected.');
    }
  }
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
      // this.scoringService.UpdateGoalBasedWinner(currentFixture).subscribe({
      //   next:res=>{
      //     this.toastr.success("Match ended!");
      //     setTimeout(() => {
      //       this.redirect.navigateByUrl("/allsports/schedules/"+currentGame);
      //     }, 500);//redirect to other screen afer success
      //   },
      //   error:err=>{
      //     this.toastr.error(err.message); //api response error
      //   }
      // });      
    } else {
      this.toastr.show("Match not ended."); //confirmation response show
    }
  }
}
