import { NestedTreeControl } from "@angular/cdk/tree";
import { ChangeDetectorRef, Component, DebugElement, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { ActivatedRoute, Router } from "@angular/router";
import { PerformanceService } from "@app/data/service/performance.service";
import { UtilService } from "@app/data/service/util.service";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import * as _moment from "moment";
import { BehaviorSubject } from "rxjs";
import { Mof, Proficiencies } from "../models/mof.interface";
import { environment } from 'environments/environment';

const moment = _moment; 

import { MAT_DATE_FORMATS } from "@angular/material/core";
import { Empresa } from "@app/data/schema/empresa";
import { EmpresaService } from "@app/data/service/empresa.service";
import { AreaService } from "@app/data/service/areas.service";
import { Areas } from "@app/data/schema/areas";

import { animate, state, style, transition, trigger } from '@angular/animations';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
// Agregados 22/06/2022
import { MatTableDataSource } from "@angular/material/table";
import { CalendarAngularDateFormatter } from "angular-calendar";

@Component({
  selector: "app-add-campaign",
  templateUrl: "./add-campaign.component.html",
  styleUrls: ["./add-campaign.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AddCampaignComponent implements OnInit {
  id: number = 0;
  form: FormGroup;
  title: string = "";
  campaign;
  chargerFC = new FormControl("");
  proficiencyFC = new FormControl("");
  bussineFC = new FormControl("");
  areaFC = new FormControl("");

  chargers: any[] = [];
  proficiencys: any[] = [];
  selectCharger: boolean = false;
  competencies: any[] = [];
  BASE_competencies: any[] = [];
  listCompetencies: any[] = [];

  dataChange = new BehaviorSubject<Mof[]>([]);

  listMof: Mof[] = [];
  listmonth: any[] = [];

  listpositionByCampaign: any[] = [];
  fechaIni: Date;

  treeControl = new NestedTreeControl<any>((node) => node.proficiencies);
  dataSource = new MatTreeNestedDataSource<Mof>();

  public empresas: Empresa[];

  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];

  //bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  //areaFC = new FormControl("");
  subAreaFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;

  // Agregado 22/06/2022
  CompetenciasDTO: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = [
    //"IdCompetence",
    "NameCompetence",
    // "NameDescription",
    "Level1",
    "Level2",
    "Level3",
    "Level4",
    //"actions"
  ];

  fecha_actual=new Date();
  initForm(): void {
    this.form = this._fs.group({
      name: ["", [Validators.required, Validators.maxLength(100),Validators.pattern('[A-Za-z0-9-ÁÉÍÓÚáéíóúñÑ ]*')]],
      year: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          // Validators.pattern(/^[0-9]\d*$/),
          Validators.pattern('[0-9]*'),
          Validators.min(this.fecha_actual.getFullYear())
        ],
      ],
      month: ["", [Validators.required]],
      dateInit: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
    });
  }
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fs: FormBuilder,
    private _service: PerformanceService,
    private _utilService: UtilService,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,
    private empresaService: EmpresaService,
    private areaService: AreaService
  ) {
    this.id = this._route.snapshot.params.id;
    this.initForm();
    this.fechaIni = new Date();
  }
  urlResources = '';

  selPositionsAvaliables = [];
  selPositionsAvaliables_Base = [];
  selPositionsAssigned: any = [];
  listPositionsAvailables = [];
  listPositionsAvailablesBase = [];
  listPositionsAssigned = [];
  ListproficienciesAssigned = [];
  ListproficienciesAvailables = [];

  selproficienciesAssigned = [];
  selproficienciesAvailables = [];

  // inicio - Ejemplo
  isTableExpanded = false;

  ngOnInit(): void {
    this.urlResources = environment.urlResources;
    this.getListCharges();
    this.getListProficiency();
    this.getMonth();
    this.loadEmpresas();

    // Listado de Competencias con 4 Niveles
    this.getListCompetencies();

    if (this.id > 0) {
      // LOGICA SI ESTA EDITANDO
      //MOD: 10082022
      //this.getListMof();
      this.getCampaign();

    } else {
      // LOGICA SI ES NUEVO
      this.title = "Registro de una nueva Campaña";
      // MOD:10082022
      // this.getListMof();

      //this.form.get("periodo").setValue(moment());
    }
  }

  changeEmpresa(): void {
    //const company = Number(this.bussineFC.value);
    // this.loadAreas(company);

    this.loadGerencia();
    this.disabledGerencia = false;

    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    this.disabledGerencia = false;
    this.disabledArea = true;
    this.disabledSubArea = true;
  }

  loadEmpresas() {
    let idUser = 0; //storage.id;
    const payload = {
      IdUser: idUser

    }
    this.areaService.getCompanyByUser(payload).subscribe((res) => {
      this.empresas = res.data;
    });

  }

  loadAreasOLD(idCompany: number) {
    this.areaService.getByCompany(idCompany).subscribe((res) => {
      this.areas = res.data;
    });
  }

  validEndDate(): void {
    const valueStart = this.form.get('dateInit').value;
    const valueEnd = this.form.get('dateEnd').value;

    if (valueStart != null) {

      const valueStartDate = new Date(valueStart);
      const valueEndDate = new Date(valueEnd);

      const valid = valueEndDate > valueStartDate;

      if (!valid) {
        this.snack.open("¡Es necesario que la fecha fin sea mayor a la fecha inicio!", "OK", { duration: 4000 });
        this.form.get('dateEnd').setValue(null)
      } else {
        // this.calculateDay();
      }

    } else {
      this.snack.open("¡Es necesario primero seleccionar una fecha inicio!", "OK", { duration: 4000 });
      this.form.get('dateEnd').setValue(null)
    }

  }

  getListCharges(): void {
    this._utilService.getCharger().subscribe((resp) => {
      this.chargers = resp;
    });
  }

  getMonth(): void {
    this.listmonth = this._service.getListMonth();
  }

  getListProficiency(): void {
    this._service.getListProficiency().subscribe((resp) => {
      this.proficiencys = resp;
    });
  }

  getListMof(): void {
    if (Number(this.bussineFC.value) == 0) {
      this.snack.open("¡Falta seleccionar la Empresa!", "OK", { duration: 4000 });
      return;
    }

    const payload = {
      CompanyId: Number(this.bussineFC.value),
      GerenciaId: Number(this.gerenciaFC.value),
      AreaId: Number(this.areaFC.value),
      SubAreaId: Number(this.subAreaFC.value)
    }

    this._service.getListMof(payload).subscribe((resp) => {
      this.listMof = resp;
      
      this.dataSource.data = this.listMof;
      this.listPositionsAvailables = this.listMof;
      if (this.listPositionsAssigned.length > 0) {
        // Seleccionar los registros ya agregados
        this.listPositionsAvailables.forEach((element) => {
          let found = this.listPositionsAssigned.find(
            (e) => e.idCharge == element.idCharge && e.idCompany == element.idCompany
          );
          if (found === undefined) {

          } else {
            element.isSelected = true;

          }

        });
      }

      this.listPositionsAvailablesBase = this.listMof;
    });

  }

  Filtrar(): void {
    this.getListMof()
  }

  resetFilter(): void {
    this.bussineFC.setValue('');
    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');

    this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;
    this.getListMof()
  }

  getCampaign(): void {
    this._service.getCampaign(this.id).subscribe((resp) => {

      this.campaign = resp;
      this.listpositionByCampaign = resp.positionList;
      this.title = "Mantenimiento de " + this.campaign.nameCampaign;
      const endDate = this.campaign.endDate;
      const startDate = this.campaign.startDate;

      const fechaStart = startDate.split("/");
      const fechaEnd = endDate.split("/");

      const day = Number(fechaEnd[0]);
      const month = Number(fechaEnd[1]);
      const year = Number(fechaEnd[2]);
      const fechaEndDate = new Date(year, month - 1, day);

      const dayStart = Number(fechaStart[0]);
      const monthStart = Number(fechaStart[1]);
      const yearStart = Number(fechaStart[2]);
      const fechaStartDate = new Date(yearStart, monthStart - 1, dayStart);

      this.form.reset({
        name: this.campaign.nameCampaign,
        year: Number(this.campaign.year),
        month: Number(this.campaign.month),
        dateInit: fechaStartDate,
        dateEnd: fechaEndDate,
      });

      // Cargar al combo los cargos devueltos de BD
      this.campaign.positionList.forEach(e => {
        this.listPositionsAssigned.push(e);
      });

    });
  }

  changeCharger(): void {
    this.selectCharger = true;
    this.getListProficiency();
  }

  save(): void {

    if (this.form.invalid) {

      return Object.values(this.form.controls).forEach((controls) => {

        controls.markAllAsTouched();
      });
    }

    for (let index = 0; index < this.listPositionsAssigned.length; index++) {
      let element = this.listPositionsAssigned[index].proficiencies;
      if (this.listPositionsAssigned[index].proficiencies.length < 3) {
        this.snack.open("Debe asignar al menor 3 competencias para el cargo: " + this.listPositionsAssigned[index].nameCharge, "OK", { duration: 4000 });
        return;
        break;
      }

    }

    if (this.id > 0) {
      this.confirmService
        .confirm({
          title: "Confirmación",
          message: "¿Esta seguro de editar la campaña?",
        })
        .subscribe((result) => {
          if (result) {

            const year = Number(this.form.get("year").value);
            const month = Number(this.form.get("month").value);

            let array: any[] = [];

            this.listPositionsAssigned.map((v) => {
              array.push({
                IdCampaign: Number(this.id),
                IdCharge: v.idCharge,
                ProficiencyList: [],
              });
            });

            array.map((v) => {
              this.listPositionsAssigned.map((e) => {
                if (e.idCharge === v.IdCharge) {
                  e.proficiencies.map((p) => {
                    v.ProficiencyList.push({
                      IdProficiency: p.code,
                      Active: true,
                      weight: p.weight != null ? p.weight : 1,
                      level: p.level != null ? p.level : 1,
                    });
                  });
                }
              });
            });

            const payload = {
              nIdCampaign: Number(this.id),
              sNameCampaign: this.form.get("name").value,
              nYear: Number(year),
              nMonth: Number(month),
              sStartDate: _moment(this.form.get("dateInit").value).format(
                "DD/MM/YYYY"
              ),
              sEndDate: _moment(this.form.get("dateEnd").value).format(
                "DD/MM/YYYY"
              ),
              lstAssignProficiencies: array,
            };

            this._service.saveCampaign(payload).subscribe((resp) => {
              this._router.navigate(["humanmanagement/bell"], {
                skipLocationChange: true
              });
            });
          }

          this.cdr.markForCheck();
        });
    } else {


      this.confirmService
        .confirm({
          title: "Confirmación",
          message: "¿Esta seguro de crear la campaña?",
        })
        .subscribe((result) => {
          if (result) {

            const year = Number(this.form.get("year").value);
            const month = Number(this.form.get("month").value);
            let array: any[] = [];

            this.listPositionsAssigned.map((v) => {
              array.push({
                IdCampaign: 0,
                IdCharge: v.idCharge,
                ProficiencyList: [],
              });
            });

            array.map((v) => {
              this.listPositionsAssigned.map((e) => {
                if (e.idCharge === v.IdCharge) {
                  e.proficiencies.map((p) => {
                    v.ProficiencyList.push({
                      IdProficiency: p.code,
                      Active: true,
                      weight: p.weight != null ? p.weight : 1,
                      level: p.level != null ? p.level : 1,
                    });
                  });
                }
              });
            });


            const payload = {
              nIdCampaign: 0,
              sNameCampaign: this.form.get("name").value,
              nYear: Number(year),
              nMonth: Number(month),
              sStartDate: _moment(this.form.get("dateInit").value).format(
                "DD/MM/YYYY"
              ),
              sEndDate: _moment(this.form.get("dateEnd").value).format(
                "DD/MM/YYYY"
              ),
              lstAssignProficiencies: array,
            };

            this._service.saveCampaign(payload).subscribe((resp) => {
              this._router.navigate(["humanmanagement/bell"], {
                skipLocationChange: true
              });
            });
          }
          this.cdr.markForCheck();
        });
    }
  }

  addmof(): void {
    const idposition: number = Number(this.chargerFC.value);
    const indexposition = this.listMof.findIndex(
      (e) => e.idCharge === idposition
    );
    if (indexposition > -1) {
      this.snack.open("Posicion seleccionada ya existente", "OK", {
        duration: 4000,
      });
    } else {
      const payload = {
        CompanyId: Number(this.bussineFC.value),
        AreaId: Number(this.areaFC.value)
      }
      this._service.getListMof(payload).subscribe((resp) => {
        const listMof: Mof[] = resp;
        const mof = listMof.find((e) => e.idCharge === idposition);
        this.listMof.push(mof);
        this.dataSource.data = null;
        this.dataSource.data = this.listMof;
      });
    }
  }

  // Seleccionar Uno a Uno
  assignOne() {
    if (this.selPositionsAvaliables.length == 0) {
      this.snack.open("No hay registros seleccionados", "OK", {
        duration: 4000,
      });
      return;
    }

    // Verifica si ya ha sido agregado
    this.selPositionsAvaliables.forEach((element) => {
      let found = this.listPositionsAssigned.find(
        (e) => e.idCharge == element.idCharge && e.idCompany == element.idCompany
      );
      if (found === undefined) {
        this.listPositionsAssigned.push(element);

      } else {
      
      }

    });

  }
  assignAll() {
    if (this.listPositionsAvailables.length == 0) {
      this.snack.open("No hay registros", "OK", {
        duration: 4000,
      });
      return;
    }
    this.listPositionsAvailables.forEach((element) => {
      this.listPositionsAssigned.push(element);
    });

    this.listPositionsAvailables = [];
    this.selPositionsAvaliables = [];
  }
  deleteOne() {
    if (this.selPositionsAssigned.length == 0) {
      this.snack.open("No hay registros seleccionados", "OK", {
        duration: 4000,
      });
      return;
    }
    this.listPositionsAssigned = this.listPositionsAssigned.filter(
      (value) => !this.selPositionsAssigned.includes(value)
    );

    this.selPositionsAssigned = [];
    this.ListproficienciesAssigned = [];
  }
  deleteAll() {
    if (this.listPositionsAssigned.length == 0) {
      this.snack.open("No hay registros", "OK", {
        duration: 4000,
      });
      return;
    }
    this.listPositionsAssigned.forEach((element) => {
      this.listPositionsAvailables.push(element);
    });

    this.listPositionsAssigned = [];
    this.selPositionsAssigned = [];
    this.ListproficienciesAssigned = [];
  }
  onchangeAssigned(objectselected) {
    this.ListproficienciesAvailables = [];
    this.selproficienciesAvailables = [];

    if (this.selPositionsAssigned.length > 1) {
      this.ListproficienciesAssigned = [];

      this.proficiencys.forEach((element) => {
        this.ListproficienciesAvailables.push({
          code: element.code,
          description: element.description,
          weight: 1,
          level: 1,
        });
      });

      return;
    }
    if (this.selPositionsAssigned.length == 0) {
      this.ListproficienciesAvailables = [];
      this.selproficienciesAvailables = [];
      this.selproficienciesAssigned = [];
      this.ListproficienciesAssigned = [];
      return;
    }

    this.ListproficienciesAssigned = this.selPositionsAssigned[0].proficiencies;

    this.proficiencys.forEach((element) => {
      let found = this.ListproficienciesAssigned.find(
        (e) => e.code == element.code
      );
      if (found === undefined) {
        this.ListproficienciesAvailables.push({
          code: element.code,
          description: element.description,
          weight: 1,
          level: 1,
        });
      }
    });
  }

  assignOneProficiency() {

    if (this.selproficienciesAvailables.length == 0) {
      this.snack.open("No hay registros seleccionados", "OK", {
        duration: 4000,
      });
      return;
    }
    this.selproficienciesAvailables.forEach((element) => {
      this.ListproficienciesAssigned.push(element);
    });

    this.ListproficienciesAvailables = this.ListproficienciesAvailables.filter(
      (value) => !this.selproficienciesAvailables.includes(value)
    );

    this.selproficienciesAvailables = [];
    this.updatelocalproficiencies();
  }

  updatelocalproficiencies() {
    this.selPositionsAssigned.forEach((element) => {
      element.proficiencies = this.ListproficienciesAssigned;
    });

    this.listPositionsAssigned.forEach((element) => {
      let found = this.selPositionsAssigned.find(
        (e) => e.idCharge == element.idCharge
      );
      if (found !== undefined) {
        element.proficiencies = this.ListproficienciesAssigned;
      }
    });
  }

  assignAllProficiencies() {
    if (this.ListproficienciesAvailables.length == 0) {
      this.snack.open("No hay registros", "OK", {
        duration: 4000,
      });
      return;
    }
    this.ListproficienciesAvailables.forEach((element) => {
      this.ListproficienciesAssigned.push(element);
    });

    this.ListproficienciesAvailables = [];
    this.selproficienciesAvailables = [];

    this.updatelocalproficiencies();
  }
  deleteAllProficiencies() {
    if (this.ListproficienciesAssigned.length == 0) {
      this.snack.open("No hay registros", "OK", {
        duration: 4000,
      });
      return;
    }

    let listPermanente: any[] = [];
    this.ListproficienciesAssigned.forEach((element) => {
      if (element.code === 1 || element.code === 2 || element.code === 3) {
        listPermanente.push(element);
      } else {
        this.ListproficienciesAvailables.push(element);
      }
    });
    this.ListproficienciesAssigned = [];
    this.selproficienciesAssigned = [];
    listPermanente.map(p => {
      this.ListproficienciesAssigned.push(p);
    })

    this.updatelocalproficiencies();
  }
  deleteOneProficiency() {
    if (this.selproficienciesAssigned.length == 0) {
      this.snack.open("No hay registros seleccionados", "OK", {
        duration: 4000,
      });
      return;
    }
    let constante: boolean = false;
    this.selproficienciesAssigned.forEach((e) => {

      if (e.code === 1 || e.code === 2 || e.code === 3) {
        constante = true;
      } else {
        this.ListproficienciesAvailables.push(e);
      }


    })

    const listRestore: any[] = []

    this.selproficienciesAssigned.map((e, i) => {
      this.ListproficienciesAssigned.map((v, index) => {
        if (e.code === v.code) {
          if (e.code === 1 || e.code === 2 || e.code === 3) {

          } else {
            this.ListproficienciesAssigned.splice(index, 1)
          }
        }
      })
    })

    if (constante) {
      this.snack.open("Las competencias ADAPTACIÓN AL CAMBIO, ORIENTACIÓN AL SERVICIO Y TRABAJO EN EQUIPO son siempre obligatorias ", "OK", {
        duration: 4000,
      });
    }

    this.updatelocalproficiencies();
  }

  // Obtiene el listado de Competencias con la descripcion de los 4 niveles
  getListCompetencies(): void {

    this._service.getListCompentences().subscribe((resp) => {
      console.log("🚀 ~ AddCampaignComponent ~ this._service.getListCompentences ~ resp:", resp)
      this.competencies = resp.data;
      this.BASE_competencies = resp.data;
    },
      (err) => { },
      () => {

        this.CompetenciasDTO = new MatTableDataSource<any>(this.competencies);

      }

    );
  }

  clickCompetence($event, _id: number) {
    let index = this.competencies.findIndex(res => res.idCompetence == _id);
    if ($event.checked) {
      this.competencies[index].nidSelected = 1;
      this.competencies[index].idLevel = 1;
    } else {
      this.competencies[index].nidSelected = 0;
      this.competencies[index].idLevel = 0;
    }

  }

  checkCompetencia(row: any, value: number) {
    if(this.selPositionsAssigned.length==0){
      this.competencies= [];
      this.BASE_competencies.forEach(com_base => {
        this.competencies.push(Object.assign({}, com_base));
  
      });
      this.CompetenciasDTO = new MatTableDataSource<any>(this.competencies);
      this.snack.open("ERROR: Primero debe seleccionar un Cargo.", "OK", {
        duration: 4000,
      });
      return ;
    }

    let index = this.competencies.findIndex(res => res.idCompetence == row.idCompetence);

    if (row.idLevel === value) {
      this.competencies[index].nidSelected = 5;
      this.competencies[index].idLevel = 0;

      const idxSelect = this.selPositionsAssigned.proficiencies.findIndex(e => e.code == row.idCompetence)
      this.selPositionsAssigned.proficiencies.splice(idxSelect, 1);
      this.changeSelectedPositions();

    } else {
      this.competencies[index].nidSelected = 0;
      this.competencies[index].idLevel = value;

      let found = this.selPositionsAssigned.proficiencies.find(
        (f) => f.code == row.idCompetence
      );

      if (found === undefined) {
        this.selPositionsAssigned.proficiencies.push({
          code: row.idCompetence,
          description: row.nameCompetence,
          weight: 1,
          level: value,
          isConfigured: false
        })

      } else {
        const idxSelect = this.selPositionsAssigned.proficiencies.findIndex(e => e.code == found.code)
        this.selPositionsAssigned.proficiencies.splice(idxSelect, 1);
        this.selPositionsAssigned.proficiencies.push({
          code: row.idCompetence,
          description: row.nameCompetence,
          weight: 1,
          level: value
        })

      }

    }

  }

  flagSelectAll = false;
  selectToggleFlag = false;

  toggleSelectAllCargos() {
    this.selectToggleFlag = !this.selectToggleFlag;
    this.flagSelectAll = this.selectToggleFlag;
    if (this.flagSelectAll) {
      this.selectAllCharges();

    } else {
      this.deselectAllCharges();
    }

  }

  selectAllCharges() {
    // Verificar si ya existe, sino lo agrega
    this.listPositionsAvailables.forEach((element) => {
      let found = this.listPositionsAssigned.find(
        (e) => e.idCharge == element.idCharge && e.idCompany == element.idCompany
      );
      if (found === undefined) {
        this.listPositionsAssigned.push(element);

      } else {
      }
      element.isSelected = true;
    });
  }

  deselectAllCharges() {
    this.listPositionsAvailables.forEach((element) => {
      let found = this.listPositionsAssigned.find(
        (e) => e.idCharge == element.idCharge && e.idCompany == element.idCompany
      );
      if (found === undefined) {
      } else {
        const idxSelect = this.listPositionsAssigned.findIndex(e => e.idCharge == found.idCharge && e.idCompany == found.idCompany)
        this.listPositionsAssigned.splice(idxSelect, 1);

      }
      element.isSelected = false;
    });
  }

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.CompetenciasDTO.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  eventSelectedTab($event) {
    if ($event.index == 1) {
      this.assignOne();
    }
  }

  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC.value)

    }
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }

  changeGerencia(): void {
    this.loadAreas();

    this.areaFC.setValue('');
    this.subAreaFC.setValue('');

    this.disabledArea = false;
    this.disabledSubArea = true;
  }

  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas = res.data;
    });

  }

  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
  }

  loadSubAreas() {
    const payload = {
      IdArea: Number(this.areaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.subAreas = res.data;
      if (this.subAreas.length == 0) {
        this.disabledSubArea = true;
      }
      else {
        this.disabledSubArea = false;
      }

    });

  }

  onChange($event) {
    if ($event.options[0]._selected) {
      this.assignOne();
    } else {
      if (this.listPositionsAssigned.length > 0) {
        let idcargo = $event.options[0]._value.idCharge;
        let idcompania = $event.options[0]._value.idCompany;
        const idxSelect = this.listPositionsAssigned.findIndex(e => e.idCharge == idcargo && e.idCompany == idcompania)
        this.listPositionsAssigned.splice(idxSelect, 1);
      }
    }

  }

  changeSelectedPositions() {
    this.competencies = [];
    this.BASE_competencies.forEach(com_base => {
      this.competencies.push(Object.assign({}, com_base));

    });

    this.competencies.forEach((com) => {
      let found = this.selPositionsAssigned.proficiencies.find(
        (f) => f.code == com.idCompetence
      );
      if (found === undefined) {
      } else {
        com.idLevel = found.level;
        com.isConfigured = found.isConfigured;
      }
    });

    this.CompetenciasDTO = new MatTableDataSource<any>(this.competencies);


  }

} 
