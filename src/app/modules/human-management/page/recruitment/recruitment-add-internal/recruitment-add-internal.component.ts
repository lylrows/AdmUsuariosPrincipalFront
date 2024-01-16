import { environment } from './../../../../../../environments/environment';
import { UtilService } from './../../../../../data/service/util.service';
import { CargoService } from "./../../../../../data/service/cargo.service";
import { RecruitMentPersonnelService } from "./../../../../../data/service/recruitment-personnel.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { EmployeeService } from '@app/data/service/employee.service';
import { MatTableDataSource } from "@angular/material/table";
import Swal from 'sweetalert2';
import { EmpresaService } from '@app/data/service/empresa.service';
import { Empresa } from '@app/data/schema/empresa';
import { AreaService } from '@app/data/service/areas.service';
import { MastertableService } from '@app/data/service/mastertable.service';
import { PerformanceService } from '@app/data/service/performance.service';

@Component({
  selector: "app-add-internal",
  templateUrl: "recruitment-add-internal.component.html",
  styleUrls: ["./recruitment-add-internal.component.scss"],
})
export class RecruitmentAddInternalComponent implements OnInit {
  public empresas: Empresa[];
  public areas: any;
  form: FormGroup;
  storage;
  idUser: number;
  title = "";
  type: number = 2;
  typereq: number;
  lstcargo: any[] = [];
  lstCategory: any[] = [];
  lstGrade: any[] = [];
  lstSede: any[] = [];
  lstLocation: any[] = [];
  newPosition: boolean = false;
  nidRequest: number = 0;
  nidEmployment: number = 0;
  esNuevo: boolean;
  CompetenciasDT: MatTableDataSource<any> = new MatTableDataSource([]);
  competencias: any[] = [];
  disabledCompanyArea: boolean = false;
  showVacanteTemporal: boolean = true;
  hideotherLenguaje: boolean = false;
  hideotherLevel: boolean = false;
  listPostGrado: any[];
  idioma:any={};
  lstIdiomas:Array<any>=[];
  pregrado:any={};
  lstPregrado:Array<any>=[];
  postgrado:any={};
  lstPostgrado:Array<any>=[];
  public lstLanguages:any;
  LanguagesDT: MatTableDataSource<any> = new MatTableDataSource([]);
  PregradoDT: MatTableDataSource<any> = new MatTableDataSource([]);
  PostgradoDT: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumnsLanguages:string[]=[
    "idioma",
    "nivel",
    "acciones"
  ]
  displayedColumnsPregrado:string[]=[
    "carrera",
    "grado",
    "acciones"
  ]
  displayedColumnsPostgrado:string[]=[
    "carrera",
    "grado",
    "acciones"
  ]
  
  displayedColumns: string[] = [
    "seleccion",
    "competencia",
    "nivel1",
    "nivel2",
    "nivel3",
    "nivel4"
  ];
  
  editorOptions= {
    toolbar: [
      [{ 'list': 'bullet' }],
      [ 'bold', 'italic', 'underline'],
    ],
  };

  nidLastId: number = 0;
  IdAreaInicial = '';

  listEmployee: any[] = [];
  listEmployeeSelected: any[] = [];
  listHorarios: any[];
  listHorariosSelected: any[];

  constructor(
    private dialogRef: MatDialogRef<RecruitmentAddInternalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fs: FormBuilder,
    private _service: RecruitMentPersonnelService,
    private _utilService: UtilService,
    private _employeeService: EmployeeService,
    private empresaService: EmpresaService,
    private chargeService: CargoService,
    private _serviceUtil: UtilService,
    private areaService: AreaService,
    private masterService:MastertableService,
    private _performanceService: PerformanceService,
    private cargoService: CargoService
  ) {    
    this.loadLanguages();
    this.loadEmpresas();
    this.GetListHorarios();
    this.ListPostGrado();
    this.getDepartament();
    this.initForm();
    this.title = this.data.title;
    
    this.typereq = this.data.typereq;
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.idUser = this.storage.id;
    this.esNuevo = this.data.esNuevo;
    if (this.data.objData != null) this.SetForm(this.data.objData);
    
    if(environment.perfilSelectAreaPosition.indexOf(this.storage.nid_profile) == -1) {
        this.disabledCompanyArea = true;
    } 
    if (this.storage.extra_companies != null && this.storage.extra_companies != '') {
      this.disabledCompanyArea = false;
    }
    this.GetEmployeeChargeByUser();
  }

