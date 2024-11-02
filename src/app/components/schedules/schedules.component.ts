import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {
  constructor(private router: ActivatedRoute, private toastr: ToastrService, private service: ScheduleService, private redirect: Router){}
  scheduleDetail:any;
  ngOnInit(): void {
    this.loadForm();
  }
  loadForm(){
    
    this.router.paramMap.subscribe({
      next: (res)=>{
        const name = res.get('game');
        if(name){
          this.service.getMatches(name).subscribe({
            next: (response)=>{
              this.scheduleDetail = response;
              console.log(this.scheduleDetail);
            },
            error:err=>{
              console.log(err.message);
            }
          })
        }
      }
    })
  }


}
