import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators,FormControl,FormGroupDirective, NgForm } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog-category.component.html',
  styleUrls: ['./dialog-category.component.scss']
})
export class DialogCategoryComponent implements OnInit {

  public itemForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogCategoryComponent>,
  private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.buildItemForm();
  }
  submit() {
    try {
      let description = this.itemForm.controls['description'].value;
      this.dialogRef.close(description);
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  buildItemForm() {
    this.itemForm = this.fb.group({
      description: ["",[Validators.required]],
    });
  }
  getErrorMessage(){
    if (this.itemForm.controls['description'].hasError('required')) {
      return 'Debe ingresar una descripción';
    }
  }
}