  ngOnInit() {
    this.GetEmployeeChargeByUser();
  }

  initForm(): void {
    this.form = this._fs.group({
      IdCompany: [0],
      IdApplicant: [""],
      IdTypeRequest: ["", [Validators.required]],
      nid_replacement_employee: [null],
      IdCategory: [null, [Validators.required]],

      banotherlanguage: [false],
      
      sanotherlanguagename: [""],

      sname: ["", [Validators.required]],
      nid_company: ["", Validators.required],
      sjustification: ["", [Validators.required]],
      sbusiness: ["", Validators.required],
      sknowledge: ["", [Validators.required]],
      sabilities: ["", [Validators.required]],
      sfunctions: ["", [Validators.required]],
      schedule: ["", [Validators.required]],
      nid_modalitycontracting: [null, [Validators.required]],
      ncontracttime: ["", [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.min(1)]],
      
      sposition: ["", [Validators.required]],
      State: [0],
      scomment: [""],
      Employment: ["", [Validators.required]],
      idcharge: [null, [Validators.required]],
      newPosition: [null],
      isSuitableForDisabled: [null || false],
      
      scareer: [""],
      idgrade: [0],
      
      scareer_post: [""],
      idgrade_post: [0],
      idsede: [null, [Validators.required]],
      idlocation: [null, [Validators.required]],
      nid_company_position: [0, [Validators.required]],
      nid_area_position: [0, [Validators.required]],
      scommentfirstmonth: ["", [Validators.required]],
      scommentfirstyear: ["", [Validators.required]]
    });
  }

  loadEmpresas() {
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.empresaService.getAll().subscribe(res => {
      this.empresas = res;
      if (this.storage.extra_companies != null && this.storage.extra_companies != '') {
        this.empresas = this.empresas.filter(x => this.storage.extra_companies.indexOf(x.id) > -1);
      }
    });
  }
  
  changeEmpresa(): void {
    const company = Number(this.form.get("nid_company_position").value);
    this.loadAreas(company, 0, 0);
  } 

  loadAreas(idCompany: number, idGerencia: number, idArea: number) {
    this.areaService.getByCompany(idCompany).subscribe((res) => {
      this.areas = res.data;
      if(idArea != 0) {
        this.form.get("nid_area_position").setValue(idGerencia);
        this.loadCargo(idGerencia);  
      }
    });
  }

  GetEmployeeChargeByUser(): void {
    this._service.GetEmployeeChargeByUser().subscribe(
      (resp) => {
        this.form.get("sname").setValue(resp.nameApplicant);
        this.form.get("sposition").setValue(resp.nameArea);
        
        this.form.get("IdApplicant").setValue(resp.idApplicant);
        this.form.get("nid_company").setValue(resp.idCompany);
        this.form.get("sbusiness").setValue(resp.company);
        if(this.disabledCompanyArea){
          this.IdAreaInicial = resp.idArea;
          this.form.get("nid_company_position").setValue(resp.idCompany);
          this.loadAreas(resp.idCompany, resp.idGerencia, resp.idArea);
        }
      },
      (err) => {},
      () => {
        
        
        this.loadCategoryEmployment();
        this.loadAcademicGrade();
        this.loadSede();
      }
    );
  }

  changePosition($event) {
    this.setCheck($event.checked, true);
  }

  setCheck(checked: boolean, loadCargo: boolean) {
    if (checked == false) {
      this.newPosition = false;
      this.showVacanteTemporal = true;
      this.type = 2;
      this.form.get("idcharge").setValue(null);

      this.form.get("Employment").clearValidators();
      this.form.get("idcharge").setValidators([Validators.required]);
      this.form.get("Employment").updateValueAndValidity();
      this.form.get("idcharge").updateValueAndValidity();    
      if(loadCargo) this.loadCompetenciaByCargo(this.nidRequest, -1, 0);
    } else {
      this.newPosition = true;
      this.showVacanteTemporal = false;
      this.type = 1;
      this.form.get("Employment").setValue("");

      this.form.get("idcharge").clearValidators();
      this.form.get("Employment").setValidators([Validators.required]);
      this.form.get("idcharge").updateValueAndValidity();
      this.form.get("Employment").updateValueAndValidity();
      if(loadCargo) this.loadCompetenciaByCargo(this.nidRequest, 0, 0);

      this.form.get('IdTypeRequest').setValue(null);
      this.form.get("nid_replacement_employee").clearValidators();
      this.form.get("nid_replacement_employee").markAsUntouched();
      this.form.get("nid_replacement_employee").updateValueAndValidity();
    }
  }

