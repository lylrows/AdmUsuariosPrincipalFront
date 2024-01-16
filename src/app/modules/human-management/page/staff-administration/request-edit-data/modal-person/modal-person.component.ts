import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDetailEmployee } from '@app/data/schema/employee';
import { IListPhone, IPerson } from '@app/data/schema/person';
import { EmployeeService } from '@app/data/service/employee.service';
import { UtilService } from '@app/data/service/util.service';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-modal-person',
  templateUrl: './modal-person.component.html',
  styleUrls: ['./modal-person.component.scss']
})
export class ModalPersonComponent implements OnInit {
  idEmployee: number = 0;
  idPerson: number = 0;
  idPhone: number = null;

  showDireccion: boolean = false;
  showPhone: boolean = false;
  showState: boolean = false;
  showLicencia: boolean = false;
  formAddress: FormGroup;

  showCombo: boolean = true;
  cargaArchivo: boolean = false;

  fileName: string = '';

  blockProvince: boolean = false;
  blockDistrict: boolean = false;

  isNewPhone: boolean = false;

  departament: any[] = [];
  province: any[] = [];
  district: any[] = [];
  address: any[] = [];
  listphone: IListPhone[] = [];
  civil: any[] = [];

  isNewAddress: boolean = false;
  idAddress: number = null;

  adressDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('paginatoraddressmodal') paginatoraddressmodal: MatPaginator;
  @ViewChild(MatSort) sortphone: MatSort;
  displayedColumnsphone: string[] = [
    'option',
    'address',
    'distric',
    'province',
    'departament',
    'state'
  ];

  file: File = null;

