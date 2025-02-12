import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from '../../../service/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemoriesService } from '../../../service/memories.service';
import { ToastrService } from 'ngx-toastr';
import { ScoringService } from '../../../service/scoring.service';
import { TeamService } from '../../../service/team.service';
import { MatchEventsService } from '../../../service/match-events.service';

@Component({
  selector: 'app-sc-goalbase',
  templateUrl: './sc-goalbase.component.html',
  styleUrl: './sc-goalbase.component.css'
})
export class ScGoalbaseComponent implements OnInit, OnDestroy {
  fixtureId!: number;
  playingTeams: any[] = [];
  goals: number[] = [0, 0];
  eventImage?: File;
  addingEvent = false;
  endingMatch = false;
  teamPlayersMap: { [key: number]: any[] } = {};
  selectedPlayerTeamId: number | null = null;
  currentTime: Date = new Date();
  private timeInterval: any;

  eventData: any = {
    event_type: '',
    event_time: '',
    event_description: '',
    player_id: null,
    assist_player_id: null,
    fixture_id: 0
  };

  constructor(
    private scoringService: ScoringService,
    private toastr: ToastrService,
    private imgService: MemoriesService,
    private route: ActivatedRoute,
    private matchEventService: MatchEventsService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    // Set an interval to update the current time every second
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date(); // Update current time
      this.eventData.event_time = this.currentTime.toISOString(); // Set event time in ISO format
    }, 1000);
    
    // Get the fixtureId from route params
    this.fixtureId = this.route.snapshot.params['id'];
    this.eventData.fixture_id = this.fixtureId; // Assign fixtureId to event data
    this.loadPlayingTeams(); // Load teams playing in the fixture
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed to avoid memory leaks
    clearInterval(this.timeInterval);
  }

  get selectedTeamPlayers() {
    // Return players for the selected team based on selectedPlayerTeamId
    return this.selectedPlayerTeamId ? 
      this.teamPlayersMap[this.selectedPlayerTeamId] || [] : [];
  }

  adjustGoals(teamIndex: number, change: number) {
    // Adjust the goals for a team, ensuring goals don't go below 0
    this.goals[teamIndex] = Math.max(0, this.goals[teamIndex] + change);
  }

  loadPlayingTeams() {
    // Fetch playing teams for the fixture
    this.teamService.playingTeams(this.fixtureId).subscribe({
      next: (res: any) => {
        // Populate the teams with their names and IDs
        this.playingTeams = [
          { Tname: res.Team1, teamid: res.team1Id },
          { Tname: res.Team2, teamid: res.team2Id }
        ];
        this.loadPlayers(); // Load players for the teams
        this.loadExistingScores(); // Load existing scores for the match
      },
      error: (err) => this.toastr.error('Failed to load teams') // Error handling
    });
  }

  loadPlayers() {
    // Fetch players for each team in the fixture
    this.playingTeams.forEach(team => {
      this.playerService.getTeamPlayers(team.teamid).subscribe({
        next: (players: any[]) => {
          // Store players in the teamPlayersMap by team ID
          this.teamPlayersMap[team.teamid] = players;
        },
        error: (err) => this.toastr.error(`Failed to load players for ${team.Tname}`) // Error handling
      });
    });
  }

  loadExistingScores() {
    // Fetch existing match scores for the fixture
    this.scoringService.matchScores(this.fixtureId).subscribe({
      next: (res: any) => {
        // Map existing scores to the respective teams
        this.playingTeams.forEach((team, index) => {
          const teamScore = res.find((s: any) => s.team_id === team.teamid);
          this.goals[index] = teamScore ? teamScore.goals : 0; // Set goals for each team
        });
      },
      error: (err) => this.toastr.error('Failed to load existing scores') // Error handling
    });
  }

  updateScore(teamName: string, goals: number) {
    // Update the score for a specific team
    this.scoringService.AddOrUpdateGoalBasedScore( 
      this.playingTeams.find(t => t.Tname === teamName)?.teamid,
      goals,
      Number(this.fixtureId)
    ).subscribe({
      next: () => {
        this.toastr.success('Goals updated'); // Success message
        this.loadExistingScores(); // Reload scores after update
      },
      error: (err) => this.toastr.error('Update failed') // Error handling
    });
  }

  onEventImageSelected(event: any) {
    // Handle event image selection
    this.eventImage = event.target.files[0]; // Store the selected image
  }

  async addEvent() {
    // Add a new event for the match
    this.addingEvent = true; // Set loading state
    try {
      let imgPath = '';
      if (this.eventImage) {
        // If an image is selected, upload it to the server
        const formData = new FormData();
        formData.append('file', this.eventImage);
        const response = await this.imgService.UploadImage(
          this.fixtureId, 
          formData
        ).toPromise();
        imgPath = Array.isArray(response) ? response[0] || '' : response || ''; // Handle response
      }

      // Prepare match event data with current event information and image path
      const matchEvent = {
        ...this.eventData,
        event_time: new Date().toISOString(),
        image_path: imgPath
      };
      const matchevent = {
        ...this.eventData,
        event_time: new Date().toISOString()
      }

      // Send event data to the server to save the event
      await this.matchEventService.AddMatchEvents(matchevent,imgPath).toPromise();
      console.log(matchEvent); // Log the event data
      
      this.toastr.success('Event recorded'); // Success message
      this.resetEventForm(); // Reset the event form
    } catch (error) {
      this.toastr.error('Failed to save event'); // Error handling
    } finally {
      this.addingEvent = false; // Set loading state to false
    }
  }

  resetEventForm() {
    // Reset the event form data
    this.eventData = {
      event_type: '',
      event_description: '',
      player_id: null,
      assist_player_id: null,
      fixture_id: this.fixtureId
    };
    this.eventImage = undefined; // Clear the selected image
    this.selectedPlayerTeamId = null; // Deselect the selected team
  }

  endMatch() {
    // End the match and finalize the scores
    if (confirm('End match and finalize scores?')) {
      this.endingMatch = true; // Set loading state
      this.scoringService.UpdateGoalBasedWinner(Number(this.fixtureId)).subscribe({
        next: () => {
          this.toastr.success('Match ended'); // Success message
          this.router.navigate(['']); // Redirect to home
        },
        error: (err) => {
          this.toastr.error('Failed to end match'); // Error handling
          this.endingMatch = false; // Reset loading state
        }
      });
    }
  }

}