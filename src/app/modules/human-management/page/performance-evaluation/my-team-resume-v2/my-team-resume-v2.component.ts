import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Areas } from "@app/data/schema/areas";
import { Empresa } from "@app/data/schema/empresa";
import { AreaService } from "@app/data/service/areas.service";
import { EmpresaService } from "@app/data/service/empresa.service";
import { PerformanceService } from "@app/data/service/performance.service";
import { EChartsOption } from "echarts";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_FORMATS } from "@angular/material/core";
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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from "@env";

@Component({
  selector: 'app-my-team-resume-v2',
  templateUrl: './my-team-resume-v2.component.html',
  styleUrls: ['./my-team-resume-v2.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class MyTeamResumeV2Component implements OnInit {
  @ViewChild("DetailDialog") DetailDialog: TemplateRef<any>;
  responsive = false;
  screenWidth: number;

  objectDT: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = ["rowNum","semployeename", "campaign", "inicio", "verificacion","evaluacion"];


  isTableExpanded=false;

  mostrarGraficoIndividual=false;
  _indicador:any;
  _legends:any;
  _compdata_initial:any;
  _compdata_verification:any;
  _compdata_evaluation:any;
  _compdata_evaluation_individual:any;
  _legends_tabla:any;
  _my_team_resume_tabla:any;
  BASE_my_team_resume_tabla:any;
  BASE_compdata_evaluation_individual:any
  _filterGraficoSpider:any;

  NOT_ASSIGNED_COMPETENCIES=false;

  constructor(
    private empresaService: EmpresaService,
    private _performanceService: PerformanceService,
    private areaService: AreaService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {
    const user = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.idprofileuser = user.nid_profile.toString();
    this.iduser = Number(user.id);
    this.nid_employee = Number(user.nid_employee);

    if (this.iduser === 744 || this.iduser === 7) {
      this.bUsuarioDobleEmpresa = true;
    } else {
      this.bUsuarioDobleEmpresa = false;
    }
  }
  idprofileuser: string = "0";
  iduser: number = 0;
  bUsuarioDobleEmpresa = false;

  conceptosFC = new FormControl("");
  campanaFC = new FormControl("");
  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  etapaFC = new FormControl("");
  subAreaFC = new FormControl("");
  cargoFC = new FormControl("");
  colaboradorFC = new FormControl("");
  empresas: Empresa[];
  lstcargo: any[] = [];
  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];
  listcampaign: any[] = [];

  disabledEmpresa: boolean = true;
  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  disabledCargo: boolean = true;
  _chartOptionComp: EChartsOption;
  _chartOptionIndividual: EChartsOption;
  _chartOptionObj: EChartsOption;
  _chartOptionObj_V2: EChartsOption;
  nid_position: number = 0;

  perfileseditores = ["1", "20", "21"];
  nid_employee: number = 0;

  // VALORES DE ETAPAS PARA EL GRAFICO
  INICIO = "3";
  VERIFICACION = "7";
  EVALUACION = "11";

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600) {
      this.responsive = true;
    }
    // this.getListCampanias();
    this.loadEmpresas();
    if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
      this.disabledEmpresa = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;
      this.disabledGerencia = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;
      if (this.bUsuarioDobleEmpresa === true) {
        this.disabledEmpresa = false;
        this.disabledGerencia = false;
      }
      this.getCampaingByUser();
    } else {
      this.disabledEmpresa = false;
      this.disabledGerencia = false;
      this.getListCampanias();
    }
    this.websiteMultiCtrl.setValue(this.lstcargo[1]);
    this.filteredWebsitesMulti.next(this.lstcargo.slice());
    this.websiteMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterWebsiteMulti();
      });
    // Campañas
    this.campanasMultiCtrl.setValue(this.listcampaign[1]);
    this.filteredCampanasMulti.next(this.listcampaign.slice());
    this.campanasMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCampanasMulti();
      });
  }

  loadEmpresas() {
    this.empresaService.getCompanybyUser().subscribe((res) => {
      this.empresas = res;
      console.log("🚀 ~ MyTeamResumeV2Component ~ this.empresaService.getCompanybyUser ~ res:", res)
      if (this.empresas.length > 0) {
        if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
          if (this.bUsuarioDobleEmpresa !== true) {
            this.disabledEmpresa = this.disabledEmpresa = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;;
            this.disabledGerencia = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;
            this.bussineFC.setValue(this.empresas[0].id);
            this.changeEmpresa();
          }
        }
      }
    });
  }
  changeSubArea(): void {
    this.getChargesByCompanyArea();
  }
  getChargesByCompanyArea() {
    /* TODO */

    let arraystring = "";
    if (this.areaFC.value != null && this.areaFC.value != []) {
      const value = this.areaFC.value;

      value.map((e) => {
        arraystring = arraystring + e + ",";
      });

      arraystring = arraystring.substring(0, arraystring.length - 1);
    }

    let arraySubarea = "";
    if (this.subAreaFC.value != null && this.subAreaFC.value != []) {
      const value = this.subAreaFC.value;

      value.map((e) => {
        arraySubarea = arraySubarea + e + ",";
      });

      arraySubarea = arraySubarea.substring(0, arraySubarea.length - 1);
    }

    const payload = {
      nidcompany: Number(this.bussineFC.value),
      nidgerencia: Number(this.gerenciaFC.value),
      nidarea: arraystring,
      nidsubarea: arraySubarea,
    };

    this._performanceService.GetChargesByCompanyAreaMulti(payload).subscribe((res) => {
        this.lstcargo = res;
        this.websiteMultiCtrl.setValue([]);
        this.websiteMultiCtrl.setValue([this.lstcargo[1]]);
        this.filteredWebsitesMulti.next(this.lstcargo.slice());
        this.websiteMultiCtrl.setValue([]);

        this.websiteMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterWebsiteMulti();
          });
      });
  }
  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;

    this.getChargesByCompanyArea();
  }
  loadSubAreas() {
    let arraystring = "";
    if (this.areaFC.value != null && this.areaFC.value != []) {
      const value = this.areaFC.value;

      value.map((e) => {
        arraystring = arraystring + e + ",";
      });

      arraystring = arraystring.substring(0, arraystring.length - 1);
    }

    const payload = {
      IdArea: arraystring,
    };
    this.cargoFC.setValue("");
    this.areaService.getSubAreasByAreaMultiple(payload).subscribe((res) => {
      this.subAreas = res.data;
      if (this.subAreas.length == 0) {
        this.disabledSubArea = true;
      } else {
        this.disabledSubArea = false;
      }
    });
  }
  changeGerencia(): void {

    this.areaFC.setValue("");
    this.subAreaFC.setValue("");
    this.cargoFC.setValue("");

    this.disabledArea = false;
    this.disabledSubArea = true;

    this.loadAreas();
    this.getChargesByCompanyArea();
  }
  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC.value),
    };
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas = res.data;
    });
  }
  changeEmpresa(): void {
    this.disabledArea = false;
    this.disabledCargo = false;
    this.areas = [];
    this.areaFC.setValue("");
    this.subAreaFC.setValue("");
    this.cargoFC.setValue("");
    this.lstcargo = [];

    this.loadGerencia();
    this.disabledGerencia = false;

    if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {
      this.disabledEmpresa = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;
      this.disabledGerencia = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;

      if (this.bUsuarioDobleEmpresa === true) {
        this.disabledEmpresa = false;
        this.disabledGerencia = false;
      }
    } else {
      this.disabledEmpresa = false;
      this.disabledGerencia = false;
    }

    this.getChargesByCompanyArea();
  }

  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC.value),
    };
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;

      if (this.gerencias.length > 0) {
        this.gerenciaFC.setValue(this.gerencias[0].nid_area);
        this.changeGerencia();
      }
    });
  }

  changeCampania() {
    this.getConfigDetailLevelNineBoxByCampaign();
  }
  getConfigDetailLevelNineBoxByCampaign(): void {
    const payload = {
      nid_campaing: Number(this.campanaFC.value),
    };
  }

  private IndividualChartOptions(
    indicators,
    data,
    legends,
    compdata_initial,
    compdata_verification,
    compdata_evaluation
  ) {
    debugger;
    const value = this.etapaFC.value;
    console.log("🚀 ~ my-team-resume-v2.component.ts:354 ~ MyTeamResumeV2Component ~ value:", value)
    const option_grafico: any[] = [];
    if (value !== "") {
      value.map((e) => {
        option_grafico.push(e);
      });
    }

    // INICIO - TODOS LOS GRAFICOS  - DESPUES SIMPLIFICAR ESTE BLOQUE DE CODIGO
    if (!this.responsive) {
      this._chartOptionIndividual = {
        title: [
          {
            // text: "Evaluación",
            left: "50%",
            top: "10%",
            textAlign: "center",
          },

        ],
        legend: {
          data: legends,
          type: "scroll",
          pageButtonItemGap: 20,
        },
        radar: [
          {
            indicator: indicators,
            center: ["50%", "50%"],
            radius: 100,
          },

        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "axis",
            },
            areaStyle: {},
            data:compdata_evaluation
          },

        ],
      };
    }else{
      this._chartOptionIndividual = {
        title: [
          {
            // text: "Evaluación",
            left: "50%",
            top: "10%",
            textAlign: "center",
          },

        ],
        legend: {
          data: legends,
          type: "scroll",
          pageButtonItemGap: 20,
        },
        radar: [
          {
            indicator: indicators,
            center: ["50%", "50%"],
            radius: 100,
            axisNameGap:5
          },

        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "axis",
            },
            areaStyle: {},
            data:compdata_evaluation
          },

        ],
      };
    }


  }

  private CompetenciasChartOptions(
    indicators,
    data,
    legends,
    compdata_initial,
    compdata_verification,
    compdata_evaluation
  ) {
    debugger;
    const value = this.etapaFC.value;
    console.log(
      "🚀 ~ MyTeamResumeComponent ~ ShowCompetencias ~ value:",
      value
    );
    const option_grafico: any[] = [];
    if (value !== "") {
      value.map((e) => {
        option_grafico.push(e);
      });
    }

    // INICIO - TODOS LOS GRAFICOS  - DESPUES SIMPLIFICAR ESTE BLOQUE DE CODIGO
    if (option_grafico.length === 0 || option_grafico.length === 3) {
      this._chartOptionComp = {
        title: [
          {
            text: "Inicio",
            left: "50%",
            top: "4%",
            textAlign: "center",
          },
          {
            text: "Verificación",
            left: "50%",
            top: "36%",
            textAlign: "center",
          },
          {
            text: "Evaluación",
            left: "50%",
            top: "68%",
            textAlign: "center",
          },
        ],
        legend: {
          data: legends,
          type: "scroll",
          pageButtonItemGap: 20,
        },
        radar: [
          {
            indicator: indicators,
            center: ["50%", "21%"],
            radius: 100,
          },
          {
            indicator: indicators,
            radius: 100,
            center: ["50%", "53%"],
          },
          {
            indicator: indicators,
            center: ["50%", "85%"],
            radius: 100,
          },
        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "axis",
            },
            areaStyle: {},
            data: compdata_initial,
          },
          {
            type: "radar",
            radarIndex: 1,
            areaStyle: {},
            data: compdata_verification,
          },
          {
            type: "radar",
            radarIndex: 2,
            areaStyle: {},
            data: compdata_evaluation,
          },
        ],
      };

    } else {
      if (option_grafico.length === 1) {
        // INICIO
        if (option_grafico.includes(this.INICIO)) {
          this._chartOptionComp = {
            title: [
              {
                text: "Inicio",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_initial,
              },
            ],
          };

          return;
        }

        // VERIFICACION
        if (option_grafico.includes(this.VERIFICACION)) {
          this._chartOptionComp = {
            title: [
              {
                text: "Verificación",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_verification,
              },
            ],
          };
          return;
        }
        // EVALUACION
        if (option_grafico.includes(this.EVALUACION)) {
          this._chartOptionComp = {
            title: [
              {
                text: "Evaluación",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_evaluation,
              },
            ],
          };
          return;
        }


      }
      if (option_grafico.length === 2) {
        // INICIO  - VERIFICACION
        if (
          option_grafico.includes(this.INICIO) &&
          option_grafico.includes(this.VERIFICACION)
        ) {
          this._chartOptionComp = {
            title: [
              {
                text: "Inicio",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
              {
                text: "Verificación",
                left: "50%",
                top: "36%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
              {
                indicator: indicators,
                radius: 100,
                center: ["50%", "53%"],
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_initial,
              },
              {
                type: "radar",
                radarIndex: 1,
                areaStyle: {},
                data: compdata_verification,
              },
            ],
          };

          return;
        }

        // INICIO  - EVALUACION
        if (
          option_grafico.includes(this.INICIO) &&
          option_grafico.includes(this.EVALUACION)
        ) {
          this._chartOptionComp = {
            title: [
              {
                text: "Inicio",
                left: "50%",
                top: "4%",
                textAlign: "center",
              },
              {
                text: "Evaluación",
                left: "50%",
                top: "36%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                center: ["50%", "21%"],
                radius: 100,
              },
              {
                indicator: indicators,
                center: ['50%', '53%'],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                tooltip: {
                  trigger: "axis",
                },
                areaStyle: {},
                data: compdata_initial,
              },
              {
                type: "radar",
                radarIndex: 1,
                areaStyle: {},
                data: compdata_evaluation,
              },
            ],
          };

          return;
        }

        // VERIFICACION  - EVALUACION
        if (
          option_grafico.includes(this.VERIFICACION) &&
          option_grafico.includes(this.EVALUACION)
        ) {
          this._chartOptionComp = {
            title: [
              {
                text: "Verificación",
                left: "50%",
                top: '4%',
                textAlign: "center",
              },
              {
                text: "Evaluación",
                left: "50%",
                top: "36%",
                textAlign: "center",
              },
            ],
            legend: {
              data: legends,
              type: "scroll",
              pageButtonItemGap: 20,
            },
            radar: [
              {
                indicator: indicators,
                radius: 100,
                center: ['50%', '21%'],
              },
              {
                indicator: indicators,
                center: ["50%", "53%"],
                radius: 100,
              },
            ],
            series: [
              {
                type: "radar",
                radarIndex: 0,
                areaStyle: {},
                data: compdata_verification,
              },
              {
                type: "radar",
                radarIndex: 1,
                areaStyle: {},
                data: compdata_evaluation,
              },
            ],
          };
          return;
        }
      }
    }

    // FIN - TODOS LOS GRAFICOS

    /*
    this._chartOptionComp= {
      title: [{
        text: 'Inicio',
        left: '50%',
        top: '4%',
        textAlign: 'center'
      },
      {
        text: 'Verificación',
        left: '50%',
        top: '36%',
        textAlign: 'center'
      },
      {
        text: 'Evaluación',
        left: '50%',
        top: '68%',
        textAlign: 'center'
      }],
      legend: {
        data: legends,
        type:'scroll',
        pageButtonItemGap:20

      },
      radar: [
        {
          indicator: indicators,
          center: ['50%', '21%'],
          radius: 100
        },
        {
          indicator: indicators,
          radius: 100,
          center: ['50%', '53%']
        },
        {
          indicator: indicators,
          center: ['50%', '85%'],
          radius: 100
        }
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'axis'
          },
          areaStyle: {},
          data: compdata_initial
        },
        {
          type: 'radar',
          radarIndex: 1,
          areaStyle: {},
          data: compdata_verification
        },
        {
          type: 'radar',
          radarIndex: 2,
          areaStyle: {},
           data: compdata_evaluation
        }
      ]
    };
    */
  }

  private ObjetivosChartOptions(legendsobj, categoriesobj, dataobj) {
    const seriesLabel = {
      show: true,
    };

    if (this.responsive) {
      this._chartOptionObj = {
        title: {
          text: "Objetivos",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        legend: {
          data: legendsobj,
          left: "2%",
          top: "5%",
          type: "scroll",
          pageButtonItemGap: 20,
        },
        grid: {
          bottom: "10%",
          top: "20%",
        },
        xAxis: {
          type: "value",
          name: "Resultado",
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: categoriesobj,
        },
        series: dataobj,
      };
    } else {
      this._chartOptionObj = {
        title: {
          text: "Objetivos",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        legend: {
          data: legendsobj,
          orient: "vertical",
          height: "600",
          width: "200",
          left: "2%",
          top: "5%",
          type: "scroll",
          pageButtonItemGap: 20,
        },
        grid: {
          left: 600,
        },
        xAxis: {
          type: "value",
          name: "Resultado",
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: categoriesobj,
        },
        series: dataobj,
      };
    }
  }

  ShowCompetencias() {
    this.screenWidth = window.innerWidth;
    this.responsive = false;
    if (this.screenWidth < 600) {
      this.responsive = true;
    }

    if (Number(this.gerenciaFC.value) === 0) {
      this.snack.open("Es necesario que seleccione una gerencia.", "OK", {
        duration: 4000,
      });
      return;
    }

    // GERENCIA
    // AREA
    let arraystring = "";
    if (this.areaFC.value != null && this.areaFC.value != []) {
      const value = this.areaFC.value;

      value.map((e) => {
        arraystring = arraystring + e + ",";
      });

      arraystring = arraystring.substring(0, arraystring.length - 1);
    }

    // SUBAREA
    let arraySubarea = "";
    if (this.subAreaFC.value != null && this.subAreaFC.value != []) {
      const value = this.subAreaFC.value;

      value.map((e) => {
        arraySubarea = arraySubarea + e + ",";
      });

      arraySubarea = arraySubarea.substring(0, arraySubarea.length - 1);
    }

    let arrayCargos = "";
    if (
      this.websiteMultiCtrl.value !== null &&
      this.websiteMultiCtrl.value != []
    ) {
      const value = this.websiteMultiCtrl.value;
      value.map((e) => {
        arrayCargos = arrayCargos + e.nid_charge + ",";
      });
    }

    // Campañas
    let arrayCampana = "";
    if (
      this.campanasMultiCtrl.value !== null &&
      this.campanasMultiCtrl.value != []
    ) {
      const value = this.campanasMultiCtrl.value;
      value.map((e) => {
        arrayCampana = arrayCampana + e.nid_campaign + ",";
      });
    }

    let arrayEtapas = "";
    if (this.etapaFC.value != null && this.etapaFC.value != []) {
      const value = this.etapaFC.value;
      value.map((e) => {
        arrayEtapas = arrayEtapas + e + ",";
      });
      console.log(
        "🚀 ~ MyTeamResumeComponent ~ ShowCompetencias ~ arrayEtapas:",
        arrayEtapas
      );

      arrayEtapas = arrayEtapas.substring(0, arrayEtapas.length - 1);
    }

    const payload = {
      nidCampana: arrayCampana, //Number(this.campanaFC.value),

      nidcargo: arrayCargos,

      companyid: Number(this.bussineFC.value),
      gerenciaid: Number(this.gerenciaFC.value),
      areaid: arraystring,
      subareaid: arraySubarea,
      etapas: arrayEtapas,
      nid_employee: this.disabledGerencia===true?this.nid_employee:0,
    };

    this._performanceService.GetMyTeamResumeCompV2(payload).subscribe((res) => {
     console.log("🚀 ~ MyTeamResumeV2Component ~ this._performanceService.GetMyTeamResumeCompV2 ~ res:", res)
      if (res.stateCode === 200) {
        this._indicador=res.data.indicator;
        this._legends=res.data.legends;
        this._compdata_initial=res.data.compdata_initial;
        this._compdata_verification=res.data.compdata_verification;
        this._compdata_evaluation=res.data.compdata_evaluation;


        this._legends_tabla=res.data.legends_tabla;
        this.BASE_my_team_resume_tabla=res.data.my_team_resume_list;
        // if (this.disabledGerencia===true) {
        //   this.BASE_my_team_resume_tabla=this.BASE_my_team_resume_tabla.filter(e=>e.nid_employee===this.nid_employee);
        // }
        this.BASE_compdata_evaluation_individual=res.data.compdata_evaluation_individual;

        this.ObjetivosChartOptionsV2(
          res.data.objlegend,
          res.data.objcategories,
          res.data.data_obj_comp
        );

        // this.objectDT = new MatTableDataSource(res.data.my_team_resume_list);
        this._my_team_resume_tabla= [];
        this.BASE_my_team_resume_tabla.forEach(com_base => {
          this._my_team_resume_tabla.push(Object.assign({}, com_base));

        });
        this.objectDT = new MatTableDataSource(this._my_team_resume_tabla);

        if (this.responsive) {
          this.dialog.open(this.DetailDialog, {
            width: "100%",
            maxWidth: "100hv",
          });
        }
      } else {
        this.snack.open("¡Ocurrió un error!", "ERROR", { duration: 4000 });
        return;
      }
    });
  }

  getListCampanias(): void {
    this._performanceService.GetCampaingByEvaluation().subscribe((resp) => {
      console.log(
        "🚀 ~ this._performanceService.GetCampaingByEvaluation ~ resp:",
        resp
      );
      this.listcampaign = resp.data;
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiCtrl.setValue([this.listcampaign[1]]);
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCampanasMulti();
      });
    });
  }

  getCampaingByUser() {
    const payload = {
      nidEmployee: this.nid_employee,
    };
    this._performanceService.getCampaingByUser(payload).subscribe((resp) => {
      console.log("🚀 ~ this._performanceService.getCampaingByUser ~ resp:",resp);
      this.listcampaign = resp.data;
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiCtrl.setValue([this.listcampaign[1]]);
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      this.campanasMultiCtrl.setValue([]);
      this.campanasMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCampanasMulti();
      });

    });
  }
  selectedTabValue(event) {
    if (event.index === 0) {
    } else if (event.index === 1) {
    }
  }
  resetFilter() {
    this.disabledArea = false;
    this.disabledCargo = false;
    this.areas = [];
    this.areaFC.setValue("");
    this.subAreaFC.setValue("");
    this.cargoFC.setValue("");
    this.lstcargo = [];
    this.websiteMultiCtrl.setValue("");
    this.campanasMultiCtrl.setValue("");
    this.gerenciaFC.setValue("");
    this.etapaFC.setValue("");

    if (this.perfileseditores.indexOf(this.idprofileuser) === -1) {

      if (this.bUsuarioDobleEmpresa !== true) {
        this.disabledEmpresa = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;
        this.disabledGerencia = this.iduser == environment.nnIdUserGerenteGeneral ? false : true;
        // this.getListCampanias();
        // this.loadEmpresas();
      }
      this.getCampaingByUser();
    } else {
      this.disabledEmpresa = false;
      this.disabledGerencia = false;
      this.getListCampanias();
    }
  }

  public websiteMultiCtrl: FormControl = new FormControl();
  public websiteMultiFilterCtrl: FormControl = new FormControl();
  public filteredWebsitesMulti: ReplaySubject<any> = new ReplaySubject(1);

  // Campañas
  public campanasMultiCtrl: FormControl = new FormControl();
  public campanasMultiFilterCtrl: FormControl = new FormControl();
  public filteredCampanasMulti: ReplaySubject<any> = new ReplaySubject(1);

  @ViewChild("multiSelect", { static: true }) multiSelect: MatSelect;
  @ViewChild("multiSelectCampana", { static: true }) multiSelectCampana: MatSelect;

  protected _onDestroy = new Subject();

  /**
   * Write code on Method
   *
   * method logical code
   */
  ngAfterViewInit() {
    this.setInitialValue();
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected setInitialValue() {
    this.filteredWebsitesMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: any, b: any) =>
          a && b && a.nid_charge === b.nid_charge;
      });

      this.filteredCampanasMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelectCampana.compareWith = (a: any, b: any) =>
          a && b && a.nid_campaign === b.nid_campaign;
      });
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected filterWebsiteMulti() {
    if (!this.lstcargo) {
      return;
    }

    let search = this.websiteMultiFilterCtrl.value;
    if (!search) {
      this.filteredWebsitesMulti.next(this.lstcargo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredWebsitesMulti.next(
      this.lstcargo.filter(
        (bank) => bank.snamecharge.toLowerCase().indexOf(search) > -1
      )
    );
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected filterCampanasMulti() {
    if (!this.listcampaign) {
      return;
    }

    let search = this.campanasMultiFilterCtrl.value;
    if (!search) {
      this.filteredCampanasMulti.next(this.listcampaign.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCampanasMulti.next(
      this.listcampaign.filter(
        (camp) => camp.snamecampaign.toLowerCase().indexOf(search) > -1
      )
    );
  }

  verGraficoIndividual(value:any){
    this.mostrarGraficoIndividual=true;
    debugger;
    // console.log("🚀 ~ MyTeamResumeV2Component ~ verGraficoIndividual ~ verGraficoIndividual:",value)
    let legends=[ value.semployeename]
    //this._my_team_resume_tabla

    this.IndividualChartOptions(this._indicador,
      "",
      // this._legends,
      legends,
      this._compdata_initial.filter(i=>i.name===value.semployeename),
      this._compdata_verification.filter(i=>i.name===value.semployeename),
      this._compdata_evaluation.filter(i=>i.name===value.semployeename));

  }
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.objectDT.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  verGrafico(row:any){
    console.log("🚀 ~ MyTeamResumeV2Component ~ verGrafico ~ row:", row)
    let estado=!row.isExpanded;
    let idnumero=row.rowNum;
  if(estado){ 
    this.mostrarGraficoIndividual=true;
    debugger;
    // Preguntar cuantos estan abiertos o desplegados
    let isOpenRowTable = this._my_team_resume_tabla.filter(f=>f.isExpanded===true);
    if(isOpenRowTable.length>0){
      let index = this._my_team_resume_tabla.findIndex(res => res.rowNum === idnumero);
      if(isOpenRowTable[0].rowNum===idnumero){
        this._my_team_resume_tabla[index].isExpanded = estado;
      }else{
        this._my_team_resume_tabla= [];
        this.BASE_my_team_resume_tabla.forEach(com_base => {
          this._my_team_resume_tabla.push(Object.assign({}, com_base));
        });
        this._my_team_resume_tabla[index].isExpanded = true;
      }
    }
    else{
      let index = this._my_team_resume_tabla.findIndex(res => res.rowNum === idnumero);
      this._my_team_resume_tabla[index].isExpanded = estado;
    }
 
    this.objectDT = new MatTableDataSource<any>(this._my_team_resume_tabla);

    // Verifica para mostrar el grafico
    this._compdata_evaluation_individual=[];
   let listcargo= this.BASE_compdata_evaluation_individual.filter(i=>i.nid_campaign===row.idCampaign && i.nid_charge===row.nid_charge && i.nnumberaction===0 );
   let listempleado= this.BASE_compdata_evaluation_individual.filter(i=>i.name===row.semployeename && i.nid_campaign===row.idCampaign &&i.nid_charge===row.nid_charge && i.nnumberaction===row.nnumberaction );

    listcargo.forEach(cargo => {
      this._compdata_evaluation_individual.push(Object.assign({}, cargo));
      // this._compdata_evaluation_individual.push(carg|o);
    })
   listempleado.forEach(empl => {
      this._compdata_evaluation_individual.push(Object.assign({}, empl));
    })
    let competencias = this._indicador.filter(i=>i.nid_campaign===row.idCampaign && i.nid_charge===row.nid_charge);
    let filtro_indicador=[];
    competencias.forEach(compe => {
      let item={
        name:compe.nameproficiency,
        max:5
      };
      filtro_indicador.push(item);

    })
    this.NOT_ASSIGNED_COMPETENCIES=false;
    if(filtro_indicador.length===0){
      this.NOT_ASSIGNED_COMPETENCIES=true;
    }

    this.IndividualChartOptions(//this._indicador.filter(i=>i.nid_campaign===row.idCampaign && i.nid_charge===row.nid_charge),
      filtro_indicador,
      "",
      this._legends_tabla,
      // legends,
      this._compdata_initial.filter(i=>i.name===row.semployeename  || i.nnumberaction===0 ),
      this._compdata_verification.filter(i=>i.name===row.semployeename || i.nnumberaction===0 ),
      // this._compdata_evaluation_individual.filter(i=>(i.name===row.semployeename && i.nid_campaign===row.idCampaign &&i.nid_charge===row.nid_charge )|| i.nid_charge===row.nid_charge)
      this._compdata_evaluation_individual
      );
    }
    else{
      let index = this._my_team_resume_tabla.findIndex(res => res.rowNum === idnumero);
      this._my_team_resume_tabla[index].isExpanded = estado;
    }
  }


  // CONSULTAR PARA EL GRAFICO
 /*
  private consultarGeafico(){
    const payload = {
      nidCampana: arrayCampana,

      nidcargo: arrayCargos,

      companyid: Number(this.bussineFC.value),
      gerenciaid: Number(this.gerenciaFC.value),
      areaid: arraystring,
      subareaid: arraySubarea,
      etapas: arrayEtapas,
    };

    this._performanceService.GetMyTeamResumeCompV2(payload).subscribe((res) => {
     console.log("🚀 ~ MyTeamResumeV2Component ~ this._performanceService.GetMyTeamResumeCompV2 ~ res:", res)
      if (res.stateCode === 200) {
        this._indicador=res.data.indicator;
        this._legends=res.data.legends;
        this._compdata_initial=res.data.compdata_initial;
        this._compdata_verification=res.data.compdata_verification;
        this._compdata_evaluation=res.data.compdata_evaluation;
        this._legends_tabla=res.data.legends_tabla;
        this.BASE_my_team_resume_tabla=res.data.my_team_resume_list;
        this.BASE_compdata_evaluation_individual=res.data.compdata_evaluation_individual;

        this.ObjetivosChartOptionsV2(
          res.data.objlegend,
          res.data.objcategories,
          res.data.data_obj_comp
        );

        this._my_team_resume_tabla= [];
        this.BASE_my_team_resume_tabla.forEach(com_base => {
          this._my_team_resume_tabla.push(Object.assign({}, com_base));

        });
        this.objectDT = new MatTableDataSource(this._my_team_resume_tabla);

        if (this.responsive) {
          this.dialog.open(this.DetailDialog, {
            width: "100%",
            maxWidth: "100hv",
          });
        }
      } else {
        this.snack.open("¡Ocurrió un error!", "ERROR", { duration: 4000 });
        return;
      }
    });
  }
*/


  private ObjetivosChartOptionsV2(legendsobj, categoriesobj, dataobj) {
    const seriesLabel = {
      show: true,
    };

    if (this.responsive) {
      this._chartOptionObj_V2 = {
        title: {
          text: "Resultados",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          show: false
        },

        legend: {
          data: legendsobj,
          left: "2%",
          top: "5%",
          type: "scroll",
          pageButtonItemGap: 20,
        },
        grid: {
          bottom: "10%",
          top: "20%",
          left: "30%",
          type: "scroll",
        },
        xAxis: {
          type: "value",
          name: "Resultado",
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: categoriesobj,
        },
        series: dataobj,
      };
    } else {
      this._chartOptionObj_V2 = {
        title: {
          text: "Resultados",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          show: false
        },

        legend: {
          data: legendsobj,
          orient: "vertical",
          height: "600",
          width: "200",
          left: "2%",
          top: "5%",
          type: "scroll",
          pageButtonItemGap: 20,
        },
        grid: {
          left: 600,
        },
        xAxis: {
          type: "value",
          name: "Resultado",
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: categoriesobj,
        },
        series: dataobj,
      };
    }
  }



}