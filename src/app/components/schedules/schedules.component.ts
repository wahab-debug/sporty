import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../service/schedule.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {
  constructor(private router: ActivatedRoute, private toastr: ToastrService, private service: ScheduleService, private authService: AuthService){}
  scheduleDetail:any;
  userRole = ''
  ngOnInit(): void {
    this.loadForm();
    this.getUserRole();
  }
  loadForm(){
    
    this.router.paramMap.subscribe({
      next: (res)=>{
        const name = res.get('game');
        if(name){
          this.service.getMatches(name).subscribe({
            next: (response)=>{
              this.scheduleDetail = response;
            },
            error:err=>{
              this.toastr.warning(err)
            }
          })
        }
      }
    })
  }
  startMatch(fixtureId: number) {
    // Add your logic here to start the match, for example, updating the match status.
    console.log('Starting match with fixture ID:', fixtureId);
    // Update the fixture status or call an API to start the match
  }
  getUserRole(){
     this.userRole = this.authService.getUserRole();
  }


}
