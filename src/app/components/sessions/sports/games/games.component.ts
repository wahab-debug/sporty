import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../service/event.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit{
  eventlist:any[]=[]
  constructor(private service: EventService, private router: Router, private toastr: ToastrService){}
  ngOnInit(): void {
    this.onRequest();
  }
  onRequest(){
    this.service.getAllSports().subscribe(
      res=>{
        this.eventlist = res as any;
      }
    );
    
    
  } 

}
