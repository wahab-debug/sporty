import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../service/player.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../../service/team.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit{
  playerList: []=[];
  teamId: string | null= null;
  result : any;

  constructor(private service: PlayerService, private toastr: ToastrService, private router: ActivatedRoute, private game: TeamService){}
  ngOnInit(): void {
    this.router.paramMap.subscribe(params => 
    {
          this.teamId = params.get('teamid'); 
          if (this.teamId) {
            this.onReq(); 
          }
    });
  }

  onReq(){
    this.service.getTeamPlayers(this.teamId)
    .subscribe(
      {
        next: res=>
        {
          this.playerList = res as any;
          
        },
        error: err=>
          {
            this.toastr.warning(err.message)
          }
      }
    );

  }
  removePlayer(regNum){
    console.log(regNum);
    
  }
}
