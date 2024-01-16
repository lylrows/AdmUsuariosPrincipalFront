import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';


@Component({
  selector: 'app-app-dialog-message',
  templateUrl: './app-dialog-message.component.html',
  styleUrls: ['./app-dialog-message.component.scss']
})

export class AppDialogMessageComponent {

  constructor(
    public dialogRef: MatDialogRef<AppDialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}

}