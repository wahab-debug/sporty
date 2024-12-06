import { Component, OnInit } from '@angular/core';
import { MemoriesService } from '../../service/memories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.css'
})
export class ScoringComponent implements OnInit{
  constructor(private imgService: MemoriesService, private toastr: ToastrService){}
  id:number=29;
  sport: string = 'Cricket'; // Assigned sport, can be dynamically set
  matchDetails: any = {
    team1_id: 1,
    team1_name: 'Team A',
    team1_score: 0,
    team1_overs: '',
    team1_wickets: 0,
    team2_id: 2,
    team2_name: 'Team B',
    team2_score: 0,
    team2_overs: '',
    team2_wickets: 0,
    team1_setsWon: 0,
    team2_setsWon: 0,
    team1_goals: 0,
    team2_goals: 0
  };
  imagePaths: string[] = [];

  ngOnInit() {
    // You can dynamically set the sport here
    // For example, this.sport = 'goalbase'; to switch to GoalBase scoring
  }
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      // Preview image paths
      this.imagePaths = Array.from(input.files).map((file: File) => URL.createObjectURL(file));

      // Create a FormData object
      const formData = new FormData();
      Array.from(input.files).forEach((file) => {
        formData.append('files', file); // Key should match the backend expectation
      });

      // Upload images with the fixtureId
      this.imgService.UploadImage(this.id, formData).subscribe({
        next: (res) => {
          this.toastr.success('Images uploaded successfully!');
          console.log('Upload response:', res);
        },
        error: (err) => {
          this.toastr.error('Image upload failed.');
          console.error('Upload error:', err);
        }
      });

      console.log('Selected image paths:', this.imagePaths);
    } else {
      console.log('No files selected.');
    }
  }

  // Handle form submission for scoring
  onSubmit(sport: string): void {
    console.log(`${sport.charAt(0).toUpperCase() + sport.slice(1)} Match Submitted:`, this.matchDetails);

  }
}
