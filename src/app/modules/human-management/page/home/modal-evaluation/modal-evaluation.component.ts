import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-evaluation',
  templateUrl: './modal-evaluation.component.html',
  styleUrls: ['./modal-evaluation.component.scss']
})
export class ModalEvaluationComponent implements OnInit {
  
  evaluation: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalEvaluationComponent>,
    private _router: Router 
  ) {
    this.evaluation = data.datos;
   }

   ngOnInit(): void {}

   cancel(): void {
     this.dialogRef.close();
   }
 
   detail(): void {
     this.dialogRef.close();
     this._router.navigate(['/humanmanagement/mis-bell'], {
      skipLocationChange: true
    });
   }
}
