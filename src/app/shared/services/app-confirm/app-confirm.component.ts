import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

// @Component({
//   selector: 'app-confirm',
//   template: `<h1 matDialogTitle style="text-align: center;" class="mb-8">{{ data.title }}</h1>
//     <div mat-dialog-content class="mb-16" style="text-align: center;">{{ data.message }}</div>
//     <div mat-dialog-actions>
//     <button 
//     type="button" 
//     mat-raised-button
//     class="dark-blue-400 dark-blue-400-fg mr-4"
//     (click)="dialogRef.close(true)">Aceptar</button>
//     &nbsp;
//     <span fxFlex></span>
//     <button 
//     type="button"
//     class="dark-blue-100 dark-blue-100-fg ml-4"
//     mat-raised-button 
//     (click)="dialogRef.close(false)">Cancelar</button>
//     </div>`,
// })
@Component({
  selector: 'app-confirm',
  template: `<h1 matDialogTitle style="text-align: center;" class="mb-8">{{ data.title }}</h1>
    <div mat-dialog-content class="mb-16" style="text-align: center;">{{ data.message }}</div>
    <div mat-dialog-actions>
      
    <div fxFlex="100" class="mt-16">
    <button mat-button color="primary" style="width: 50%;" class="dark-blue-400 dark-blue-400-fg mr-4" (click)="dialogRef.close(true)">Aceptar</button>
    <span fxFlex></span>
    <button mat-button color="danger" style="width: 50%;" class="dark-blue-100 dark-blue-100-fg ml-4" type="button" (click)="dialogRef.close(false)">Cancelar</button>
    </div>
    </div>`,
})

export class AppComfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<AppComfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}