  changeVacante($event) {
    if ($event.value == 3412) {
      this.ListEmployee(this.form.get("nid_area_position").value);
      this.form.get("nid_replacement_employee").setValue(null);
      this.form.get("nid_replacement_employee").setValidators([Validators.required]);
      this.form.get("nid_replacement_employee").updateValueAndValidity();    
    } else {
      this.form.get("nid_replacement_employee").clearValidators();
      this.form.get("nid_replacement_employee").markAsUntouched();
      this.form.get("nid_replacement_employee").updateValueAndValidity();
    }
  }

  changeSelectPuesto($event) {
    
    let description: any;
    description = this.lstcargo.find((x) => x.nid_charge == $event.value);
    this.form.get("Employment").setValue(description.snamecharge);
    this.loadCompetenciaByCargo(this.nidRequest, $event.value, 0);
  }

  loadCargo(idGerencia: Number) {
    const idcompany = this.form.get("nid_company_position").value;
    
    const payload = {
      nidcompany: idcompany,
      nidgerencia: idGerencia,
      nidarea: 0,
      nidsubarea: 0

    }
    this._performanceService.GetChargesByCompanyArea(payload).subscribe((res) => {
      this.lstcargo = res;
    });
  }

  loadCategoryEmployment() {
    this._utilService.getCategoryEmployment().subscribe((res) => {
      this.lstCategory = res
    });
  }

  loadAcademicGrade() {
    this._employeeService.ListGeneric(64).subscribe((res) => {
      this.lstGrade = res;
    });
  }

  loadCompetenciaByCargo(_idRequest: number, _idCargo: number, _primeraCarga: number) {
    let validchecked = this.form.get("newPosition").value == null ? false : this.form.get("newPosition").value
    this.chargeService.getCompetenciaByCargo(_idRequest, _idCargo, _primeraCarga).subscribe(
      (resp) => {
        if(_idCargo !== -1){
          if(this.data.objData === null){
            if(validchecked === true){
              for (let index = 0; index < resp.data.length; index++) {
                const element = resp.data[index];
                if(index <= 2){
                  resp.data[index].nidSelected = 1;
                  resp.data[index].idLevel = 1;
                  resp.data[index].required = true;
                }
              }
            }else{
              for (let index = 0; index < resp.data.length; index++) {
                const element = resp.data[index];
                if(index <= 2){
                  resp.data[index].required = true;
                }
              }
            }

          }
          this.competencias = resp.data;
        }else{
          resp.data = {}
          this.competencias = resp.data;
        }
      },
      (err) => {},
      () => {
        this.CompetenciasDT = new MatTableDataSource(this.competencias);
      }
    );
  }

  loadSede() {
    this._employeeService.ListGeneric(990).subscribe((res) => {
      this.lstSede = res;
    });
  }

