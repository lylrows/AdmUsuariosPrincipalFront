import { filter } from 'rxjs/operators';
import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { NineBoxService } from '@app/data/service/ninebox.service';

@Component({
  selector: 'app-dialog-ninebox',
  templateUrl: './dialog-ninebox.component.html',
  styleUrls: ['./dialog-ninebox.component.scss'],
  animations: egretAnimations,
})
export class DialogNineboxComponent implements OnInit {
  public itemForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogNineboxComponent>,
    private fb: FormBuilder,
    private nineBoxService: NineBoxService,
  ) { }

  ngOnInit(): void {
    
    this.buildItemForm(this.data.payload);
  }

  buildItemForm(item) {
    
    this.itemForm = this.fb.group({
      Id: [item.nid_config || 0, Validators.required],
      IdGroup: [item.nid_group || 0, Validators.required],
      CodeConfig: [item.scode_config || "", Validators.required],
      NameGroup: [item.snamegroup || null, Validators.required],
      Description: [item.sdescription || "", Validators.required],
      MinLevel: [item.nmin_level || 0],
      MaxLevel: [item.nmax_level || 0],
      active: [item.bactive == undefined ? true : item.bactive],
    });

  }
  submit() {
    
    this.dialogRef.close(this.itemForm.value);
  }

  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }

}
