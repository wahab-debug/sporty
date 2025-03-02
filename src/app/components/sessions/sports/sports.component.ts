import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../service/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent implements OnInit {

  eventlist :any[]=[];
  sessionList
  sessionName:any;
  selectedYear: number ;  // Default year selection


  constructor(private service: EventService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.onRequest();
  }

  onRequest(){
    this.service.getAllSession().subscribe(
      res=>{
        this.sessionList = res        
      }
    );
    this.service.getSportBySession().subscribe(
      res=>{
        this.eventlist = res as any;        
        this.sessionName = this.eventlist.map(s=>s.name)[0]
      }
    );
  }
  gamesBySessionID(){
    this.service.gamesBySessionID(this.selectedYear).subscribe(
      res=>{
        
        this.eventlist = res as any;           
        this.sessionName = this.eventlist.map(s=>s.name)[0]        

      }
    );
    
  }

}
