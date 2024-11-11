import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-rules',
  templateUrl: './game-rules.component.html',
  styleUrl: './game-rules.component.css'
})
export class GameRulesComponent implements OnInit {
  sport = {
    sport_id: '',
    rule_of_game: ''
  };
  sports: any[] = [
    { sport_id: 1, name: 'Football' },
    { sport_id: 2, name: 'Basketball' },
    { sport_id: 3, name: 'Cricket' },
    { sport_id: 4, name: 'Tennis' },
    { sport_id: 5, name: 'Hockey' }
  ];

  ngOnInit(): void { 
  }
  onSubmit(form:any): void {
    // Basic validation check for empty fields
    if (!this.sport.sport_id || !this.sport.rule_of_game) {
      // this.toastr.warning('Please fill out all fields.');
      return;
    }

    // For demonstration purposes, we log the form data
    console.log('Sport ID:', this.sport.sport_id);
    console.log('Rule of Game:', this.sport.rule_of_game);

    // You can now call an API to save the data to your backend
    // Example: this.authService.saveSport(this.sport).subscribe(response => {
    //   this.toastr.success('Sport added successfully');
    // });

    // Show success message
    // this.toastr.success('Sport added successfully');

    // Optionally reset the form or redirect
    this.resetForm();
  }

  // Reset the form after submission
  resetForm(): void {
    this.sport = {
      sport_id: '',
      rule_of_game: ''
    };
  }
}