  save() {
    if (this.form.invalid) {
      let mensajes = this.generarLogValidaciones();
      
      if(mensajes.length > 0)
      {
        let mensajeHtml = "<ul style='text-align:justify;font-size:14px;'>";
        mensajes.forEach(m => {
          mensajeHtml += `<li>${m}</li>`;
        });
        mensajeHtml += "</ul>";

        Swal.fire({
          icon: 'warning',
          html: mensajeHtml,
          title: "Errores de validación"
        });
      }
      
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if(this.competencias.length == 0)
    {
      Swal.fire({
        icon: 'warning',
        text: `La lista de competencias no puede estar vacía`
      });
      return false;
    }
    if(this.lstIdiomas.length == 0)
    {
      Swal.fire({
        icon: 'warning',
        text: `La lista de idiomas no puede estar vacía`
      });
      return false;
    }else{
      let mensajes = this.generarLogValidaciones();
      if(mensajes.length > 0)
      {
        let mensajeHtml = "<ul style='text-align:justify;font-size:14px;'>";
        mensajes.forEach(m => {
          mensajeHtml += `<li>${m}</li>`;
        });
        mensajeHtml += "</ul>";

        Swal.fire({
          icon: 'warning',
          html: mensajeHtml,
          title: "Errores de validación" 
        });
        return false;
      }
    }
    if(this.lstPregrado.length == 0)
    {
      Swal.fire({
        icon: 'warning',
        text: `La lista de pregrados no puede estar vacía`
      });
      return false;
    }

    const payload = {
      lstLanguages:this.lstIdiomas,
      lstPregrado:this.lstPregrado,
      lstPostgrado:this.lstPostgrado,
      IdCompany: Number(this.form.get("nid_company").value),
      IdApplicant: Number(this.form.get("IdApplicant").value),
      IdTypeRequest: Number(this.form.get("IdTypeRequest").value),
      nid_replacement_employee: this.form.get("IdTypeRequest").value == 3412 ? this.form.get("nid_replacement_employee").value : null,
      IdCategory: Number(this.form.get("IdCategory").value),
      sjustification: this.form.get("sjustification").value,
      sknowledge: this.form.get("sknowledge").value,
      sabilities: this.form.get("sabilities").value,
      sfunctions: this.form.get("sfunctions").value,
      schedule: this.form.get("schedule").value,
      nid_modalitycontracting: Number(
        this.form.get("nid_modalitycontracting").value
      ),
      ncontracttime: Number(this.form.get("ncontracttime").value),
      nsalaryemployment: 0,
      nvariableremuneration: 0,
      State: 2,
      Vacancy: 1,
      UserRegister: this.idUser,
      Employment: this.form.get("Employment").value,
      nid_originarea: this.storage.nid_position,
      idcharge: Number(this.form.get("idcharge").value),
      newPosition:
        this.form.get("newPosition").value == null
          ? false
          : this.form.get("newPosition").value,
      nid_nivel: 1,
      ntype: this.typereq,
      IdRequest: this.esNuevo ? 0 : this.nidRequest,
      IdEmployment: this.esNuevo ? 0 : this.nidEmployment,
      isSuitableForDisabled: this.form.get("isSuitableForDisabled").value == null
      ? false
      : this.form.get("isSuitableForDisabled").value,
      scareer: this.form.get("scareer").value,
      idgrade: Number(this.form.get("idgrade").value),
      scareer_post: this.form.get("scareer_post").value,
      idgrade_post: Number(this.form.get("idgrade_post").value),
      idsede: Number(this.form.get("idsede").value),
      idlocation: Number(this.form.get("idlocation").value),
      nid_company_position: Number(this.form.get("nid_company_position").value),
      scommentfirstmonth: this.form.get("scommentfirstmonth").value,
      scommentfirstyear: this.form.get("scommentfirstyear").value,
      scomment: this.form.get("scomment").value,
      nid_area_position: Number(this.form.get("nid_area_position").value),
      sname_newcharge: this.form.get("Employment").value
    };

    if(!this.validarCompetencias()) return;
    this.guardarRequest(payload, true);
    
  }

  close(): void {
    this.dialogRef.close(false);
  }

  valideKey(evt) {
    
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
        
        return true;
    } else if (code >= 48 && code <= 57) {
        
        return true;
    } else {
        
        return false;
    }
}

generarLogValidaciones = () => {
  let mensajes = new Array<string>();
  for (const name in this.form.controls) { 
    if (this.form.controls[name].invalid) { 
      switch (name) {
        case "nid_company_position":
          mensajes.push("El campo Empresa tiene errores de validación.");
        break;
        case "nid_area_position":
          mensajes.push("El campo Área tiene errores de validación.");
        break;
        case "Employment":
          mensajes.push("El campo Nombre del Puesto tiene errores de validación.");
        break;
        case "idcharge":
          mensajes.push("El campo Puesto tiene errores de validación.");
        break;
        case "IdTypeRequest":
          mensajes.push("El campo Tipo de Vacante tiene errores de validación.");
        break;
        case "nid_replacement_employee":
          mensajes.push("El campo Empleado de Reemplazo tiene errores de validación.");
        break;
        case "idlocation":
          mensajes.push("El campo Locación tiene errores de validación.");
        break;
        case "idsede":
          mensajes.push("El campo Sede tiene errores de validación.");
        break;
        case "IdCategory":
          mensajes.push("El campo Categoría del Empleado tiene errores de validación.");
        break;
        case "sjustification":
          mensajes.push("El campo Justificación tiene errores de validación.");
        break;
        case "sfunctions":
          mensajes.push("El campo Principales Funciones del Puesto tiene errores de validación.");
        break;
        case "schedule":
          mensajes.push("El campo Horario de Trabajo tiene errores de validación.");
        break;
        case "nid_modalitycontracting":
          mensajes.push("El campo Modalidad de Contratación tiene errores de validación.");
        break;
        case "ncontracttime":
          mensajes.push("El campo Tiempo de Contratación tiene errores de validación.");
        break;
        case "sknowledge":
          mensajes.push("El campo Conocimientos tiene errores de validación.");
        break;
        case "sabilities":
          mensajes.push("El campo Certificaciones tiene errores de validación.");
        break;
        case "scommentfirstmonth":
          mensajes.push("El campo Primer Mes tiene errores de validación.");
        break;
        case "scommentfirstyear":
          mensajes.push("El campo Primer Año tiene errores de validación.");
        break;
      }
    } 
  }
  
  
  let competencesRequired = this.competencias.filter(x => x.required == true).length;
  let competencesRequiredSelected = this.competencias.filter(x => x.required == true && x.nidSelected == 1).length;
  if(competencesRequired != competencesRequiredSelected)
    mensajes.push(`Debe seleccionar las ${competencesRequired} compentecias obligatorias para el puesto.`);

  
  const _countCompetences = this.competencias.filter(x => x.nidSelected == 1).length;
  if (_countCompetences < environment.competenciasMinimas || this.competencias == null || typeof this.competencias == 'undefined' || this.competencias.length == 0)
    mensajes.push(`Debe seleccionar mínimo ${environment.competenciasMinimas } competencias para el puesto.`);

  if(this.lstIdiomas.length == 0)
    mensajes.push("La lista de idiomas no puede estar vacía.");
  if(this.lstPregrado.length == 0)
    mensajes.push("La lista de pregrados no puede estar vacía.");

  return mensajes;
};

