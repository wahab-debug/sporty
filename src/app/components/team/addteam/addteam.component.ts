import { Component } from '@angular/core';
import { TeamService } from '../../../service/team.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addteam',
  templateUrl: './addteam.component.html',
  styleUrl: './addteam.component.css'
})
export class AddteamComponent {
  teamList: []=[]
  constructor(private service: TeamService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.onReq();
  }
  onReq(){
    const id = sessionStorage.getItem('id');
    this.service.getUserAppliedTeams(id).subscribe(
        {
          next: res=>
          {
            
              this.teamList = res as any;
              console.log(this.teamList)               
            
          },
          error: err=>
            {
              this.toastr.warning(err);
              
            }
        }
      );
    }
  onSubmit(teamid:number) {
    console.log(teamid);  
  }
}
