import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../service/event.service';
import { MatchEventsService } from '../../../service/match-events.service';
import { MemoriesService } from '../../../service/memories.service';
import { ScoringService } from '../../../service/scoring.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pointbasescore',
  templateUrl: './pointbasescore.component.html',
  styleUrls: ['./pointbasescore.component.css']
})
export class PointbasescoreComponent implements OnInit, OnDestroy {
  sport: string = ''; // or 'goalbase' or 'pointbase'
  matchId: number;
  matchEventsVar: any;
  filteredMatchEvents: any[] = [];
  selectedEventType: string = '';  // Default event type
  sportType: string = '';
  matchDetails: any = {};
  details: any = { Fixture: {}, ScoreDetails: [] };
  interval;
  showOverlay: boolean = false;
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private scoringService: ScoringService,
    private toastr: ToastrService,
    private memoryservice: MemoriesService,
    private matchEvent: MatchEventsService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.checkLink();
    this.getSportType();

    // Refresh match details every 30 seconds
    this.interval = setInterval(() => {
      this.checkLink();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Get sport type from backend
  getSportType() {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getSportType(this.matchId).subscribe({
      next: (res) => {
        this.sportType = res as string;
      }
    });
  }

  // Check match link and update the match details
  checkLink() {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.sport = this.route.snapshot.paramMap.get('game');
    this.getScores(this.matchId);
  }

  // Get match scores from backend
  getScores(fid: number) {
      this.scoringService.matchScores(fid).subscribe({
        next: (res) => {
          this.details = res as any;
          this.matchDetails = this.details.Fixture;
          this.getImages();
          this.getEvents();
        },
        error: (err) => {
          this.toastr.warning("Match not started yet");
        }
      });
  }

  // Get match memories (images/videos) from backend
  getImages() {
    this.memoryservice.GetImages(this.matchId).subscribe({
      next: (res) => {
        this.matchDetails.memories = res;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.toastr.info("No memories found for this match.");
        } else {
          this.toastr.show(err.message || "An error occurred");
        }
      }
    });
  }

  // Get match events from backend
  getEvents() {
    this.matchEvent.getMatchEvents(this.matchId).subscribe({
        next: (res) => {
            this.matchEventsVar = res;
            this.filterEventsByType(); // Initialize filtered events
        },
        error: (err) => {
            this.toastr.error(err.message);
        }
    });
}
  // Handle event type selection
  onEventTypeChange() {
    this.filterEventsByType();
  }

  // Filter events based on selected event type
  filterEventsByType() {
    if (this.selectedEventType) {
        this.filteredMatchEvents = this.matchEventsVar.filter(event => 
            event.event_type === this.selectedEventType
        );
    } else {
        // Show all events when "All Events" is selected
        this.filteredMatchEvents = [...this.matchEventsVar];
    }
}

  // Helper method to fetch setsWon for the team (for Point-Based Scoring)
  getSetsWon(teamName: string): number {
    const scoreDetail = this.details.ScoreDetails[0];  // Assuming only one score type (Point-Based Scoring)
    if (scoreDetail && scoreDetail.Score) {
      const teamScore = scoreDetail.Score.find(score => {
        return teamName === this.matchDetails.Team1Name ? score.TeamId === this.matchDetails.team1_id : score.TeamId === this.matchDetails.team2_id;
      });
      return teamScore ? teamScore.setsWon : 0; // If no setsWon is found, return 0
    }
    return 0;  // Return 0 if no ScoreDetails exist
  }
  openImageOverlay(image: string) {
    this.selectedImage = image;
    this.showOverlay = true;

    // Close the overlay after 3 seconds
    setTimeout(() => {
      this.closeOverlay();
    }, 3000); // 3000ms = 3 seconds
  }

  // Function to close the image overlay
  closeOverlay() {
    this.showOverlay = false;
  }
  getEventIconClass(eventType: string): string {
    const iconMap = {
        'Point Scored': 'icon-trophy',
        'Ace Serve': 'icon-lightning',
        'Smash': 'icon-fire',
        'Defensive Save': 'icon-shield',
        'Foul': 'icon-warning'
    };
    return iconMap[eventType] || 'icon-default';
}
}
