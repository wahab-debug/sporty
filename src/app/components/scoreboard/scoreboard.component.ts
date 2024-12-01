import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScoringService } from '../../service/scoring.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent implements OnInit {
  constructor(private route: ActivatedRoute, private scoringService: ScoringService, private toastr: ToastrService){}
  sport: string = ''; // or 'goalbase' or 'pointbase'
  matchId;

  // Match details including scores, memories (images/videos)
  matchDetails: any = {
    team1_name: 'Team A',
    team2_name: 'Team B',
    team1_score: 250,
    team2_score: 220,
    team1_overs: '50',
    team2_overs: '50',
    team1_wickets: 8,
    team2_wickets: 10,
    team1_goals: 0,  // For Goalbase
    team2_goals: 0,  // For Goalbase
    team1_setsWon: 2, // For Pointbase
    team2_setsWon: 3, // For Pointbase
    memories: [  // Match memories for the entire game, not specific to a team
      { type: 'image', url: 'https://via.placeholder.com/500x300' }, // Match memory (image)
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }, // Match video
      { type: 'image', url: 'https://via.placeholder.com/500x300' }, // Another image
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' } // Another video
    ]
  };
  details:any = {
    Fixture :{
      id : 0,
      matchDate : '',
      team1_id : 0,
      team2_id: 0,
      venue: '',
      Team1Name: '',
      Team2Name: '',
      Comments: ''
    },
    ScoreDetails:{
      teamId:0,
      goals:0           
    }
  };
  TeamScores: any[] = [
    {
      Type: '',  // Type can be a string like 'Goal-Based Scoring'
      Score: [
        {
          TeamId: '',   // Typically, TeamId would be a number
          goals: '',     // goals would also be a number
          setsWon:'',
        }
      ]
    }
  ];

  ngOnInit() {
   this.checkLink();
  }
  get formattedComments(){
    return this.matchDetails.Comments.replace(/\. /g, '.\n');
  }
  checkLink(){
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.sport = this.route.snapshot.paramMap.get('game');
    this.getScores(this.matchId);
    }
    getScores(id:number){
      this.scoringService.matchScores(id).subscribe({
        next:res=>{
          this.details = res as any
          this.TeamScores = this.details.ScoreDetails;
          this.matchDetails = this.details.Fixture;
          
        },
        error:err=>{
          this.toastr.warning("Match not started yet");
        }
      });
    }
    
}
