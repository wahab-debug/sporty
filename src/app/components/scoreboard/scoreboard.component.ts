import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScoringService } from '../../service/scoring.service';
import { ToastrService } from 'ngx-toastr';
import { MemoriesService } from '../../service/memories.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatchEventsService } from '../../service/match-events.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent implements OnInit {
  constructor(private route: ActivatedRoute, private scoringService: ScoringService, private toastr: ToastrService, private memoryservice: MemoriesService, private matchEvent: MatchEventsService){}
  sport: string = ''; // or 'goalbase' or 'pointbase'
  matchId;
  matchEventsVar : any;
  filteredMatchEvents: any[] = [];
  selectedEventType: string = "Goal";  // Default event type


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
      team1_setsWon: 0, // For Pointbase
      team2_setsWon: 0, // For Pointbase
      memories: []
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
    checkLink(){
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.sport = this.route.snapshot.paramMap.get('game');    
    this.getScores(this.matchId);
    }
    getScores(fid:number){
      this.scoringService.matchScores(fid).subscribe({
        next:res=>{
          this.details = res as any
          this.TeamScores = this.details.ScoreDetails;
          this.matchDetails = this.details.Fixture;
          this.getImages();
          this.getEvents();
        },
        error:err=>{
          this.toastr.warning("Match not started yet");
        }
      });
    }
    getImages(){
      this.memoryservice.GetImages(this.matchId).subscribe({
        next:res=>{
          // if(Array.isArray(res)){
          //   this.matchDetails.memories = res
          //   this.matchDetails.memories = (res as string[]).map((path: string) => path.replace(/\\/g, '/'));
          // }else{
          //   console.error('The response is not an array:', res);
          // }
          this.matchDetails.memories = res
        },
        error:(err: HttpErrorResponse)=>{
          if(err.status===404){
            setTimeout(() => {
              this.toastr.info("No memories found for this match.");
            }, 500);
          }else{
              this.toastr.show(err.message || "An error occurred");
          }
        }
      });
    }
    getEvents(){
      this.matchEvent.getMatchEvents(this.matchId).subscribe({
        next:res=>{
          this.matchEventsVar = res;
          this.filterEventsByType();  // Initially filter events by default selected type          
        },
        error:err=>{
          this.toastr.error(err.message);
        }
      });
    }
    onEventTypeChange() {
      this.filterEventsByType();
    }
  
    // Filter events based on the selected event type
    filterEventsByType() {
      this.filteredMatchEvents = this.matchEventsVar.filter(event => event.event_type === this.selectedEventType);
    }
  
    
}
