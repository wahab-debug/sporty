import { Component, OnInit } from '@angular/core';
import { SessionperformanceService } from '../../service/sessionperformance.service';
import { EventService } from '../../service/event.service';

@Component({
  selector: 'app-sessionsummary',
  templateUrl: './sessionsummary.component.html',
  styleUrl: './sessionsummary.component.css'
})
export class SessionsummaryComponent implements OnInit {
  sessionSummary: SessionSummary | null = null; // Use the interface here
  errorMessage: string = '';
  selectedSession: number = 3; // Default session
  sessionList

  constructor(private sessionPerformance: SessionperformanceService, private eventService: EventService) {}

  ngOnInit(): void {
    this.letbet();
    this.getSessionSummary(this.selectedSession);
  }
  letbet(){
    this.eventService.getAllSession().subscribe(
      res=>{
        this.sessionList = res        
      }
    );
  }

  getSessionSummary(sessionId: number) {
    this.sessionPerformance.sessionGistforAdmin(sessionId).subscribe({
      next: (data: SessionSummary) => {
        // Normalize the data
        this.sessionSummary = {
          finalList: Array.isArray(data.finalList) ? data.finalList : [],
          topScorer: typeof data.topScorer === 'string' ? [] : data.topScorer,
          bestPlaye: typeof data.bestPlaye === 'string' ? [] : data.bestPlaye,
          wicketTaker: typeof data.wicketTaker === 'string' ? [] : data.wicketTaker,
          goalScoere: Array.isArray(data.goalScoere) ? data.goalScoere : []
        };
      },
      error: (err) => {
        this.errorMessage = 'Error fetching session summary: ' + (err.error?.Message || err.message);
        this.sessionSummary = null;
      }
    });
  }
}
interface SessionSummary {
  finalList: any[]; // Replace 'any' with a more specific type if possible
  topScorer: any[] | string; // Can be an array or a string
  bestPlaye: any[] | string; // Can be an array or a string
  wicketTaker: any[] | string; // Can be an array or a string
  goalScoere: any[]; // Replace 'any' with a more specific type if possible
}