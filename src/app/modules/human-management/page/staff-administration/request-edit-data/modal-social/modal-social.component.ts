import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDetailEmployee } from '@app/data/schema/employee';
import { IPerson } from '@app/data/schema/person';
import { EmployeeService } from '@app/data/service/employee.service';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-social',
  templateUrl: './modal-social.component.html',
  styleUrls: ['./modal-social.component.scss']
})
export class ModalSocialComponent implements OnInit {
  idEmployee: number = 0;
  idPerson: number = 0;

  showCombo: boolean = true;
  showEsposa: boolean = false;
  showHijos: boolean = false;

  person: IPerson;
  employee: IDetailEmployee;
  listson: any[] = [];
  form: FormGroup;

  file: File = null;

  fileName: string = '';

  idHijos: number = 0;

  isNewHijos: boolean = false;

  public maxDate: Date;
  pipe = new DatePipe('en-US');
  initForm(): void {
    this.form = this._fs.group({
      name: ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
      fecha: ['', [Validators.required]],
      inputLastnameSon : ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
      smotherslastname: ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
      year: ['']
    })
  }

  seccions: any[] = [
    { code: 1, name: 'Esposa/Conviviente' },
    { code: 2, name: 'Hijos' },
  ]

  inputesposaname = new FormControl('', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]);
  inputesposalastname = new FormControl('', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]);
  inputesposamotherlastname = new FormControl('', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]);
  inputdate = new FormControl('', [Validators.required]);

  hijosDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'name',
    'lastname',
    'smotherslastname',
    'ddateofbirth'
  ];

  constructor(
    private dialogRef: MatDialogRef<ModalSocialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private _fs: FormBuilder
  ) {
    this.idPerson = this.data.person;
    this.idEmployee = this.data.employee;
    this.initForm();
    
  }
  changeFormat(today){
    let ChangedFormat = this.pipe.transform(today, 'dd/MM/YYYY');
    console.log("FECHA ACTUAL",ChangedFormat);
    this.maxDate=new Date(Number(this.pipe.transform(today, 'YYYY')),Number(this.pipe.transform(today, 'MM'))-1,Number(this.pipe.transform(today, 'dd')));
  }
  ngOnInit(): void {
    this.getDetailtEmployee();
    let fechaActual=new Date();
    this.changeFormat(fechaActual);
  }

  ListSon(): void {
    this._serviceEmployee.ListSon(this.idEmployee).subscribe(resp => {
      this.listson = resp;
      
      this.hijosDT = new MatTableDataSource(this.listson);
      if (this.hijosDT.data != null) {
        this.hijosDT.paginator = this.paginator;
        this.hijosDT.sort = this.sort;
      }
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getDetailtEmployee(): void {
    this._serviceEmployee.getDetailtEmployee(this.idEmployee).subscribe(resp => {
      this.employee = resp;
      
      this.inputesposaname.setValue(this.employee.snamewife_partner);
      this.inputdate.setValue(this.employee.ddateofmarriage)
    })
  }

  onFileSelected(event: any) {

    const pddf = event.target.files[0] as File;
    
    if (['application/pdf','image/jpeg', 'image/jpg', 'image/png',].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;
    } else {
      this.snack.open('Solo son permitidos los archivos pdf, jpeg, jpg y png', "OK", {
        duration: 4000,
      });

    }
  }

  changeSeccion(event): void {
    const value = Number(event.value);
    if ( value === 1 ) {
      this.showCombo = false;
      this.showEsposa = true;
    }

    if ( value === 2 ) {
      this.ListSon();
      this.showCombo = false;
      this.showHijos = true;
    }

  }

  addaddress(): void {
    this.isNewHijos = true;
    this.idHijos = null;
  }

  cancelAddress(): void {
    this.form.reset({
      name: '',
      fecha: '',
      year: '',
      inputLastnameSon: '',
      smotherslastname: ''
    })
    this.form.updateValueAndValidity();
    this.isNewHijos = false;
    this.idHijos = null;
  }

  saveAddress(): void {
    let payload;

    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    if ( this.file != null  ) {
      if (this.idHijos != null) {
        payload = {
          nid_typerequest: 12,
          nid_collaborator: Number(this.idEmployee),
          description: null,
          nid_address: null,
          saddress: null,
          nid_district: null,
          nid_phone: null,
          phone: null,
          nid_statecivil:null,
          nid_education:null,
          nid_instruction:null,
          sstudy_center:null,
          scurrent_cycle:null,
          dateStart:null,
          dateEnd:null,
          snamewife_partner:null,
          lastname_partner:null,
          motherlastname_partner:null,
          ddateofmarriage:null,
          nid_son: Number(this.idHijos),
          sfullname: this.form.get('name').value,
          ddateofbirth: this.form.get('fecha').value,
          nyear: null,
          ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
          ntypeseccion: 7,
          sheavymachinerylicense: null,
          sddriverlicense: null,
          slastname: this.form.get('inputLastnameSon').value,
          smotherslastname: this.form.get('smotherslastname').value,
          nid_person: this.idPerson,
        }
      } else {
        payload = {
          nid_typerequest:12,
          nid_collaborator: Number(this.idEmployee),
          description: null,
          nid_address: null,
          saddress: null,
          nid_district: null,
          nid_phone: null,
          phone: null,
          nid_statecivil:null,
          nid_education:null,
          nid_instruction:null,
          sstudy_center:null,
          scurrent_cycle:null,
          dateStart:null,
          dateEnd:null,
          snamewife_partner:null,
          lastname_partner:null,
          motherlastname_partner:null,
          ddateofmarriage:null,
          nid_son:null,
          sfullname: this.form.get('name').value,
          ddateofbirth: this.form.get('fecha').value,
          nyear: null,
          ntypeaction: 1, // 1 INSERT 2 - UPDATE - 3 DELETE
          ntypeseccion: 7,
          sheavymachinerylicense: null,
          sddriverlicense: null,
          slastname: this.form.get('inputLastnameSon').value,
          smotherslastname: this.form.get('smotherslastname').value,
          nid_person: this.idPerson,
        }
      }

      const formData = new FormData();
      formData.append('files', this.file);
      formData.append('request', JSON.stringify(payload));
  
      this._serviceEmployee.InsertRequestEmployee(formData).subscribe(resp => {
        this.cancelAddress();
        this.dialogRef.close();
        this.snack.open('Se registro correctamente su solicitud', "OK", {
          duration: 4000,
        });
      })
    } else {
      this.snack.open('Es obligatorio  adjuntar un archivo pdf', "OK", {
        duration: 4000,
      });
    }
    
  }

  editadress(row): void {
    this.isNewHijos = true;
    this.form.reset({
      name: row.sfullname,
      fecha: row.ddateofbirth,
      year: '',
      inputLastnameSon: row.slastname,
      smotherslastname: row.smotherslastname
    })
    this.idHijos = row.nid_son;
  }

  saveEsposa(): void {

    if ( this.inputesposalastname.invalid ) {
      this.inputesposalastname.markAllAsTouched();
      this.inputesposamotherlastname.markAllAsTouched();
      this.inputesposaname.markAllAsTouched();
      this.inputdate.markAllAsTouched();
      return;
    }

    if ( this.inputesposamotherlastname.invalid ) {
      this.inputesposamotherlastname.markAllAsTouched();
      this.inputesposaname.markAllAsTouched();
      this.inputdate.markAllAsTouched();
      return;
    }

    if ( this.inputesposaname.invalid ) {
      this.inputesposaname.markAllAsTouched();
      this.inputdate.markAllAsTouched();
      return;
    }

    if ( this.inputdate.invalid ) {
      return this.inputdate.markAllAsTouched();
    }

    if ( this.file != null  ) {
      const payload = {
        nid_typerequest: 12,
        nid_collaborator: Number(this.idEmployee),
        description: null,
        nid_address: null,
        saddress: null,
        nid_district: null,
        nid_phone: null,
        phone: null,
        nid_statecivil:null,
        nid_education:null,
        nid_instruction:null,
        sstudy_center:null,
        scurrent_cycle:null,
        dateStart:null,
        dateEnd:null,
        snamewife_partner: this.inputesposaname.value,
        lastname_partner:this.inputesposalastname.value,
        motherlastname_partner:this.inputesposamotherlastname.value,
        ddateofmarriage: this.inputdate.value,
        nid_son:null,
        sfullname:null,
        ddateofbirth:null,
        nyear:null,
        ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
        ntypeseccion: 6,
        sheavymachinerylicense: null,
        sddriverlicense: null,
        slastname: null,
        smotherslastname: null,
        nid_person: this.idPerson,
      }

      const formData = new FormData();
      formData.append('files', this.file);
      formData.append('request', JSON.stringify(payload));
  
      this._serviceEmployee.InsertRequestEmployee(formData).subscribe(resp => {
        this.dialogRef.close();
        this.snack.open('Se registro correctamente su solicitud', "OK", {
          duration: 4000,
        });
      })
    } else {
      this.snack.open('Es obligatorio  adjuntar un archivo pdf', "OK", {
        duration: 4000,
      });
    }

    
  }

}
