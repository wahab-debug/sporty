import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TeamService } from '../../../service/team.service';
import { ScheduleService } from '../../../service/schedule.service';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent implements OnInit {
  constructor(private service: TeamService, private toastr: ToastrService,private redirect: Router, private scheduleService: ScheduleService){}
  ngOnInit(): void {
    this.loadAvailableTeams();
    this.getTeamCount().then(() => {
      this.generateMatches();
    });  }
  teamList: []=[]
  matches: any[] = [];
  totalTeams: number = 8; 

  // Method to generate matches based on total number of teams
  generateMatches() {
    this.matches = [];
    this.totalTeams;    
    const numberOfMatches = this.totalTeams - 1;
    
    for (let i = 0; i < numberOfMatches; i++) {
      let matchType = 'league';  // Default match type for most matches
    
      // Assign match types for the last 3 matches
      if (i === numberOfMatches - 1) {
        matchType = 'final';  // Last match becomes "final"
      } else if (i === numberOfMatches - 2 || i === numberOfMatches - 3) {
        matchType = 'semi';  // Second last and third last become "semi final"
      }
    
      // Push the match to the array with the determined match type
      this.matches.push({
        team1_id: '',
        team2_id: '',
        matchDate: '',
        venue: '',
        match_type: matchType,  // Set the correct match type
        winner_id: null  // Default winner_id
      });
    }
    
    
    
  }
  //fill dropdown values for teams to make schedule
  loadAvailableTeams(){
    const reg = sessionStorage.getItem('registration_no');
    this.service.AllTeamsByEM(reg).subscribe(
        {
          next: res=>
          {
            
              this.teamList = res as any;

          },
          error: err=>
            {
              this.toastr.warning(err);
              
            }
        }
      );
  }
  getTeamCount(): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = sessionStorage.getItem('id');
      this.service.allowedTeams(id).subscribe({
        next: res => {
          this.totalTeams = res as number;
          resolve();  // Resolve the promise after totalTeams is set
        },
        error: err => {
          reject(err);  // Reject the promise in case of error
        }
      });
    });
  }
  getValues(){
    for (let match of this.matches) {
      if ( !match.matchDate || !match.venue) {
        this.toastr.warning('Date and venue fields are required for each match.');
        return;
      }
      // Ensure that Team 1 and Team 2 are not the same
      // if (match.team1_id === match.team2_id) {
      //   this.toastr.warning('Team 1 and Team 2 cannot be the same for match ' + (this.matches.indexOf(match) + 1));
      //   return;
      // }
    }
    const reg = sessionStorage.getItem('registration_no');
    this.scheduleService.setSchedule(this.matches,reg).subscribe({
      next:res=>{
        this.toastr.success("created");
        this.redirect.navigate(['']);
      },
      error:err=>{
        this.toastr.error(err.message);
      }
    });
    
  }
}
