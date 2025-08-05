import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-activate-dialog',
   standalone: true,  // <-- Add this
  imports: [        // <-- Add these imports
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
 template: `
    <h2 mat-dialog-title>Activate Account</h2>
    <mat-dialog-content>
      <p>Please enter the activation code sent to your email:</p>
      <mat-form-field>
        <input matInput [(ngModel)]="code" placeholder="Activation Code" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onActivate()">Activate</button>
    </mat-dialog-actions>
  `})
export class ActivateDialog {
 code: string = '';

  constructor(
    public dialogRef: MatDialogRef<ActivateDialog>
  ) {}

  onActivate() {
    this.dialogRef.close(this.code);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
