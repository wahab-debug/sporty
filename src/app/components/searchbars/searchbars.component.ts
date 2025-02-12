import { Component } from '@angular/core';
import { SessionperformanceService } from '../../service/sessionperformance.service';
import { ToastrService } from 'ngx-toastr';
import { timeout, TimeoutError } from 'rxjs';

@Component({
  selector: 'app-searchbars',
  templateUrl: './searchbars.component.html',
  styleUrl: './searchbars.component.css'
})
export class SearchbarsComponent {
  firstSearchResult: any;
  secondSearchResult: any;
  loading = false;
  errorMessage = '';

  constructor(private sessionPerformance: SessionperformanceService) {}

  searchMyData(searchTerm: string, searchType: number) {
    if (!searchTerm) {
      this.errorMessage = 'Please enter a valid registration number';
      return;
    }
  
    this.loading = true;
    this.errorMessage = '';
  
    // Clear previous results
    if (searchType === 1) this.firstSearchResult = null;
    else this.secondSearchResult = null;
  
    const searchObservable = searchType === 1 
      ? this.sessionPerformance.GetUserTeams(searchTerm).pipe(timeout(10000))
      : this.sessionPerformance.Getplayerrunsbybymatches(searchTerm).pipe(timeout(10000));
  
    searchObservable.subscribe({
      next: (data) => {
        if (searchType === 1) this.firstSearchResult = data;
        else this.secondSearchResult = data;
        console.log(this.secondSearchResult);
        
        this.loading = false;
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.errorMessage = 'No data found within 10 seconds. Please try again.';
        } else {
          this.errorMessage = err.error?.Message || 'Failed to fetch data. Please try again.';
        }
        this.loading = false;
        console.error('Search Error:', err);
      }
    });
  }

  // Returns an array of unique sport names
getUniqueSports(data: any[]): string[] {
  return Array.from(new Set(data.map(item => item.SportName)));
}

// Returns an array of matches filtered by the given sport
getMatchesBySport(sportName: string): any[] {
  return this.secondSearchResult.filter(item => item.SportName === sportName);
}

// Computes the total runs for the given sport (for Cricket)
getTotalRuns(sportName: string): number {
  return this.getMatchesBySport(sportName)
             .reduce((sum, match) => sum + match.totalRuns, 0);
}

// Computes the total wickets for the given sport (for Cricket)
getTotalWickets(sportName: string): number {
  return this.getMatchesBySport(sportName)
             .reduce((sum, match) => sum + match.totalWickets, 0);
}

// Computes the total goals for the given sport (for non-Cricket sports)
getTotalGoals(sportName: string): number {
  return this.getMatchesBySport(sportName)
             .reduce((sum, match) => sum + match.totalGoals, 0);
}
}
