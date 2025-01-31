import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CricketspecialService } from '../../../../service/cricketspecial.service';
import { PlayerService } from '../../../../service/player.service';
import { TeamService } from '../../../../service/team.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-performance-gist',
  templateUrl: './performance-gist.component.html',
  styleUrl: './performance-gist.component.css'
})
export class PerformanceGistComponent implements OnInit {
  constructor(
    private cricketService: CricketspecialService,
    private http: HttpClient, private teamService: TeamService,
    private router: ActivatedRoute, private playerService: PlayerService,
    private redirect: Router
  ) { }
  ngOnInit() {
    // Get fixture ID from route params or input
    this.loadPlayers();
  }
  fixtureId: number;
  players: any[] = [];
  selectedPlayerId: number;
  uploadedImage: File;
  successMessage: string;
  errorMessage: string;

  async loadPlayers() {
    try {
      this.fixtureId = Number(this.router.snapshot.paramMap.get('id'));
  
      // Get team IDs for the fixture
      const fixtureResponse: any = await this.teamService.playingTeams(this.fixtureId).toPromise();
      const team1Id = fixtureResponse.team1Id;
      const team2Id = fixtureResponse.team2Id;
  
      // Fetch players for both teams in parallel
      const [team1Players, team2Players] = await Promise.all([
        this.playerService.getTeamPlayers(team1Id).toPromise(),
        this.playerService.getTeamPlayers(team2Id).toPromise()
      ]);
  
      // Combine and format player data
      this.players = [
        ...(team1Players as any[]).map(p => ({ ...p, team: fixtureResponse.Team1 })),
        ...(team2Players as any[]).map(p => ({ ...p, team: fixtureResponse.Team2 }))
      ];
    } catch (error) {
      this.errorMessage = 'Failed to load players';
      console.error('Error loading players:', error);
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }  
  }
  async onSubmit() {
    if (!this.selectedPlayerId || !this.uploadedImage || !this.fixtureId) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    try {
      const imagePath = this.uploadedImage ? this.uploadedImage.toString() : '';

      // Then save MOTM with image URL
      const motm = {
        fixture_id: this.fixtureId,
        player_id: Number(this.selectedPlayerId),
        image_path: imagePath
      };
    const ppCheckResponse = await this.cricketService.AddMotm(motm).toPromise();

      if (ppCheckResponse) {
        let currentFixture :number = 0; //hold match id
        let currentGame: string = ''; //hold game name to redirect after success
        this.router.paramMap.subscribe({
          next:res=>{ 
            currentFixture = Number(res.get('id'));
            currentGame = res.get('game');
          }
        });
        this.successMessage = 'Man of the Match updated successfully!';
        this.errorMessage = null;
        this.redirect.navigateByUrl("/score-board/"+currentGame+"/match/"+currentFixture);
      } else {
        this.errorMessage =  'Failed to update Man of the Match';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred while saving';
    }
  }
}