  saveBorrador() {  
    
    if (this.form.invalid) {
      let mensajes = this.generarLogValidaciones();
      
      if(mensajes.length > 0)
      {
        let mensajeHtml = "<ul style='text-align:justify;font-size:14px;'>";
        mensajes.forEach(m => {
          mensajeHtml += `<li>${m}</li>`;
        });
        mensajeHtml += "</ul>";

        Swal.fire({
          icon: 'warning',
          html: mensajeHtml,
          title: "Errores de validación"
        });
      }

      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if(this.competencias.length == 0)
    {
      Swal.fire({
        icon: 'warning',
        text: `La lista de competencias no puede estar vacía`
      });
      return false;
    }else{
      let mensajes = this.generarLogValidaciones();
      if(mensajes.length > 0)
      {
        let mensajeHtml = "<ul style='text-align:justify;font-size:14px;'>";
        mensajes.forEach(m => {
          mensajeHtml += `<li>${m}</li>`;
        });
        mensajeHtml += "</ul>";

        Swal.fire({
          icon: 'warning',
          html: mensajeHtml,
          title: "Errores de validación" 
        });
        return false;
      }
    }

    if(this.lstIdiomas.length == 0)
    {
      Swal.fire({
        icon: 'warning',
        text: `La lista de idiomas no puede estar vacía`
      });
      return false;
    }
    if(this.lstPregrado.length == 0)
    {
      Swal.fire({
        icon: 'warning',
        text: `La lista de pregrados no puede estar vacía`
      });
      return false;
    }
    const payload = {
      lstLanguages:this.lstIdiomas,
      lstPregrado:this.lstPregrado,
      lstPostgrado:this.lstPostgrado,
      IdCompany: Number(this.form.get("nid_company").value),
      IdApplicant: Number(this.form.get("IdApplicant").value),
      IdTypeRequest: Number(this.form.get("IdTypeRequest").value),
      nid_replacement_employee: this.form.get("IdTypeRequest").value == 3412 ? this.form.get("nid_replacement_employee").value : null,
      IdCategory: Number(this.form.get("IdCategory").value),
      sjustification: this.form.get("sjustification").value,
      sknowledge: this.form.get("sknowledge").value,
      sabilities: this.form.get("sabilities").value,
      sfunctions: this.form.get("sfunctions").value,
      schedule: this.form.get("schedule").value,
      nid_modalitycontracting: Number(
        this.form.get("nid_modalitycontracting").value
      ),
      ncontracttime: Number(this.form.get("ncontracttime").value),
      nsalaryemployment: 0,
      nvariableremuneration: 0,
      State: 1,
      Vacancy: 1,
      UserRegister: this.idUser,
      Employment: this.form.get("Employment").value,
      nid_originarea: this.storage.nid_position,
      idcharge: Number(this.form.get("idcharge").value),
      newPosition:
        this.form.get("newPosition").value == null
          ? false
          : this.form.get("newPosition").value,
      nid_nivel: 1,
      ntype: this.typereq,
      IdRequest: this.esNuevo ? 0 : this.nidRequest,
      IdEmployment: this.esNuevo ? 0 : this.nidEmployment,
      isSuitableForDisabled: this.form.get("isSuitableForDisabled").value == null
      ? false
      : this.form.get("isSuitableForDisabled").value,
      scareer: this.form.get("scareer").value,
      idgrade: Number(this.form.get("idgrade").value),
      scareer_post: this.form.get("scareer_post").value,
      idgrade_post: Number(this.form.get("idgrade_post").value),
      idsede: Number(this.form.get("idsede").value),
      idlocation: Number(this.form.get("idlocation").value),
      nid_company_position: Number(this.form.get("nid_company_position").value),
      scommentfirstmonth: this.form.get("scommentfirstmonth").value,
      scommentfirstyear: this.form.get("scommentfirstyear").value,
      scomment: this.form.get("scomment").value,
      nid_area_position: Number(this.form.get("nid_area_position").value),
      sname_newcharge: this.form.get("Employment").value
    };

    if(!this.validarCompetencias()) return;
    this.guardarRequest(payload, false);
  }

  SetForm(objData: any) {
    
    
    this.form.get("nid_company_position").setValue(objData.nid_company_position);
    this.changeEmpresa();
    this.form.get("nid_area_position").setValue(objData.nid_area_position);
    this.loadCargo(objData.nid_area_position); 
    this.nidRequest = objData.nid_request;
    this.nidEmployment = objData.nid_employment;
    this.form.get("nid_company").setValue(objData.nid_company);
    this.form.get("IdApplicant").setValue(objData.nid_applicant);
    this.form.get("IdCategory").setValue(objData.nid_category);
    if(objData.nid_typerequest === 3412){
      
      this.ListEmployee(objData.nid_area_position);
    }
    this.form.get("nid_replacement_employee").setValue(objData.nid_replacement_employee);
    this.form.get("sjustification").setValue(objData.sjustification);
    this.form.get("sknowledge").setValue(objData.sknowledge);
    this.form.get("sabilities").setValue(objData.sabilities);
    this.form.get("sfunctions").setValue(objData.sfunctions);
    this.form.get("schedule").setValue(objData.schedule);
    this.form.get("nid_modalitycontracting").setValue(objData.nid_modalitycontracting);
    this.form.get("ncontracttime").setValue(objData.ncontracttime);
    this.form.get("banotherlanguage").setValue('');
    this.form.get("sanotherlanguagename").setValue('');
    this.form.get("newPosition").setValue(objData.newPosition);
    this.form.get("idsede").setValue(objData.nidsede);
    this.form.get("scareer").setValue(objData.scareer);
    this.form.get("idgrade").setValue(objData.nidgrade);
    this.form.get("scareer_post").setValue(objData.scareer_post);
    this.form.get("idgrade_post").setValue(objData.idgrade_post);
    this.form.get("isSuitableForDisabled").setValue(objData.isSuitableForDisabled);
    this.form.get("IdCategory").setValue(objData.nid_category);
    this.form.get("idsede").setValue(objData.nidsede);
    this.form.get("idlocation").setValue(objData.nid_location);
    this.form.get("scommentfirstmonth").setValue(objData.scommentfirstmonth);
    this.form.get("scommentfirstyear").setValue(objData.scommentfirstyear);
    this.form.get("scomment").setValue(objData.scomment);

    if(objData.lstLanguages.length > 0){
      this.LanguagesDT = new MatTableDataSource(objData.lstLanguages);
      this.lstIdiomas = objData.lstLanguages
    }

    if(objData.lstPregrado.length > 0){
      this.PregradoDT = new MatTableDataSource(objData.lstPregrado);
      this.lstPregrado = objData.lstPregrado
    }

    if(objData.lstPostgrado.length > 0){
      this.PostgradoDT = new MatTableDataSource(objData.lstPostgrado);
      this.lstPostgrado = objData.lstPostgrado
    }
    
    this.setCheck(objData.newPosition, false);
    if (objData.newPosition) this.form.get("Employment").setValue(objData.nameNewCharge);   
    else {
      this.form.get("idcharge").setValue(objData.chargerequired);
      this.form.get("Employment").setValue(objData.sname);
    }
    this.form.get("IdTypeRequest").setValue(objData.nid_typerequest);
    this.loadCompetenciaByCargo(this.nidRequest, objData.chargerequired, 1);
  }

  checkCompetencia(row: any, value: number) {  
    if(row.nidSelected == 0) return;
    let index = this.competencias.findIndex(res => res.id == row.id);
    this.competencias[index].idLevel = value;
    this.CompetenciasDT = new MatTableDataSource(this.competencias);
  }
  
  clickCompetence($event, _id: number) {
    let index = this.competencias.findIndex(res => res.id == _id);
    if ($event.checked) {
      this.competencias[index].nidSelected = 1;
      this.competencias[index].idLevel = 1;
    } else {
      this.competencias[index].nidSelected = 0; 
      this.competencias[index].idLevel = 0;
    }
  }

  guardarCompetenciasConfig(nid_request: number) {
    let _listaFirltro = this.competencias;
    _listaFirltro.forEach(res => {
      res.idCharge = this.newPosition ? 0 : Number(this.form.get("idcharge").value);
      res.idRequest = nid_request,
      res.userRegister = this.idUser
    });
    this.chargeService.saveCompetenciaConfig(_listaFirltro).subscribe(
      (resp) => {
      },
      (err) => {console.log('Error finalizo guardarCompetenciasConfig', err);},
      () => {
        console.log('finalizo guardarCompetenciasConfig');
      }
    );
  }

  

  guardarRequest(payload: any, enviarNotificacion: boolean) {
    let _nombrePuesto = '';
    if (this.newPosition) {
      _nombrePuesto = this.form.get("Employment").value;
    } else {
      const _idPuesto = this.form.get("idcharge").value;
      const _index = this.lstcargo.findIndex(x => x.nid_charge == _idPuesto);
      _nombrePuesto = this.lstcargo[_index].snamecharge;
    }
    this._service.Create(payload).subscribe((resp) => {
      this.guardarCompetenciasConfig(resp);
      this.dialogRef.close({
        enviarNotificacion: enviarNotificacion,
        idRequest: resp,
        nombrePuesto: _nombrePuesto
      });
    });
  }

  validarCompetencias(): boolean {
    
    
    let result = true;

    const _countCompetences = this.competencias.filter(x => x.nidSelected == 1).length;
    if (_countCompetences < environment.competenciasMinimas || this.competencias == null || typeof this.competencias == 'undefined' || this.competencias.length == 0) result = false;
    if(!result) {
      Swal.fire({
        icon: 'info',
        text: `Debe seleccionar mínimo ${environment.competenciasMinimas } competencias para el puesto`
      });
      return false;
    }

    
    let competencesRequired = this.competencias.filter(x => x.required == true).length;
    let competencesRequiredSelected = this.competencias.filter(x => x.required == true && x.nidSelected == 1).length;
    if(competencesRequired != competencesRequiredSelected)
    {
      Swal.fire({
        icon: 'info',
        text: `Debe seleccionar las ${competencesRequired} compentecias obligatorias para el puesto`
      });
      return false;
    }

    return true;
  }

  getDepartament(): void {
    this._serviceUtil.getDepartament().subscribe(resp => {
      this.lstLocation = resp;
    })
  }

  ListPostGrado(): void {
    this._employeeService.ListGenericByKey(environment.keyListaPostGrado).subscribe(resp => {
      this.listPostGrado = resp;
    })
  }
  AgregarIdioma()
  {
    
    this.idioma.slanguage = this.form.get("banotherlanguage").value;
    this.idioma.snivel = this.form.get("sanotherlanguagename").value;

    if(this.idioma.slanguage && this.idioma.snivel)
    {
      
      if(this.lstIdiomas.some(lan => lan.slanguage == this.idioma.slanguage))
      {
        Swal.fire({
          icon: 'warning',
          text: `El idioma ingresado ${this.idioma.slanguage} ya existe en la lista de idiomas`
        });
        return false;
      }
      this.lstIdiomas.unshift(this.idioma);
      this.idioma = {};
      this.LanguagesDT = new MatTableDataSource(this.lstIdiomas);
    }    
  }
  EliminarIdioma(slanguage: string)
  {
    this.lstIdiomas = this.lstIdiomas.filter(lan => lan.slanguage != slanguage);
    this.LanguagesDT = new MatTableDataSource(this.lstIdiomas);
  }
  loadLanguages()
  {
    this.masterService.getByIdFather(93).subscribe(res => {
      this.lstLanguages = res;
      
    })
  }
  AgregarPregrado()
  {
    this.pregrado.scareer = this.form.get("scareer").value;
    this.pregrado.idgrade = Number(this.form.get("idgrade").value);

    if(this.pregrado.scareer && this.pregrado.idgrade)
    {
      
      if(this.lstPregrado.some(pre => pre.scareer == this.pregrado.scareer))
      {
        Swal.fire({
          icon: 'warning',
          text: `El pregrado ${this.pregrado.scareer} ya existe en la lista de pregrados`
        });
        return false;
      }

      for(let i=0;i<this.lstGrade.length;i++)
      {
        if(this.lstGrade[i].nid_mastertable==this.form.get("idgrade").value)
          this.pregrado.sgrade = this.lstGrade[i].sdescription_value;
      }

      this.lstPregrado.unshift(this.pregrado);
      this.pregrado = {}
      this.PregradoDT = new MatTableDataSource(this.lstPregrado);
    }   
  }
  EliminarPregrado(scareer: string)
  {
    this.lstPregrado = this.lstPregrado.filter(pre => pre.scareer != scareer);
    this.PregradoDT = new MatTableDataSource(this.lstPregrado);
  }
  AgregarPostgrado()
  {
    this.postgrado.scareer= this.form.get("scareer_post").value;
    this.postgrado.idgrade = Number(this.form.get("idgrade_post").value);

    if(this.postgrado.scareer && this.postgrado.idgrade)
    {
      
      if(this.lstPostgrado.some(pos => pos.scareer == this.postgrado.scareer))
      {
        Swal.fire({
          icon: 'warning',
          text: `El postgrado ${this.postgrado.scareer} ya existe en la lista de postgrados`
        });
        return false;
      }

      for(let i=0;i<this.listPostGrado.length;i++)
      {
        if(this.listPostGrado[i].sshort_value==this.form.get("idgrade_post").value)
          this.postgrado.sgrade = this.listPostGrado[i].sdescription_value;
      }
      
      this.lstPostgrado.unshift(this.postgrado);
      
      this.postgrado = {}
      this.PostgradoDT = new MatTableDataSource(this.lstPostgrado);
    }
  }
  EliminarPostgrado(scareer: string)
  {
    this.lstPostgrado = this.lstPostgrado.filter(pos => pos.scareer != scareer);
    this.PostgradoDT = new MatTableDataSource(this.lstPostgrado);
  }

  onKey(value) { 
    this.listEmployeeSelected = this.search(value);
  }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.listEmployee.filter(option => option.sfullname.toLowerCase().indexOf(filter) > -1);
  }

  ListEmployee(position: string): void {
    
    this._employeeService.ListEmployeeReplacement(this.form.get("nid_area_position").value).subscribe(resp => {
      this.listEmployee = resp;
      this.listEmployeeSelected = this.listEmployee;
    })
  }
  
  GetListHorarios() {
    this._employeeService.ListGenericByKey(environment.keyHorarioExactus).subscribe(resp => {
      this.listHorarios = resp;
      this.listHorariosSelected = this.listHorarios;
      
    })
  }

  onKeyHorario(value) { 
    this.listHorariosSelected = this.searchHorario(value);
  }
 
  searchHorario(value: string) { 
    let filter = value.toLowerCase();
    return this.listHorarios.filter(option => (option.sshort_value + ' - '+ option.sdescription_value).toLowerCase().includes(filter));
  }
}
