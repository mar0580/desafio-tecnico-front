import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
  constructor(private readonly snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000
    });
  }
}
