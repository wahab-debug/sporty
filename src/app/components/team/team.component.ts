import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../service/team.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  teamList: []=[]
  constructor(private service: TeamService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.onReq();
  }
  onReq(){
    this.service.getTeams()
    .subscribe(
      {
        next: res=>
        {
          
            this.teamList = res as any;
          
        },
        error: err=>
          {
            console.log(err);
            
          }
      }
    );
  }
}
