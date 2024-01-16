import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '@app/data/service/employee.service';
// import { EmployeeService } from '@app/data/service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { StaffRequestService } from '@app/data/service/staff-request.service';

@Component({
  selector: 'app-modal-comment',
  templateUrl: './modal-comment.component.html',
  styleUrls: ['./modal-comment.component.scss']
})
export class ModalCommentComponent implements OnInit {

  observacion = new FormControl('', Validators.required);
  lectura = false;
  constructor(
    private dialogRef: MatDialogRef<ModalCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private staffRequestService: StaffRequestService,
    private snack: MatSnackBar
    ) {
      this.lectura = this.data.request.lectura;
      this.observacion.setValue(this.data.request.scomment);
  }

  ngOnInit(): void {
  }

  accept(): void {
    let payload;
    switch (this.data.request.form)
    {
      case 'MedicalDetailComponent':
        payload = {
          nid_medical: this.data.request.nid_medical,
          sfullname: this.data.request.sfullname,
          idArea: this.data.request.idArea,
          receptorId: this.data.request.receptorId,
          emisorId: this.data.request.emisorId,
          scomment: this.observacion.value
        }
        this.staffRequestService.reject(payload).subscribe(resp => {
          this.snack.open('La solicitud se rechazo correctamente', "OK", {
            duration: 4000,
          });
          this.cancel();
        } );
    
        break;
    
      case 'RequestDetailComponent':
        payload = {
          nid_request: this.data.request.nid_request,
          nid_collaborator: this.data.request.nid_collaborator,
          nid_reseptor: this.data.request.nid_reseptor,
          nid_area: this.data.request.nid_area,
          type: this.data.request.type,
          scomment: this.observacion.value
        }
        
        this._serviceEmployee.RejectRequest(payload).subscribe((resp: any )=> {
          
          this.dialogRef.close();
          this.snack.open(resp.data, "OK", {
            duration: 4000,
          });
        });
        break;
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }
}
