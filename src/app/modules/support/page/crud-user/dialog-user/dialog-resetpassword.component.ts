import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { UserService } from "./../../../../../data/service/user.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: "app-dialog-user",
  templateUrl: "dialog-resetpassword.component.html",
  animations: egretAnimations,
})
export class DialogUserResetPasswordComponent implements OnInit {
  public itemForm: FormGroup;
  public items: any[];
  iduser=0;
  
  contrasenias_iguales: boolean= true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogUserResetPasswordComponent>,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.load();
  }

  buildItemForm(item) {
    this.iduser = item.id || 0;
    this.itemForm = this.fb.group({
      passwordwithoutencryption: [item.passwordwithoutencryption || "", [Validators.required]],
      passwordconfirm: [item.passwordconfirm || "",[Validators.required]],// CustomValidators.equalTo(password)
      id: [item.id || 0],
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value);
  }

  load() {
    // this.userService.getAll().subscribe((res) => {
    //   this.items = res.data;
    // });
  }

  validContrasenias() {
    this.contrasenias_iguales = true;
    if (this.itemForm.controls['passwordwithoutencryption'].value==="" && this.itemForm.controls['passwordconfirm'].value==="") {
    }
    else {
      if (this.itemForm.controls['passwordwithoutencryption'].value === this.itemForm.controls['passwordconfirm'].value) {
        this.contrasenias_iguales = true;
      }else{
        this.contrasenias_iguales = false;
      }
    }
  }

}
