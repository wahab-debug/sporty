import { Component } from '@angular/core';

@Component({
  selector: 'app-game-rules-mod',
  templateUrl: './game-rules-mod.component.html',
  styleUrl: './game-rules-mod.component.css'
})
export class GameRulesModComponent {
  sport = {
    sport_id: '',
    rule_of_game: ''
  };

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
