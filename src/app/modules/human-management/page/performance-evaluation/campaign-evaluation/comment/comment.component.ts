import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerformanceService } from '@app/data/service/performance.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  nid_evaluation: number = 0;
  name: string = '';
  receptor: number = 0;
  area: number = 0;
  campaign = '';
  nid_employee: number = 0;
  commentFC = new FormControl('', [Validators.required]);
  nid_evaluted : number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommentComponent>,
    private _service: PerformanceService,
    private snack: MatSnackBar,
  ) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_employee = storage.nid_employee;
    this.nid_evaluation = this.data.evaluation;
    this.nid_evaluted = this.data.nid_evaluated;
    this.name = this.data.name;
    this.receptor = this.data.receptor;
    this.area = this.data.area;
    this.campaign = this.data.campaign;
  }

  ngOnInit(): void {
  }

  save(): void {

    if ( this.commentFC.invalid ) {
      this.commentFC.markAllAsTouched();
      return;
    }

    const payload = {
      IdEvaluation: this.nid_evaluation,
      comment: this.commentFC.value,
      AreaId: this.area,
      PositionId: this.receptor,
      EmisorId: this.nid_employee,
      ReceptorId: this.receptor,
      EmpleadoId: this.nid_evaluted,
      Name: this.name,
      Campaign: this.campaign,
    }

    this._service.DeleteEmployee(payload).subscribe(resp => {
      this.dialogRef.close();
      this.snack.open(resp.data, "OK", { duration: 4000 });
    })
  }

  close(): void {
    this.dialogRef.close();
  }

}
