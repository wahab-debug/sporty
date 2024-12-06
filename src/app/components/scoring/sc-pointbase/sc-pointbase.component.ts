import { Component } from '@angular/core';

@Component({
  selector: 'app-sc-pointbase',
  templateUrl: './sc-pointbase.component.html',
  styleUrl: './sc-pointbase.component.css'
})
export class ScPointbaseComponent {
  matchDetails:{
    team1_name:'';
    team2_name:'';
    team1_setsWon:0;
    team2_setsWon:0
  }
  onSubmit(s){}
}