  inputPhone = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.minLength(7),Validators.maxLength(9)]);
  inputCivil = new FormControl('', [Validators.required]);
  inputlicenciamaquina = new FormControl('', [Validators.required,Validators.pattern('[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ ]*')]);
  inputlicenciaconducir = new FormControl('', [Validators.required,Validators.pattern('[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ ]*')]);

  person: IPerson;
  employee: IDetailEmployee;

  seccions: any[] = [
    { code: 1, name: 'Dirección' },
    { code: 2, name: 'Teléfono fijo y movil' },
    { code: 3, name: 'Estado Civil' },
    { code: 4, name: 'Licencia' },
  ]

  initAddress(): void {
    this.formAddress = this._fs.group({
      nid_address: [''],
      saddress: ['', [Validators.required,Validators.pattern('[A-Za-z0-9-.#ÁÉÍÓÚáéíóúñÑ ]*')]],
      nid_district: ['', [Validators.required]],
      nid_province: ['', [Validators.required]],
      nid_departament: ['', [Validators.required]],
      state: [''],
      nid_person: [''],
      flat: [''],
    })
  }

  phoneDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'phone',
    'state'
  ];

  constructor(
    private dialogRef: MatDialogRef<ModalPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private _fs: FormBuilder,
    private _serviceUtil: UtilService,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
  ) {

    this.initAddress();
    this.idPerson = this.data.person;
    this.idEmployee = this.data.employee;
  }

  ngOnInit(): void {
    this.getPerson(this.idPerson)
    this.getDepartament();
    this.getDetailtEmployee();

    this.formAddress.get('nid_departament').valueChanges.subscribe(() => {
      const id: number = this.formAddress.get('nid_departament').value;
      if (id > 0) {
        this.getProvince(id);
        this.blockProvince = true;
      }
    })

    this.formAddress.get('nid_province').valueChanges.subscribe(() => {
      const id: number = this.formAddress.get('nid_province').value;
      if (id > 0) {
        this.getDistrict(id)
        this.blockDistrict = true;
      }
    })

  }

  onFileSelected(event: any) {
    this.subirArchivo(event)
  }

  
  onFileSelectedDireccion(event: any) {
    this.subirArchivo(event)
  }

  subirArchivo({target}) {
    const pddf = target.files[0] as File;
    
    if (['application/pdf','image/jpeg', 'image/jpg', 'image/png',].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;
    } else {
      this.snack.open('Solo son permitidos los archivos pdf, jpeg, jpg y png', "OK", {
        duration: 4000,
      });

    }
  }

  getDetailtEmployee(): void {
    this._serviceEmployee.getDetailtEmployee(this.idEmployee).subscribe(resp => {
      this.employee = resp;
      this.inputlicenciamaquina.setValue(this.employee.sheavymachinerylicense);
      this.inputlicenciaconducir.setValue(this.employee.sddriverlicense);
      
    })
  }

  changeSeccion(event): void {
    const value = Number(event.value);
    console.log("🚀 ~ ModalPersonComponent ~ changeSeccion ~ value:", value)
    if ( value === 1 ) {
      this.getListAddress(this.idPerson)
      this.showCombo = false;
      this.cargaArchivo = false;
      this.showDireccion = true;
    }

    if ( value === 2 ) {
      this.getListPhone(this.idPerson);
      this.showCombo = false;
      this.cargaArchivo = false;
      this.showPhone = true;
    }

    if ( value === 3 ) {
      this.showCombo = false;
      this.showState = true;
      this.cargaArchivo = true;
    }

    if ( value === 4 ) {
      this.showCombo = false;
      this.showLicencia = true;
      this.cargaArchivo = true;
    }
  }

  add(): void {
    this.isNewPhone = true;
    this.idPhone = null;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getCivil(): void {
    this._serviceUtil.getCivil().subscribe(resp => {
      this.civil = resp
      this.inputCivil.setValue(this.person.nid_civilstatus)
    });
  }

  addaddress(): void {
    this.isNewAddress = true;
    this.idAddress = null;
  }

  cancelAddress(): void {
    this.formAddress.reset({
      nid_address: '',
      saddress: '',
      nid_district: '',
      nid_province: '',
      nid_departament: '',
      state: '',
      nid_person: '',
      flat: '',
    })
    this.formAddress.updateValueAndValidity();
    this.isNewAddress = false;
    this.idAddress = null;
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  editadress(row): void {
    this.isNewAddress = true;
    this.formAddress.reset({
      nid_address: row.nid_address,
      saddress: row.saddress,
      nid_departament: row.nid_department,
      nid_province: row.nid_province,
      nid_district: row.nid_district,
      state: row.state,
      nid_person: this.idPerson,
      flat: 2
    })
    this.idAddress = row.nid_address;
  }

  getDepartament(): void {
    this._serviceUtil.getDepartament().subscribe(resp => {
      this.departament = resp;
    })
  }

  getProvince(id: number): void {
    this._serviceUtil.getProvince(id).subscribe(resp => {
      this.province = resp;
    })
  }

  getDistrict(id: number): void {
    this._serviceUtil.getDistrit(id).subscribe(resp => {
      this.district = resp;
    })
  }

  getListAddress(IdPerson: number): void {
    this._serviceEmployee.getListAddress(IdPerson).subscribe(resp => {
      this.address = resp;
      
      this.adressDT = new MatTableDataSource(this.address);
      if (this.adressDT.data != null) {
        this.adressDT.paginator = this.paginatoraddressmodal;
        this.adressDT.sort = this.sortphone;
      }
    })
  }

  getPerson(IdPerson: number): void {
    this._serviceEmployee.getPerson(IdPerson).subscribe(resp => {
      this.person = resp;
      this.getCivil();
    })
  }

  saveAddress(): void {
    let payload;

    if (this.formAddress.invalid) {
      return Object.values(this.formAddress.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if ( this.file != null  ) {
      if (this.idAddress != null) {
        payload = {
          nid_typerequest: 12,
          nid_collaborator: Number(this.idEmployee),
          description: null,
          nid_address: Number(this.formAddress.get('nid_address').value),
          saddress: this.formAddress.get('saddress').value,
          nid_district: Number(this.formAddress.get('nid_district').value),
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
          ddateofmarriage:null,
          nid_son:null,
          sfullname:null,
          ddateofbirth:null,
          nyear:null,
          ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
          ntypeseccion: 1,
          sheavymachinerylicense: null,
          sddriverlicense: null,
          slastname: null,
          smotherslastname: null,
          nid_person: this.idPerson,
        }
      } else {
        payload = {
          nid_typerequest:12,
          nid_collaborator: Number(this.idEmployee),
          description: null,
          nid_address: null,
          saddress: this.formAddress.get('saddress').value,
          nid_district: Number(this.formAddress.get('nid_district').value),
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
          ddateofmarriage:null,
          nid_son:null,
          sfullname:null,
          ddateofbirth:null,
          nyear:null,
          ntypeaction: 1, // 1 INSERT 2 - UPDATE - 3 DELETE
          ntypeseccion: 1,
          sheavymachinerylicense: null,
          sddriverlicense: null,
          slastname: null,
          smotherslastname: null,
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

  getListPhone(IdPerson: number): void {
    this._serviceEmployee.getListPhone(IdPerson).subscribe(resp => {
      this.listphone = resp;
      this.phoneDT = new MatTableDataSource(this.listphone);
      if (this.phoneDT.data != null) {
        this.phoneDT.paginator = this.paginator;
        this.phoneDT.sort = this.sort;
      }
    })
  }

  savePhone(): void {
    let payload;

    if (this.inputPhone.invalid) {
      return this.inputPhone.markAllAsTouched();
    }
    if (this.idPhone != null) {
      payload = {
        nid_typerequest: 12,
        nid_collaborator: Number(this.idEmployee),
        description: null,
        nid_address: null,
        saddress: null,
        nid_district: null,
        nid_phone: Number(this.idPhone),
        phone: this.inputPhone.value,
        nid_statecivil:null,
        nid_education:null,
        nid_instruction:null,
        sstudy_center:null,
        scurrent_cycle:null,
        dateStart:null,
        dateEnd:null,
        snamewife_partner:null,
        ddateofmarriage:null,
        nid_son:null,
        sfullname:null,
        ddateofbirth:null,
        nyear:null,
        ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
        ntypeseccion: 2,
        sheavymachinerylicense: null,
        sddriverlicense: null,
        slastname: null,
        smotherslastname: null,
        nid_person: this.idPerson,
      }
    } else {
      payload = {
        nid_typerequest: 12,
        nid_collaborator: Number(this.idEmployee),
        description: null,
        nid_address: null,
        saddress: null,
        nid_district: null,
        nid_phone: Number(this.idPhone),
        phone: this.inputPhone.value,
        nid_statecivil:null,
        nid_education:null,
        nid_instruction:null,
        sstudy_center:null,
        scurrent_cycle:null,
        dateStart:null,
        dateEnd:null,
        snamewife_partner:null,
        ddateofmarriage:null,
        nid_son:null,
        sfullname:null,
        ddateofbirth:null,
        nyear:null,
        ntypeaction: 1, // 1 INSERT 2 - UPDATE - 3 DELETE
        ntypeseccion: 2,
        sheavymachinerylicense: null,
        sddriverlicense: null,
        slastname: null,
        smotherslastname: null,
        nid_person: this.idPerson,
      }
    }

    const formData = new FormData();
    formData.append('files', this.file);
    formData.append('request', JSON.stringify(payload));

    this._serviceEmployee.InsertRequestEmployee(formData).subscribe(resp => {
      this.cancelphone();
      this.getListPhone(this.idPerson);
      this.dialogRef.close();
      this.snack.open('Se registro correctamente su solicitud', "OK", {
        duration: 4000,
      });
    })
    
  }

  savecivil(): void {
    if ( this.inputCivil.invalid ) {
      return this.inputCivil.markAllAsTouched();
    }

    if ( this.file != null  ) {
      const payload = {
        nid_typerequest: 12,
        nid_collaborator: Number(this.idEmployee),
        description: null,
        nid_address: null,
        saddress: null,
        nid_district: null,
        nid_phone:null,
        phone: null,
        nid_statecivil: Number(this.inputCivil.value),
        nid_education:null,
        nid_instruction:null,
        sstudy_center:null,
        scurrent_cycle:null,
        dateStart:null,
        dateEnd:null,
        snamewife_partner:null,
        ddateofmarriage:null,
        nid_son:null,
        sfullname:null,
        ddateofbirth:null,
        nyear:null,
        ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
        ntypeseccion: 3,
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

  saveLicencia(): void {

    if ( this.inputlicenciamaquina.invalid ) {
      return this.inputlicenciamaquina.markAllAsTouched();
    }

    if ( this.inputlicenciaconducir.invalid ) {
      return this.inputlicenciaconducir.markAllAsTouched();
    }

    if ( this.file != null  ) {
      const payload = {
        nid_typerequest: 12,
        nid_collaborator: Number(this.idEmployee),
        description: null,
        nid_address: null,
        saddress: null,
        nid_district: null,
        nid_phone:null,
        phone: null,
        nid_statecivil: null,
        nid_education: null,
        nid_instruction:null,
        sstudy_center:null,
        scurrent_cycle:null,
        dateStart:null,
        dateEnd:null,
        snamewife_partner:null,
        ddateofmarriage:null,
        nid_son:null,
        sfullname:null,
        ddateofbirth:null,
        nyear:null,
        ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
        ntypeseccion: 4,
        sheavymachinerylicense: this.inputlicenciamaquina.value,
        sddriverlicense: this.inputlicenciaconducir.value,
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

  deleteadress(row): void {
    this.confirmService.confirm({ message: `Desea eliminar la Dirección seleccionada?` })
      .subscribe(res => {
        if (res) {
          if ( this.file != null  ) {
            const payload = {
              nid_typerequest: 12,
              nid_collaborator: Number(this.idEmployee),
              description: null,
              nid_address: Number(row.nid_address),
              saddress: row.saddress,
              nid_district: Number(row.nid_district),
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
              ddateofmarriage:null,
              nid_son:null,
              sfullname:null,
              ddateofbirth:null,
              nyear:null,
              ntypeaction: 3, // 1 INSERT 2 - UPDATE - 3 DELETE
              ntypeseccion: 1,
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
      })
  }

  deletephone(row): void {
    this.confirmService.confirm({ message: `Desea eliminar el Teléfono seleccionado?` })
      .subscribe(res => {
        if (res) {
          // if ( this.file != null  ) {
            const payload = {
              nid_typerequest: 12,
              nid_collaborator: Number(this.idEmployee),
              description: null,
              nid_address: null,
              saddress: null,
              nid_district: null,
              nid_phone: Number(row.nid_phone),
              phone: row.phone,
              nid_statecivil:null,
              nid_education:null,
              nid_instruction:null,
              sstudy_center:null,
              scurrent_cycle:null,
              dateStart:null,
              dateEnd:null,
              snamewife_partner:null,
              ddateofmarriage:null,
              nid_son:null,
              sfullname:null,
              ddateofbirth:null,
              nyear:null,
              ntypeaction: 3, // 1 INSERT 2 - UPDATE - 3 DELETE
              ntypeseccion: 2,
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
            });
          // } else {
          //   this.snack.open('Es obligatorio  adjuntar un archivo pdf', "OK", {
          //     duration: 4000,
          //   });
          // }
          
        }
      })
  }

  cancelphone(): void {
    this.inputPhone.setValue('');
    this.isNewPhone = false;
    this.idPhone = null;
  }

  editphone(row): void {
    this.isNewPhone = true;
    this.inputPhone.setValue(row.phone);
    this.idPhone = row.nid_phone;
  }

}
