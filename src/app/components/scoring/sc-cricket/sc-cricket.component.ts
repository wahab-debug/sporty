import { Component, Input, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../service/player.service';
import { ToastrService } from 'ngx-toastr';
import { ScoringService } from '../../../service/scoring.service';
import { TeamService } from '../../../service/team.service';
import { forkJoin, map } from 'rxjs'; // Add this import
import { CricketspecialService } from '../../../service/cricketspecial.service';

@Component({
  selector: 'app-sc-cricket',
  templateUrl: './sc-cricket.component.html',
  styleUrl: './sc-cricket.component.css'
})
export class ScCricketComponent implements OnInit {

  constructor(private router: ActivatedRoute, private playerService: PlayerService, private teamService: TeamService, private toastr: ToastrService, private redirect: Router, private cricketService: CricketspecialService, private scoringService: ScoringService){}

  @ViewChild('imagePicker') imagePicker: ElementRef; // Add this line
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
  matchDetails: MatchDetails = {} as MatchDetails;
  team1Players: Player[] = [];
  team2Players: Player[] = [];
  team1Id: number;
  team2Id: number;
  selectedTeam: string = 'India';  // Initialize with a default team
  striker: number = 0;
  nonStriker: number = 0;
  bowler: number = 0;
  fielder: number = 0;
  runsScored: number = 0;
  extras: boolean = false;
  isOut: boolean = false;
  over: number = 0;
  ball: number = 1;
  selectedImage: string | ArrayBuffer | null = null;
  dismissedPlayer: number | null = null;
  selectedExtra: string | null = null;
  selectedOut: string | null = null;


  // Extras options
  extraScenarios = ['No-Ball', 'Wide', 'Byes', 'Leg Byes', 'Penalty Runs'];

  // Out scenarios
  outScenarios = ['Bowled', 'Caught', 'Run Out', 'Stumped', 'Hit Wicket'];
    
  ngOnInit(): void {
    this.loadTeamsAndPlayers();
  }
  // private loadTeamsAndPlayers() {
  //   this.cricketScore.fixture_id = Number(this.router.snapshot.paramMap.get('id'));
  //   this.teamService.playingTeams(this.cricketScore.fixture_id).subscribe({
  //     next: (teams: any) => {
  //       this.matchDetails.team1 = teams.Team1;
  //       this.matchDetails.team2 = teams.Team2;
  //       this.team1Id = teams.team1Id;
  //       this.team2Id = teams.team2Id;

  //       forkJoin({
  //         team1: this.playerService.getTeamPlayers(this.team1Id).pipe(
  //           map((response: any) => response as Player[]) // Type assertion here
  //         ),
  //         team2: this.playerService.getTeamPlayers(this.team2Id).pipe(
  //           map((response: any) => response as Player[]) // Type assertion here
  //         )
  //       }).subscribe({
  //         next: ({team1, team2}) => {
  //           this.team1Players = team1;
  //           this.team2Players = team2;
  //         },
  //         error: (err) => this.toastr.error('Failed to load players')
  //       });
  //     },
  //     error: (err) => this.toastr.error('Failed to load teams')
  //   });
  // }
  
  private loadTeamsAndPlayers() {
    this.cricketScore.fixture_id = Number(this.router.snapshot.paramMap.get('id'));
    
    this.teamService.playingTeams(this.cricketScore.fixture_id).subscribe({
      next: (teams: any) => {
        this.matchDetails.team1 = teams.Team1;
        this.matchDetails.team2 = teams.Team2;
        this.team1Id = teams.team1Id;
        this.team2Id = teams.team2Id;
  
        // Load team1 players
        this.playerService.getTeamPlayers(this.team1Id).subscribe({
          next: (team1Players: Player[]) => {
            this.team1Players = team1Players;
          },
          error: (err) => this.toastr.error('Failed to load Team 1 players')
        });
  
        // Load team2 players
        this.playerService.getTeamPlayers(this.team2Id).subscribe({
          next: (team2Players: Player[]) => {
            this.team2Players = team2Players;
          },
          error: (err) => this.toastr.error('Failed to load Team 2 players')
        });
      },
      error: (err) => this.toastr.error('Failed to load teams')
    });
  }
  //update ball count
  private updateBallAndOver(isBallCounted: boolean) {
    if (isBallCounted) {
      this.ball++;
      
      // Check for over completion and make bowler null
      if (this.ball > 6) {
        this.over++;
        this.bowler = 0;
        this.ball = 1;
        
        // Swap striker/non-striker at over change
        [this.striker, this.nonStriker] = [this.nonStriker, this.striker];
      }
    }
  }
  //reset form fields
  private resetFormFields() {
        // Preserve striker positions unless out
        if (this.isOut && (this.selectedOut === 'Bowled' || this.selectedOut === 'Caught' || this.selectedOut === 'Stumped' || this.selectedOut === 'Hit Wicket')) {
          this.striker = 0;
          this.fielder = 0;
        }
        if (this.isOut && (this.selectedOut === 'Run Out')) {
          this.striker = 0;
          this.nonStriker = 0;
          this.fielder = 0;
        }
    // Reset all form controls
    this.runsScored = 0;
    this.selectedImage = null;
    this.selectedExtra = null;
    this.extras = false;
    this.isOut = false;
    this.selectedOut = null;
    this.dismissedPlayer = null;
    this.fielder = null;
  
    // Clear file input
    if (this.imagePicker) {
      this.imagePicker.nativeElement.value = '';
    }
  
  }
  // reset out and relevant checkboxes
  onOutChange() {
    if (!this.isOut) {
      // Reset selected out scenario and dismissed player when Out checkbox is unchecked
      this.selectedOut = null;
      this.dismissedPlayer = null;
      this.fielder = null
    }
  }
  // reset extra and relevant checkboxes
  onExtrasChange() {
    if (!this.extras) {
      // Reset selected extra scenario when Extras checkbox is unchecked
      this.selectedExtra = null;
    }
  }
  //get team players of batting teams
  getTeamPlayers(teamName: string): Player[] {
    return teamName === this.matchDetails.team1 ? this.team1Players : this.team2Players;
  }
  //get team players of non-batting teams
  getNonSelectedTeamPlayers(teamName: string): Player[] {
    return teamName === this.matchDetails.team1 ? this.team2Players : this.team1Players;
  }
  //image url create
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  //set initially
  setBattingTeam(team: string) {
    this.selectedTeam = team;
    this.striker = 0;
    this.nonStriker = 0;
    this.bowler = 0;
    this.fielder = 0;
  }
  //on submit logic
  submitScore() {
    // Validate selections
    //if striker and non tsriker are same
    if (this.striker === this.nonStriker) {
      this.toastr.error("Striker and Non-Striker cannot be the same.");
      return;
    }
    //if striker or non striker not selected
    if ( this.striker === 0 || this.nonStriker === 0) {
      this.toastr.error("Please select striker and non striker.");
      return;
    }
    //if striker or non striker not selected
    if ( this.bowler === 0) {
      this.toastr.error("Please select a bowler.");
      return;
    }
    //if ball is invalid
    if ( this.ball < 1 || this.ball > 6) {
      this.toastr.error("Select valid ball number (1-6).");
      return;
    }
    //if over is invalid
    if ( this.over < 0 || this.over === 4) {
      this.over = 0
      this.toastr.error("four over format (0-3).");
      return;
    }
    // Initialize scoring variables
    let runs_scored = 0;
    let extra_runs = 0;
    let isBallCounted = true;
  
    // Handle different scoring scenarios
    if (this.isOut) {
      // Rule 3: All runs go to batsman if out occurs
      runs_scored = this.runsScored;
      extra_runs = 0;
      isBallCounted = true;
    } else if (this.extras) {
      switch (this.selectedExtra) {
        case 'No-Ball':
          // Rule 1: 1 automatic extra + batsman runs
          extra_runs = 1;
          runs_scored = this.runsScored;
          isBallCounted = false;
          break;
        case 'Wide':
          // 1 automatic extra + additional wides
          extra_runs = this.runsScored > 0 ? this.runsScored : 1;
          runs_scored = 0;
          isBallCounted = false; // Wide balls are re-bowled
          break;
        case 'Byes':
        case 'Leg Byes':
          // All runs are extras
          extra_runs = this.runsScored;
          runs_scored = 0;
          isBallCounted = true;
          break;
        case 'Penalty Runs':
          // Typically fixed 5 runs but using input value
          extra_runs = this.runsScored;
          runs_scored = 0;
          isBallCounted = false;
          break;
        default:
          extra_runs = this.runsScored;
          runs_scored = 0;
          isBallCounted = true;
      }
    } else {
      // Normal delivery
      runs_scored = this.runsScored;
      extra_runs = 0;
      isBallCounted = true;
    }
    // Handle image conversion
    const imagePath = this.selectedImage ? this.selectedImage.toString() : '';
    
    
  const score = {
    fixture_id: this.cricketScore.fixture_id,
    team_id: this.selectedTeam === this.matchDetails.team1 
              ? this.team1Id 
              : this.team2Id,
    over_number: this.over,
    ball_number: this.ball,
    runs_scored: Number(runs_scored),
    striker_id: Number(this.striker),
    non_striker_id: Number(this.nonStriker),
    bowler_id: Number(this.bowler),
    extras: this.selectedExtra,
    extra_runs: Number(extra_runs),
    wicket_type: this.isOut ? this.selectedOut : null,
    dismissed_player_id: this.isOut ? Number(this.dismissedPlayer) : null,
    fielder_id: this.isOut ? Number(this.fielder) : null,
    image_Path : imagePath
  }
      // Submit to API
    this.cricketService.AddCricketScore(score).subscribe({
      next: (response) => {
        this.toastr.success('Score submitted successfully!');
          // Swap strikers for odd runs if not out
          if (!this.isOut && (Number(this.runsScored) % 2 !== 0)) {
            [this.striker, this.nonStriker] = [this.nonStriker, this.striker];
          }
        this.resetFormFields();
        this.updateBallAndOver(isBallCounted);
      },
      error: (err) => {
        this.toastr.error('Error submitting score',err.error);
      }
    });
  }
  //on end match logic
  endMatch(){
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
}


interface MatchDetails {
fixture_id: number;
team1: string;
team2: string;
noBalls: number;
wides: number;
extras: number;
}
interface Player {
  reg_no: string;
  teamName: string;
  playerName: string;
  playerId : number
}
