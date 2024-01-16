import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { TypeStaffRequestService } from "@app/data/service/typestaffrequest.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserService } from "@app/data/service/user.service";

@Component({
  selector: "app-dialog-add-approver",
  templateUrl: "dialog-add-approver.component.html",
  styleUrls: ["./dialog-add-approver.component.scss"],
})
export class DialogAddApproverComponent implements OnInit {
  public itemForm: FormGroup;
  profiles: any[];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddApproverComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private typeStaffRequestService: TypeStaffRequestService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  stopProp(e) {
    e.stopPropagation();
  }

  buildItemForm(item) {
    
    this.itemForm = this.fb.group({
      title: [item.title || null],
      level: [item.level || null, Validators.required],
      idApprover: [item.idApprover || 0],
      idProfile: [item.idProfile || null, Validators.required],
      allowApproveAll: [
        item.allowApproveAll == undefined ? false : item.allowApproveAll,
      ],
      profile:''
    });
  }

  accpet() {
    let idProfile = this.itemForm.controls["idProfile"].value;
    this.itemForm.controls['profile'].setValue(this.getprofile(idProfile));
    this.dialogRef.close(this.itemForm.value);
  }

  getprofile(id){
    return this.profiles.find(x=>x.id == id).name;
  }

  load() {
    this.loadProfile();
    this.buildItemForm(this.data.payload);  
  }

  loadProfile() {
    this.userService.getProfileList().subscribe((res) =>{ 
      this.profiles = res.data;
    });
  }

  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }
}
