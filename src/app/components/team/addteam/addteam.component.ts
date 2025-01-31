import { Component } from '@angular/core';
import { TeamService } from '../../../service/team.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addteam',
  templateUrl: './addteam.component.html',
  styleUrl: './addteam.component.css'
})
export class AddteamComponent {
  teamList: []=[];
  // matchesList: any[] = [];
  matchesList = [
    {
    team1Logo: 'https://via.placeholder.com/40x40.png?text=T1',
    team1ShortName: 'GHOST',
    team2Logo: 'https://via.placeholder.com/40x40.png?text=T2',
    team2ShortName: 'KF',
    date: '2024-03-15T14:00:00',
    venue: 'pp',
    status: 'upcoming',
    team1Score: 23,
    team2Score: 22
  },
  {
    team1Logo: 'https://via.placeholder.com/40x40.png?text=T1',
    team1ShortName: 'GHOST',
    team2Logo: 'https://via.placeholder.com/40x40.png?text=T2',
    team2ShortName: 'KF',
    date: '2024-03-15T14:00:00',
    venue: 'pp',
    status: 'ongoing',
    team1Score: 23,
    team2Score: 22
  },
  {
    team1Logo: 'https://via.placeholder.com/40x40.png?text=T1',
    team1ShortName: 'BIIT STRIKERS',
    team2Logo: 'https://via.placeholder.com/40x40.png?text=T2',
    team2ShortName: 'KF',
    date: '2024-03-15T14:00:00',
    venue: 'pp',
    status: 'completed',
    team1Score: 23,
    team2Score: 22
  }
]//testing purpose, original data will be fetched in above variable
  constructor(private service: TeamService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.onReq();
    this.loadMatches();
  }
  onReq(){
    const id = sessionStorage.getItem('id');
    this.service.getUserAppliedTeams(id).subscribe(
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

  loadMatches() {
    // this.cricketService.getUserMatches().subscribe({
    //   next: (matches) => {
    //     this.matchesList = matches;
    //   },
    //   error: (err) => {
    //     console.error('Error loading matches:', err);
    //   }
    // });
  }
}
