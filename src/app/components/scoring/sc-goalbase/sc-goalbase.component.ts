import { Component } from '@angular/core';

@Component({
  selector: 'app-sc-goalbase',
  templateUrl: './sc-goalbase.component.html',
  styleUrl: './sc-goalbase.component.css'
})
export class ScGoalbaseComponent {
  matchDetails:{
  team1_name:'';
  team2_name:'';
  team1_goals:0;
  team2_goals:0
}
  onSubmit(s){}
}
