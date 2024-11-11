import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.css'
})
export class ScoringComponent implements OnInit{
  sport: string = 'Cricket'; // Assigned sport, can be dynamically set
  matchDetails: any = {
    team1_id: 1,
    team1_name: 'Team A',
    team1_score: 0,
    team1_overs: '',
    team1_wickets: 0,
    team2_id: 2,
    team2_name: 'Team B',
    team2_score: 0,
    team2_overs: '',
    team2_wickets: 0,
    team1_setsWon: 0,
    team2_setsWon: 0,
    team1_goals: 0,
    team2_goals: 0
  };

  ngOnInit() {
    // You can dynamically set the sport here
    // For example, this.sport = 'goalbase'; to switch to GoalBase scoring
  }

  // Handle form submission for scoring
  onSubmit(sport: string): void {
    console.log(`${sport.charAt(0).toUpperCase() + sport.slice(1)} Match Submitted:`, this.matchDetails);
    alert('Score submitted for ' + sport);
  }
}
