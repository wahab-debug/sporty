import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../../service/schedule.service';
import { TeamService } from '../../../service/team.service';

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrl: './update-schedule.component.css'
})
export class UpdateScheduleComponent {
  constructor(private service: TeamService, private toastr: ToastrService, private redirect: Router, private scheduleService: ScheduleService){}
  ngOnInit(): void {
    this.loadAvailableTeams();
    this.generateMatches();
  }

  teamList: []=[]
  matches: any[] = [];

  // Method to generate matches based on total number of teams
  generateMatches() {
    const reg = sessionStorage.getItem('registration_no');
    this.scheduleService.AllScheduledFixtures(reg).subscribe({
      next: res => {
        //-------------------this will only show schedules with null values------------

              // Check if res is already an array (if not, convert or handle differently)
              const fixtures = Array.isArray(res) ? res : [];  // Default to empty array if not an array

              // Filter out fixtures where either team1_id or team2_id is null
              const validMatches = fixtures.filter((fixture: any) => fixture.team1_id == null && fixture.team2_id == null);

              // Assign only valid matches (where both team1_id and team2_id are not null)
              this.matches = validMatches;

              //----------------------------this will show all schedules with teams as well-------
              // this.matches = res as any;  // Assign fetched matches to this.matches
              // const numberOfMatches = this.matches.length;  // Get the number of fetched matches
              // for (let i = 0; i < numberOfMatches; i++) {
              //  if (this.matches[i].team1_id === null || this.matches[i].team2_id === null) {
              //     console.log('Fixture with missing team:', this.matches[i]);  // Log the fixture where either team1_id or team2_id is null
              // }
              // }

      },
      error: err => {
        this.toastr.error(err.message);  // Show error message if API call fails
      }
    });

    
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
  getValues(){
    this.scheduleService.UpdateFixture(this.matches).subscribe({
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
