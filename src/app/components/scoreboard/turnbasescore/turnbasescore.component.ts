import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatchEventsService } from '../../../service/match-events.service';
import { MemoriesService } from '../../../service/memories.service';
import { ScoringService } from '../../../service/scoring.service';

@Component({
  selector: 'app-turnbasescore',
  templateUrl: './turnbasescore.component.html',
  styleUrl: './turnbasescore.component.css'
})
export class TurnbasescoreComponent implements OnInit, OnDestroy {
  matchId!: number;
  matchDetails: any = {};
  matchEvents: any[] = [];
  filteredMatchEvents: any[] = [];
  selectedEventType: string = '';
  showOverlay = false;
  selectedImage = '';
  private refreshInterval: any;

  constructor(
    private route: ActivatedRoute,
    private scoringService: ScoringService,
    private matchEventsService: MatchEventsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
    this.refreshInterval = setInterval(() => this.loadData(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  private loadData(): void {
    this.loadMatchDetails();
    this.loadMatchEvents();
  }

  private loadMatchDetails(): void {
    this.scoringService.matchScores(this.matchId).subscribe({ 
      next: (res:MatchScoreResponse) => {
        // Extract Fixture and ScoreDetails from the response:
        this.matchDetails = { ...res.Fixture, ScoreDetails: res.ScoreDetails || [] };
      },
      error: (err: HttpErrorResponse) => this.toastr.error('Failed to load match details')
    });
  }
  

  private loadMatchEvents(): void {
    this.matchEventsService.getMatchEvents(this.matchId).subscribe({
      next: (res) => {
        this.matchEvents = res as any;
        this.filterEvents();
      },
      error: (err) => this.toastr.error('Failed to load match events')
    });
  }


  // getTurnsWon(teamName: string): number {
  //   const scoreDetail = this.matchDetails.ScoreDetails
  //     .find((s: any) => s.Type === 'Turn-Based');
  //   if (!scoreDetail) return 0;

  //   const teamId = teamName === this.matchDetails.Team1Name ? 
  //     this.matchDetails.team1_id : 
  //     this.matchDetails.team2_id;
      
  //   return scoreDetail.Score.find((s: any) => s.TeamId === teamId)?.turnsWon || 0;
  // }

  getWinnerName(): string {
    if (!this.matchDetails.winner_id) return '';
    return this.matchDetails.winner_id === this.matchDetails.team1_id ? 
      this.matchDetails.Team1Name : 
      this.matchDetails.Team2Name;
  }

  onEventTypeChange(): void {
    this.filterEvents();
  }

  private filterEvents(): void {
    this.filteredMatchEvents = this.selectedEventType ?
      this.matchEvents.filter(e => e.event_type === this.selectedEventType) :
      [...this.matchEvents];
  }

  getEventIcon(eventType: string): string {
    const icons: { [key: string]: string } = {
      'Move': 'tb-icon-move',
      'Check': 'tb-icon-check',
      'Capture': 'tb-icon-capture',
      'Special': 'tb-icon-special'
    };
    return icons[eventType] || 'tb-icon-default';
  }

  openImageOverlay(imagePath: string): void {
    this.selectedImage = imagePath;
    this.showOverlay = true;
  }

  closeOverlay(): void {
    this.showOverlay = false;
  }
}
interface MatchScoreResponse {
  Fixture: {
    id: number;
    team1_id: number;
    team2_id: number;
    matchDate: string;
    venue: string;
    winner: number;
    Team1Name: string;
    Team2Name: string;
    Comments: string;
  };
  ScoreDetails: {
    Type: string;
    Score: any[];
  }[];
}
