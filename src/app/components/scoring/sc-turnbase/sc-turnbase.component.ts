import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlayerService } from '../../../service/player.service';
import { ScoringService } from '../../../service/scoring.service';
import { TeamService } from '../../../service/team.service';
import { MatchEventsService } from '../../../service/match-events.service';
import { MemoriesService } from '../../../service/memories.service'; // Import the image service

@Component({
  selector: 'app-sc-turnbase',
  templateUrl: './sc-turnbase.component.html',
  styleUrls: ['./sc-turnbase.component.css']
})
export class ScTurnbaseComponent implements OnInit {
  fixtureId: number;
  playingTeams: any[] = [];
  allPlayers: any[] = [];
  selectedWinnerId: number;
  selectedLoserId: number;
  eventData: any = {};
  filteredEvents: any[] = [];
  addingEvent = false;
  eventImage?: File;
  selectedWinnerTeamId: any; // Will store the winner team's id when ending the match
  currentTime: Date = new Date(); // Added property to track current time

  constructor(
    private playerService: PlayerService,
    private scoringService: ScoringService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private matchEventService: MatchEventsService,
    private imgService: MemoriesService // Inject the image service
  ) {}

  ngOnInit() {
    this.fixtureId = Number(this.route.snapshot.params['id']);
    this.loadPlayingTeams();
  }

  loadPlayingTeams() {
    this.teamService.playingTeams(this.fixtureId).subscribe({
      next: (res) => {
        const jsonResponse = res as any;
        const teamsArray = Object.keys(jsonResponse)
          .filter(key => key.includes('Team')) // Filter for team names (e.g., "Team1", "Team2")
          .map((key, index) => {
            const teamIdKey = `team${index + 1}Id`; // Dynamically find the corresponding teamId key
            return {
              teamid: jsonResponse[teamIdKey],
              Tname: jsonResponse[key]
            };
          });
        this.playingTeams = teamsArray;
        this.loadPlayers();
      },
      error: (err) => this.toastr.error('Failed to load teams')
    });
  }

  loadPlayers() {
    this.playingTeams.forEach(team => {
      this.playerService.getTeamPlayers(team.teamid).subscribe({
        next: (players: any[]) => {
          players.forEach(player => {
            player.teamName = team.Tname; // Attach the team name to each player
          });
          this.allPlayers = [...this.allPlayers, ...players];
          const filteredPlayers = this.getTeamPlayers(team.Tname);  // Filter by teamName if needed
        },
        error: (err) => this.toastr.error(`Failed to load players for ${team.Tname}`)
      });
    });
  }

  getTeamPlayers(teamName: string) {
    return this.allPlayers.filter(p => p.teamName === teamName);
  }

  // Updated addEvent() method that uses the same image upload logic
  async addEvent() {
    this.addingEvent = true;

    try {
      let imgPath = '';
      // Update event time from the current time
      this.eventData.event_time = this.currentTime.toISOString();

      // If an event image is selected, upload it first using the MemoriesService
      if (this.eventImage) {
        const formData = new FormData();
        formData.append('file', this.eventImage);
        // Use toPromise() to await the result (ensure your service returns an Observable)
        const response = await this.imgService.UploadImage(this.fixtureId, formData).toPromise();
        // The response may be an array – take the first element or use the response directly.
        imgPath = Array.isArray(response) ? response[0] || '' : response || '';
      }

      // Build a clean matchEvent object
      const matchEvent = {
        fixture_id: this.fixtureId,
        event_time: this.eventData.event_time,
        event_type: this.eventData.event_type,
        event_description: this.eventData.event_description,
        player_id: this.eventData.player_id,
        secondary_player_id: this.eventData.secondary_player_id,
        fielder_id: this.eventData.fielder_id  // if applicable
      };

      // Call the service method and pass the matchEvent and image path
      await this.matchEventService.AddMatchEvents(matchEvent, imgPath).toPromise();

      this.toastr.success('Event added successfully');
      this.resetEventForm();
    } catch (error) {
      this.toastr.error('Failed to add event');
    } finally {
      this.addingEvent = false;
    }
  }

  onEventImageSelected(event: any) {
    this.eventImage = event.target.files[0];
  }

  endMatch() {
    if (!this.selectedWinnerTeamId) {
      this.toastr.warning('Please select a winner team');
      return;
    }
    
    const payload = {
      fixture_id: Number(this.fixtureId),
      winner_id: Number(this.selectedWinnerTeamId)
    };
  
    this.scoringService.UpdateTurnBasedWinner(payload).subscribe({
      next: () => {
        this.toastr.success('Match ended successfully.');
        this.router.navigate(['']);
      },
      error: (err) => {
        this.toastr.error('Failed to end match.');
      }
    });
    console.log(payload);
  }

  resetEventForm() {
    this.eventData = {
      event_type: '',
      event_time: '',
      event_description: '',
      player_id: null,
      secondary_player_id: null,
      ImgPath: '',
      fixture_id: this.fixtureId
    };
    this.eventImage = undefined;
  }
}
