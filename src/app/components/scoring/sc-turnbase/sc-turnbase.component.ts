import { Component } from '@angular/core';

@Component({
  selector: 'app-sc-turnbase',
  templateUrl: './sc-turnbase.component.html',
  styleUrls: ['./sc-turnbase.component.css']
})
export class ScTurnbaseComponent {
  
  // Define properties to store form data
  gameState = {
    player1_name: 'Spades',   // Example default names
    player1_score: 0,           // Initial score for Player 1
    player2_name: 'Dragon',   // Example default names
    player2_score: 0,           // Initial score for Player 2
    current_turn: 1,            // 1 for Player 1, 2 for Player 2
    move_details: '',           // Details of the move
    event_type: '1',            // Event type (default to 1)
    player_involved: '1',       // Player involved (default to Player 1)
  };

  // Handle form submission
  onSubmit(action: string): void {
    console.log('Form submitted with action:', action);
    console.log('Game state:', this.gameState);

    // You can add logic to process the data here, such as:
    // - updating the game state,
    // - sending data to a backend API,
    // - checking the game status, etc.

    // Example logic:
    if (this.gameState.current_turn === 1) {
      // Logic for Player 1's turn
      this.gameState.player1_score += 10; // For example, adding points for Player 1
    } else {
      // Logic for Player 2's turn
      this.gameState.player2_score += 10; // For example, adding points for Player 2
    }

    // Switch turns after a move
    this.gameState.current_turn = this.gameState.current_turn === 1 ? 2 : 1;

    // You can add more logic here as needed based on your game's rules
  }
}
