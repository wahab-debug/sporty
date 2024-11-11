import { Component } from '@angular/core';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent {
  match = {
    team1_id: '',
    team2_id: '',
    matchDate: '',
    venue: '',
    type:''
  };

  // Array to store teams
  teams = [
    { id: 1, name: 'Team A' },
    { id: 2, name: 'Team B' },
    { id: 3, name: 'Team C' },
    { id: 4, name: 'Team D' },
  ];
  playedTeams: Set<number> = new Set();
  availableTeams;

  onSubmit(form:any){
    console.log(form.value);
    
  }
  // randomlyFill(): void {
  //   if (this.teams.length < 2) {
  //     // this.toastr.warning('Not enough teams available to fill the form.');
  //     return;
  //   }

  //   // Filter out the teams that have already played
  //   this.availableTeams = this.teams.filter(team => !this.playedTeams.has(team.id));

  //   if (this.availableTeams.length < 2) {
  //     // this.toastr.warning('Not enough teams available to randomly fill.');
  //     return;
  //   }

  //   // Randomly select Team 1 and Team 2, making sure they are not the same
  //   let team1 = this.getRandomTeam(this.availableTeams);
  //   let team2 = this.getRandomTeamExcluding(team1.id, this.availableTeams);

  //   // Assign the teams to the match object
  //   this.match.team1_id = team1.id;
  //   this.match.team2_id = team2.id;

  //   // Add the selected teams to the playedTeams set to prevent re-selection
  //   this.playedTeams.add(team1.id);
  //   this.playedTeams.add(team2.id);
  // }

  // // Helper function to get a random team from available teams
  // private getRandomTeam(availableTeams: any[]): any {
  //   const randomIndex = Math.floor(Math.random() * availableTeams.length);
  //   return availableTeams[randomIndex];
  // }

  // Helper function to get a random team from available teams, excluding a specific team
  // private getRandomTeamExcluding(excludeId: number, availableTeams: any[]): any {
  //   const filteredTeams = availableTeams.filter(team => team.id !== excludeId);
  //   return this.getRandomTeam(filteredTeams);
  // }
}
