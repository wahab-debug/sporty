import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../service/event.service';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.css'
})
export class ScoringComponent implements OnInit{
  constructor(private toastr: ToastrService, private route: ActivatedRoute, private eventService: EventService, private scheduleService: ScheduleService, private redirect: Router){}

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
  team1_name:'',
  team2_name:'',
  score:0,
  overs:0,
  wicket:0,
  };
  turnbase = {
    team1_name : 'Horicane',
    team2_name : 'Panther'
  };
  ngOnInit() {
    this.loadForm();
  }
  //execute on intiliazation and get sport type from backend
  loadForm(){
    const game = this.route.paramMap.subscribe({
      next:res=>{
        this.sport = res.get('game');
        this.getSportType();
        this.startMatch();
      },
      error:err=>{
        this.toastr.error(err.message);
      }
    });
  }
    // Method to start a match
  startMatch() {
      let fixtureId = Number(this.route.snapshot.paramMap.get('id'));      
      this.scheduleService.startMatch(fixtureId).subscribe({
        next: (res) => {
          this.toastr.success("Match Started!!");
        },
        error: (err) => {
          this.toastr.error(err.message);
        }
      });
  }
  
  //fetch sport type from backend using match id
  getSportType(){
    let matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getSportType(matchId).subscribe({
      next:res=>{
        this.sportType = res as string
      }
    });

  }
}