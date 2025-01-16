import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlayerService } from '../../../../service/player.service';
import { ScoringService } from '../../../../service/scoring.service';
import { TeamService } from '../../../../service/team.service';

@Component({
  selector: 'app-performance-gist',
  templateUrl: './performance-gist.component.html',
  styleUrl: './performance-gist.component.css'
})
export class PerformanceGistComponent implements OnInit {
    constructor(private router: ActivatedRoute, private playerService: PlayerService, private teamService: TeamService, private toastr: ToastrService, private scoringService: ScoringService, private redirect: Router){}
  ngOnInit(){
    this.getValues();
  }
  // Define the structure of the cricketScore object
  cricketScore = {
    team1_name: 'Team A',
    team2_name: 'Team B',
    team1Id: 0,
    team2Id:0 
  };
  team1 = {
    selectedPlayer: null,
    scores: null,
    ballsConsumed: null,
  };
  team2 = {
    selectedPlayer: null,
    scores: null,
    ballsConsumed: null,
  };

  players :any []= [];    //handle team 1 player list
  second : any [] = [];   //handle team 2 player list
   
   //fill dropdown values for players
    getDropDownValues(){
      this.playerService.getPlayerByTeamName(this.cricketScore.team1_name).subscribe({
        next: res=>{
          this.players = res as any;
        }
      });
      this.playerService.getPlayerByTeamName(this.cricketScore.team2_name).subscribe({
        next: res=>{
          this.second = res as any;
        }
      });
    }
   //get team names that are playing matches against a fixture id
    getValues(){
      let id = 0;
      this.router.paramMap.subscribe({
         next:res=>{ 
            id = Number(res.get('id'));        
          }
          });
      this.teamService.playingTeams(id).subscribe({
          next: (rep: TeamResponse) => {
            this.cricketScore.team1_name = rep.Team1;
            this.cricketScore.team2_name = rep.Team2;
            this.cricketScore.team1Id = rep.team1Id;
            this.cricketScore.team2Id = rep.team2Id;            
            this.getDropDownValues()
            }
          });
          
    }
    //handle submit form scenario
    onSubmit() {
      if (
        this.team1.selectedPlayer &&
        this.team1.scores !== null &&
        this.team1.ballsConsumed !== null &&
        this.team2.selectedPlayer &&
        this.team2.scores !== null &&
        this.team2.ballsConsumed !== null
      ) {
        let id = 0;
        this.router.paramMap.subscribe({
           next:res=>{ 
              id = Number(res.get('id'));        
            }
            });
            const payload = [
              {
                fixture_id: id,
                team_id: Number(this.cricketScore.team1Id),
                player_id: Number(this.team1.selectedPlayer),
                score: Number(this.team1.scores),
                ball_consumed: Number(this.team1.ballsConsumed),
              },
              {
                fixture_id: id,
                team_id: Number(this.cricketScore.team2Id),
                player_id: Number(this.team2.selectedPlayer),
                score: Number(this.team2.scores),
                ball_consumed: Number(this.team2.ballsConsumed),
              }
            ];
        this.scoringService.PostHighScorer(payload).subscribe({
          next: () => {
            this.toastr.success("scores added successfully");
            this.redirect.navigateByUrl('allsports/schedules/Cricket');
          },
          error: (err) => this.toastr.error(err.message),
        });
      } else {
        this.toastr.warning("Please fill all fields for both teams.");
      }
    }
  

}
interface TeamResponse {
  Team1: string;
  team1Id:number;
  Team2: string;
  team2Id: number
}