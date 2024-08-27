import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../service/event.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent implements OnInit {

  eventlist :any[]=[];

  constructor(private service: EventService){}
  ngOnInit(): void {
    this.onRequest();
  }

  
  
  onRequest(){
    this.service.getSportBySession().subscribe(
      res=>{
        this.eventlist = res as any
      }
    );
  }

}
