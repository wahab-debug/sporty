import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent implements OnInit {
  sport: string = 'cricket'; // or 'goalbase' or 'pointbase'

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

  ngOnInit() {
    // Initialize match details based on the selected sport
    // You can populate this data dynamically via an API
  }
}
