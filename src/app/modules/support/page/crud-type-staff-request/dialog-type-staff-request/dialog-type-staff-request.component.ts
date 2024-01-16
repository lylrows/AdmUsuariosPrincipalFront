import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { TypeStaffRequestService } from "@app/data/service/typestaffrequest.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogAddApproverComponent } from "../dialog-add-approver/dialog-add-approver.component";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestService } from "@app/data/service/staff-request.service";

@Component({
  selector: "app-dialog-type-staff-request",
  templateUrl: "dialog-type-staff-request.component.html",
  styleUrls: ["./dialog-type-staff-request.component.scss"],
})
export class DialogTypeStaffRequestComponent implements OnInit {
  public itemForm: FormGroup;
  idApprover: number;
  listApprover: any[] = [];
  displayedColumns: string[] = ["delete", "edit", "name", "profile"];
  categories: any[] = [];
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogTypeStaffRequestComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private typeStaffRequestService: TypeStaffRequestService,
    private staffRequestService: StaffRequestService
  ) {
  }

  ngOnInit() {
    this.idApprover = 0;
    this.load();
    this.getCategory();
  }

  stopProp(e) {
    e.stopPropagation();
  }

  getCategory(): void {
    this.staffRequestService.Listcategory().subscribe(res => {
      this.categories = res.data;
    })
  }

  update(item) {
    item.favorite = true;
    this.typeStaffRequestService.update(item).subscribe((res) => {});
  }

  buildItemForm(item) {
    
    if (item.typeStaffRequestApproverList){
      this.listApprover = item.typeStaffRequestApproverList;
    }
    this.itemForm = this.fb.group({
      title: [item.title || null],
      name: [item.name || null,[Validators.required,Validators.pattern('[A-Za-z0-9-/.$<>ÁÉÍÓÚáéíóúñÑ ]+')]],
      CategoryId: [item.categoryId, [Validators.required]],
      description: [item.description || null,[Validators.pattern('[A-Za-z0-9-/.$<>ÁÉÍÓÚáéíóúñÑ ]+')]],
      active: [
        item.active == undefined ? true : item.active,
      ],
      typeStaffRequestApproverList: [item.typeStaffRequestApproverList || null],
      id: [item.id || 0],
    });
  }

  submit() {
    this.itemForm.controls["typeStaffRequestApproverList"].setValue(this.listApprover);
    if (this.itemForm.value.id == 0) {
        this.typeStaffRequestService.add(this.itemForm.value).subscribe(
            (res) => {
              if (res.stateCode == 200) {
                this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
                this.dialogRef.close(false);
              } else if (res.stateCode == 2) {
                this.snack.open(res.messageError[0], "OK", { duration: 4000 });
              } else {
                this.snack.open("Ocurrio un error en el servidor", "Error", {
                  duration: 4000,
                });
              }
            },
            (err) => {},
            () => {
              this.load();
            }
          );
    } else {
      this.typeStaffRequestService.update(this.itemForm.value).subscribe(
        (res) => {
          // this.loader.close();
          if (res.stateCode == 200) {
            this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
            this.dialogRef.close(false);
          } else {
            this.snack.open("Ocurrio un error en el servidor", "Error", {
              duration: 4000,
            });
          }
        },
        (err) => {},
        () => {
          this.load();
        }
      );
    }
  }

  load() {
    this.buildItemForm(this.data.payload);
    this.updateIdApprover();
  }

  addApprover(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Tipo de Solicitud" : "Editar Tipo de Solicitud";
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogAddApproverComponent, {
      width: "600px",
      disableClose: true,
      data: { title: 'Agregar Aprobador', payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.addRowData(res);
      } else {
        this.updateRowData(res);
      }
    });
  }

  updateRowData(item){
    this.listApprover = this.listApprover.filter((value,key)=>{
      if(value.idApprover == item.idApprover){
        value.name = item.name;
        value.name = 'Aprobador ' + item.level;
        value.level =  item.level;
        value.idProfile = item.idProfile,
        value.profile = item.profile,
        value.allowApproveAll = item.allowApproveAll
      }
      return true;
    });
    this.sortListApproverByLevel();
    this.tableApprover.renderRows();
  }

  addRowData(item){
    let idApprover = this.idApprover + 1;
    this.listApprover.push({
      idApprover:idApprover,
      name:'Aprobador ' + item.level,
      level: item.level,
      idProfile: item.idProfile,
      profile: item.profile,
      allowApproveAll: item.allowApproveAll
    });
    this.sortListApproverByLevel();
    this.tableApprover.renderRows();
    this.updateIdApprover();
  }

  deleteApprover(index){
    this.listApprover.splice(index, 1);
    this.sortListApproverByLevel();
    this.tableApprover.renderRows();
    //this.updateIdApprover();
  }

  updateIdApprover(){
    this.idApprover = this.listApprover.length;
  }

  sortListApproverByLevel(){
    let level = 0;
    this.listApprover = this.listApprover.sort(function(a,b){
      return a.level - b.level;
    });
  }

  editeApprover(index){
    let data = this.listApprover[index];
    this.addApprover(data, false);
  }

}
