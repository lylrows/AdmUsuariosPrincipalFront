import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-campaign',
  templateUrl: './modal-campaign.component.html',
  styleUrls: ['./modal-campaign.component.scss']
})
export class ModalCampaignComponent implements OnInit {

  campaing: any[] = [];
  evaluation: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalCampaignComponent>,
    private _router: Router 
  ) {
    this.campaing = data.datos;
    this.evaluation = data.datosEvaluations;
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  detail(idEvaluation): void {
    this.dialogRef.close();
    this._router.navigate(['/humanmanagement/campaing-evaluation-detail', idEvaluation], {
      skipLocationChange: true
    })
  }
  detailEvaluations(): void {
    this.dialogRef.close();
    this._router.navigate(['/humanmanagement/mis-bell'], {
      skipLocationChange: true
    });
  }

}
