import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.css'
})
export class ScoringComponent implements OnInit{
  constructor(private toastr: ToastrService, private route: ActivatedRoute){}
  sportType: string = ''; 
  sport: string = ''; // Assigned sport, can be dynamically set
  pointbase = {
    team1_name:'Thunder Strike',
    team2_name:'Spears Eleven',
    setsWon:0,
    comments: 'well played'
  };
  goalbase = {
    team1_name:'Horicane',
    team2_name:'Panther',
    goals : 0,
    comments:"well played"
  };
  cricketscore = {
  team1_name:'Horicane',
  team2_name:'Panther',
  score:0,
  overs:0,
  wicket:0,
  comments:"well played"
  };
  turnbase = {
    team1_name : 'Horicane',
    team2_name : 'Panther'
  };
  ngOnInit() {
    this.loadForm();
  }
  loadForm(){
    const game = this.route.paramMap.subscribe({
      next:res=>{
        this.sport = res.get('game');
        this.setSportType(this.sport);
      },
      error:err=>{
        this.toastr.error(err.message);
      }
    });
  }
  setSportType(sport: string) {
    if (['Ludo-dual','Ludo-single', 'Chess','Snooker-single','Snooker-dual'].includes(sport)) {
      this.sportType = 'turnbase';
    } else if (['Badminton-single', 'Table Tennis-single','Badminton-dual','Volleyball','Tug of War'].includes(sport)) {
      this.sportType = 'pointbase'; 
    } else if (['Futsall','Arm Wrestling','Race'].includes(sport)) {
      this.sportType = 'goalbase';
    }else if (['Cricket'].includes(sport)) {
      this.sportType = 'Cricket';
    } else {
      this.sportType = '';
    }
}
}