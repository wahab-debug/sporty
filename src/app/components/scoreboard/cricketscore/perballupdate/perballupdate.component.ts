// perballupdate.component.ts
import { Component, OnInit } from '@angular/core';
import { CricketspecialService } from '../../../../service/cricketspecial.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../../../service/team.service';

@Component({
  selector: 'app-perballupdate',
  templateUrl: './perballupdate.component.html',
  styleUrls: ['./perballupdate.component.css']
})
export class PerballupdateComponent implements OnInit {
  team1Data: any[] = [];
  team2Data: any[] = [];
  displayedTeam1: any[] = [];
  displayedTeam2: any[] = [];
  team1ItemsToShow = 3;
  team2ItemsToShow = 3;
  fixtureId!: number;
  team1Name = 'Loading...';
  team2Name = 'Loading...';

  constructor(
    private cricketService: CricketspecialService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fixtureId = this.route.snapshot.params['id'];
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.cricketService.ballbyballscore(this.fixtureId).subscribe({
      next: (res: any) => {
        // Store raw data
        this.team1Data = res.team1;
        this.team2Data = res.team2;
        
        // Get team names
        this.getTeamNames(res);
        
        // Initial display
        this.updateDisplayedData();
      },
      error: (err) => this.toastr.error('Error loading match data')
    });
  }

  getTeamNames(response: any): void {
    this.teamService.playingTeams(this.fixtureId).subscribe({
      next: (res: any) => {
        this.team1Name = res.Team1;
        this.team2Name = res.Team2;
      }
    });
  }

  updateDisplayedData(): void {
    // Sort team1Data in descending order (latest ball on top)
    const team1Sorted = [...this.team1Data].sort((a, b) => {
      if (a.Over === b.Over) {
        return b.Ball - a.Ball;
      }
      return b.Over - a.Over;
    });

    // Sort team2Data in descending order (latest ball on top)
    const team2Sorted = [...this.team2Data].sort((a, b) => {
      if (a.Over === b.Over) {
        return b.Ball - a.Ball;
      }
      return b.Over - a.Over;
    });

    // Slice the sorted arrays to get the items to show
    this.displayedTeam1 = team1Sorted.slice(0, this.team1ItemsToShow);
    this.displayedTeam2 = team2Sorted.slice(0, this.team2ItemsToShow);
  }

  loadMore(team: 'team1' | 'team2'): void {
    if (team === 'team1') {
      this.team1ItemsToShow += 4;
    } else {
      this.team2ItemsToShow += 4;
    }
    this.updateDisplayedData();
  }

  getTotalRuns(ball: any): number {
    return ball.BatsmanRuns + ball.ExtraRuns;
  }

  getBallSummary(ball: any): string {
    let summary = `${ball.Over}.${ball.Ball} | `;
    summary += `Runs: ${this.getTotalRuns(ball)} `;
    if (ball.ExtraRuns > 0) summary += `(${ball.ExtraRuns} ${ball.ExtraType}) `;
    if (ball.IsWicket) summary += ` | Wicket: ${ball.WicketType}`;
    return summary;
  }

  trackByBall(index: number, item: any): string {
    return `${item.Over}-${item.Ball}-${item.TeamId}`;
  }
}
