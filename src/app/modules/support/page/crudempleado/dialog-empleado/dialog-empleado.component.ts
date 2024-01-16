import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { IPositionList } from "@app/data/schema/cargo";
import { IDetailEmployee, IEmployeeFile } from "@app/data/schema/employee";
import { IUpdateEmploye } from "@app/data/schema/employee/employe-query";
import { ICompanyList } from "@app/data/schema/empresa";
import { IListPhone, IPerson } from "@app/data/schema/person";
import { EmployeeService } from "@app/data/service/employee.service";
import { UtilService } from "@app/data/service/util.service";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";

@Component({
  selector: "app-dialog-empleado",
  templateUrl: "./dialog-empleado.component.html",
  styleUrls: ["./dialog-empleado.component.scss"],
})
export class DialogEmpleadoComponent implements OnInit {
  title: string;
  id: number;
  idemploye: number;
  isedit: boolean;
  person: IPerson = null;
  employee: IDetailEmployee = null;
  listphone: IListPhone[] = [];
  blockProvince: boolean = false;
  blockDistrict: boolean = false;

  sex: any[] = [];
  nacionality: any[] = [];
  civil: any[] = [];
  active: any[] = [];

  departament: any[] = [];
  province: any[] = [];
  district: any[] = [];

  company: ICompanyList[] = [];
  position: IPositionList[] = [];

  constCenter: any[] = [];
  area: any[] = [];
  state: any[] = [];
  payroll: any[] = [];
  employeeFile: IEmployeeFile = null;

  formPerson: FormGroup;
  formEmployee: FormGroup;
  formEmployeeFile: FormGroup;

  blockTap1: boolean = false;
  blockTap2: boolean = false;
  blockTap3: boolean = false;

  bExistEmployeeFile: boolean = false;

  btnNextPrev = {
    prev: true,
    next: false,
    index: 0,
  };

  address: any[] = [];
  isLinear = false;

  formAddress: FormGroup;

  phoneDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'phone'
  ];

  adressDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorphone: MatPaginator;
  @ViewChild(MatSort) sortphone: MatSort;
  displayedColumnsphone: string[] = [
    'option',
    'address',
    'distric',
    'province',
    'departament',
    'state'
  ];

  idPhone: number = null;
  idAddress: number = null;
  isNewAddress: boolean = false;
  isNewPhone: boolean = false;
  inputPhone = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]);

  initForm(): void {
    this.formPerson = this._fs.group({
      nid_person: [''],
      scodperson: [''],
      sfirstname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      ssecondname: [''],
      slastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      smotherlastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      semail: [''],
      nid_sex: ['', [Validators.required]],
      sbloodtype: [''],
      sidentification: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      spassport: [''],
      dbirthdate: ['', [Validators.required]],
      nid_nationality: ['', [Validators.required]],
      nid_civilstatus: ['', [Validators.required]],
      bitisnotdomiciled: ['', [Validators.required]],
      sdrivinglicense: [''],
      duniversitygraduationdate: [''],
      dcountryentrydate: [''],
      smedicalstaff: [''],
      nid_active: ['', [Validators.required]],
      simg: [''],
      phones: this._fs.array([])
    })
  }

  initPhoneArray(): FormGroup {
    return new FormGroup({
      nid_phone: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)])
    })
  }

  initFormEmployee(): void {
    this.formEmployee = this._fs.group({
      nid_employee: [''],
      scodemployee: [''],
      nid_person: [''],
      nid_position: ['', [Validators.required]],
      nid_area: ['', [Validators.required]],
      nid_company: ['', [Validators.required]],
      plaza: [''],
      nid_costcenter: ['', [Validators.required]],
      ddateoffirstadmission: [''],
      dadmissiondate: ['', [Validators.required]],
      ddeparturedate: [''],
      nid_payroll: ['', [Validators.required]],
      bdependents: [''],
      snit: [''],
      dcompanyseniority: [''],
      dgovernmentseniority: [''],
      nid_state: ['', [Validators.required]],
      sinsurednumbers: [''],
      stypeinsurance: [''],
      shealthpermit: [''],
    })
  }

  initFormEmployeeFile(): void {
    this.formEmployeeFile = this._fs.group({
      nid_employee_file: [''],
      nid_employee: [''],
      nvacationdays: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      npendingvacations: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      bsalarycurrency: ['', [Validators.required]],
      bctscurrency: ['', [Validators.required]],
      bitsray: ['', [Validators.required]],
      nid_safeplan: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      bdoesnotapplyqta: ['', [Validators.required]],
      bmixedafp: ['', [Validators.required]],
    })
  }

  initAddress(): void {
    this.formAddress = this._fs.group({
      nid_address: [''],
      saddress: ['', [Validators.required]],
      nid_district: ['',[Validators.required]],
      nid_province: ['', [Validators.required]],
      nid_departament: ['', [Validators.required]],
      state: [''],
      nid_person: [''],
      flat: [''],
    })
  }

  constructor(
    private dialogRef: MatDialogRef<DialogEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private _serviceUtil: UtilService,
    private _fs: FormBuilder,
    private confirmService: AppConfirmService,
  ) {
    this.initForm();
    this.initFormEmployee();
    this.initFormEmployeeFile();
    this.initAddress();
    this.title = this.data.title;
    this.id = this.data.id;
    this.idemploye = this.data.idemploye;
    this.isedit = this.data.isedit;
  }

  ngOnInit(): void {
    this.getPerson();
    this.getDetailtEmployee();
    this.getListPhone();
    this.getSex();
    this.getNationality();
    this.getCivil();
    this.getActive();
    this.getConstcenter();
    this.getState();
    this.getListCompany();
    this.getArea();
    this.getListPayroll();
    this.getEmployeeFile();
    this.getListAddress();
    this.getDepartament();
    this.blockTap1 = true;

    if (!this.isedit) {
      this.blockTap2 = true;
      this.blockTap3 = true;
      this.isLinear = false;
    } else {
      this.isLinear = true;
    }

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

    this.formEmployee.get('nid_company').valueChanges.subscribe(() => {
      const id: number = this.formEmployee.get('nid_company').value;
      this.getListPosition(id);
    })
  }

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

  addPhone(): void {
    const refPhones = this.formPerson.get('phones') as FormArray;
    refPhones.push(this.initPhoneArray())
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

  getDistrict(id:number): void {
    this._serviceUtil.getDistrit(id).subscribe(resp => {
      this.district = resp;
    })
  }

  changecompany(): void {
    this.formEmployee.get('nid_position').setValue('');
    this.formEmployee.get('nid_position').updateValueAndValidity();
    this.formEmployee.get('nid_position').markAllAsTouched();
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getListAddress(): void {
    this._serviceEmployee.getListAddress(this.id).subscribe(resp => {
      this.address = resp;
      
      this.adressDT = new MatTableDataSource(this.address);
      if (this.adressDT.data != null) {
        this.adressDT.paginator = this.paginatorphone;
        this.adressDT.sort = this.sortphone;
      }
    })
  }

  getEmployeeFile(): void {
    this._serviceEmployee.getEmployeeFile(this.id).subscribe(resp => {
      this.employeeFile = resp;
      if (this.employeeFile != null) {
        this.bExistEmployeeFile = true;
        this.formEmployeeFile.patchValue(this.employeeFile);
      } else {
        this.bExistEmployeeFile = false;
        this.formEmployeeFile.reset({
          nid_employee_file: 0,
          nid_employee: this.idemploye,
          nvacationdays: '',
          npendingvacations: '',
          bsalarycurrency: false,
          bctscurrency: false,
          bitsray: false,
          nid_safeplan: false,
          bdoesnotapplyqta: false,
          bmixedafp: false,
        })
      }
      
      
    });
  }

  getListCompany(): void {
    this._serviceEmployee.getListCompany().subscribe(resp => this.company = resp);
  }

  getListPosition(id_company: number ): void {
    this._serviceEmployee.getListPosition(id_company).subscribe(resp => this.position = resp);
  }

  getListPayroll(): void {
    this._serviceUtil.getPayroll().subscribe(resp => this.payroll = resp);
  }

  getPerson(): void {
    this._serviceEmployee.getPerson(this.id).subscribe(resp => {
      this.person = resp;
      this.formPerson.patchValue(this.person);
    })
  }

  getDetailtEmployee(): void {
    this._serviceEmployee.getDetailtEmployee(this.id).subscribe(resp => {
      this.employee = resp;
      this.formEmployee.patchValue(this.employee);
    
    })
  }

  addGetPhone(id: number, value: string): FormGroup {
    return new FormGroup({
      nid_phone: new FormControl(id),
      phone: new FormControl(value, [Validators.required, Validators.pattern(/^[0-9]\d*$/)])
    })
  }

  getListPhone(): void {
    this._serviceEmployee.getListPhone(this.id).subscribe(resp => {
      this.listphone = resp;
      this.phoneDT = new MatTableDataSource(this.listphone);
      if (this.phoneDT.data != null) {
        this.phoneDT.paginator = this.paginator;
        this.phoneDT.sort = this.sort;
      }
    })
  }

  getSex(): void {
    this._serviceUtil.getSex().subscribe(resp => this.sex = resp);
  }

  getNationality(): void {
    this._serviceUtil.getNationality().subscribe(resp => this.nacionality = resp);
  }

  getCivil(): void {
    this._serviceUtil.getCivil().subscribe(resp => this.civil = resp);
  }

  getActive(): void {
    this._serviceUtil.getActive().subscribe(resp => this.active = resp);
  }

  getConstcenter(): void {
    this._serviceUtil.getCostCenter(4).subscribe(resp => this.constCenter = resp);
  }

  getArea(): void {
    this._serviceUtil.getArea().subscribe(resp => this.area = resp)
  }

  getState(): void {
    this._serviceUtil.getStateEmployee().subscribe(resp => this.state = resp)
  }

  nextfirsh() {
    if (this.formPerson.invalid) {
      return Object.values(this.formPerson.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    this.blockTap1 = false;
    this.btnNextPrev.index = 1;
    this.blockTap2 = true;
  }

  prevPerson(): void {
    this.blockTap1 = true;
    this.btnNextPrev.index = 0;
    this.blockTap2 = false;
  }

  prevEmployee(): void {
    this.blockTap1 = false;
    this.blockTap2 = true;
    this.blockTap3 = false;
    this.btnNextPrev.index = 1;
  }

  nextEmployee(): void {
    if (this.formEmployee.invalid) {
      return Object.values(this.formPerson.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    this.blockTap1 = false;
    this.blockTap2 = false;
    this.blockTap3 = true;
    this.btnNextPrev.index = 2;
    
  }

  removeSpacesPerson(controlName: string): void {
    let value = this.formPerson.get(controlName).value;
    if (value == null) return;
    this.formPerson.get(controlName).setValue(value.trimLeft());
  }

  save(): void {
    if (this.formPerson.invalid) {
      return Object.values(this.formPerson.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (this.formEmployee.invalid) {
      return Object.values(this.formPerson.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    
    if (this.formEmployeeFile.invalid) {
      
      return Object.values(this.formEmployeeFile.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    /*const payload: IUpdateEmploye = {
      nid_person: this.formPerson.get('nid_person').value,
      scodperson: this.formPerson.get('scodperson').value,
      sfirstname: this.formPerson.get('sfirstname').value,
      ssecondname: this.formPerson.get('ssecondname').value,
      slastname: this.formPerson.get('slastname').value,
      smotherlastname: this.formPerson.get('smotherlastname').value,
      semail: this.formPerson.get('semail').value,
      nid_sex:  this.formPerson.get('nid_sex').value,
      sbloodtype: this.formPerson.get('sbloodtype').value,
      sidentification: this.formPerson.get('sidentification').value,
      spassport: this.formPerson.get('spassport').value,
      dbirthdate: this.formPerson.get('dbirthdate').value,
      nid_nationality: this.formPerson.get('nid_nationality').value,
      nid_civilstatus: this.formPerson.get('nid_civilstatus').value,
      bitisnotdomiciled: this.formPerson.get('bitisnotdomiciled').value,
      sdrivinglicense: this.formPerson.get('sdrivinglicense').value,
      duniversitygraduationdate: this.formPerson.get('duniversitygraduationdate').value,
      dcountryentrydate: this.formPerson.get('dcountryentrydate').value,
      smedicalstaff: this.formPerson.get('smedicalstaff').value,
      nid_active: this.formPerson.get('nid_active').value,
      simg: this.formPerson.get('simg').value,
      nid_employee: this.formEmployee.get('nid_employee').value,
      scodemployee: this.formEmployee.get('scodemployee').value,
      nid_position: this.formEmployee.get('nid_position').value,
      nid_company: this.formEmployee.get('nid_company').value,
      plaza: this.formEmployee.get('plaza').value,
      nid_costcenter: this.formEmployee.get('nid_costcenter').value,
      ddateoffirstadmission: this.formEmployee.get('ddateoffirstadmission').value,
      dadmissiondate: this.formEmployee.get('dadmissiondate').value,
      ddeparturedate: this.formEmployee.get('ddeparturedate').value,
      nid_payroll: this.formEmployee.get('nid_payroll').value,
      bdependents: this.formEmployee.get('bdependents').value,
      snit: this.formEmployee.get('snit').value,
      dcompanyseniority: this.formEmployee.get('dcompanyseniority').value,
      dgovernmentseniority: this.formEmployee.get('dgovernmentseniority').value,
      nid_state: this.formEmployee.get('nid_state').value,
      sinsurednumbers: this.formEmployee.get('sinsurednumbers').value,
      stypeinsurance: this.formEmployee.get('stypeinsurance').value,
      shealthpermit: this.formEmployee.get('shealthpermit').value,
      nid_employee_file: this.formEmployeeFile.get('nid_employee_file').value,
      nvacationdays: this.formEmployeeFile.get('nvacationdays').value,
      npendingvacations: this.formEmployeeFile.get('npendingvacations').value,
      bsalarycurrency: this.formEmployeeFile.get('bsalarycurrency').value,
      bctscurrency: this.formEmployeeFile.get('bctscurrency').value,
      bitsray: this.formEmployeeFile.get('bitsray').value,
      nid_safeplan: this.formEmployeeFile.get('nid_safeplan').value,
      bdoesnotapplyqta: this.formEmployeeFile.get('bdoesnotapplyqta').value,
      bmixedafp: this.formEmployeeFile.get('bmixedafp').value,
      bemployee_file_exist: this.bExistEmployeeFile
    }

    this._serviceEmployee.updateEmploye(this.id, payload).subscribe(resp => {
      this.dialogRef.close(true);
    })*/
    
  }

  add(): void {
    this.isNewPhone = true;
    this.idPhone = null;
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

  savePhone(): void {
    let payload;

    if (this.inputPhone.invalid) {
      return this.inputPhone.markAllAsTouched();
    }
    if (this.idPhone != null ) {
      payload = {
        nid_phone: this.idPhone,
        nid_person: this.id,
        phone: this.inputPhone.value,
        flat: 2
      }
    } else {
      payload = {
        nid_phone: 0,
        nid_person: this.id,
        phone: this.inputPhone.value,
        flat: 1
      }
    }
    this._serviceEmployee.managementPhone(payload).subscribe( resp => {
      this.cancelphone();
      this.getListPhone();
    })
  }

  deletephone(row): void {
    this.confirmService.confirm({message: `Desea eliminar el Teléfono seleccionado?`})
      .subscribe(res => {
        if (res) {
          const payload = {
            nid_phone: row.nid_phone,
            nid_person: this.id,
            phone: row.phone,
            flat: 3
          }
          this._serviceEmployee.managementPhone(payload).subscribe((res) => {
            this.cancelphone();
            this.getListPhone();
          });
        }
      })
  }

  saveAddress(): void {
    let payload;

    if (this.formAddress.invalid) {
      return Object.values(this.formAddress.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (this.idAddress != null ) {
      payload = {
        nid_address: this.formAddress.get('nid_address').value,
		    saddress: this.formAddress.get('saddress').value,
		    nid_district: this.formAddress.get('nid_district').value,
		    state: this.formAddress.get('state').value,
    		nid_person: this.id,
		    flat: 2
      }
    } else {
      payload = {
        nid_address: 0,
		    saddress: this.formAddress.get('saddress').value,
		    nid_district: this.formAddress.get('nid_district').value,
		    state: true,
    		nid_person: this.id,
		    flat: 1
      }
    }

    this._serviceEmployee.managementAddress(payload).subscribe(resp => {
      this.cancelAddress();
      this.getListAddress();
    })

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
    	nid_person: this.id,
		  flat: 2
    })
    this.idAddress = row.nid_address;
  }

  deleteadress(row): void {
    this.confirmService.confirm({message: `Desea eliminar esta Direccion seleccionado?`})
      .subscribe(res => {
        if (res) {
          const payload = {
            nid_address: row.nid_address,
            saddress: this.formAddress.get('saddress').value,
            nid_district: row.nid_address,
            state: row.state,
            nid_person: this.id,
            flat: 3
          }

          this._serviceEmployee.managementAddress(payload).subscribe(resp => {
            this.cancelAddress();
            this.getListAddress();
          })
        }
      })
  }

}
