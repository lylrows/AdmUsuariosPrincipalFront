import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Areas } from "@app/data/schema/areas";
import { FilterCargo } from "@app/data/schema/cargo";
import { Empresa, ICompanyList } from "@app/data/schema/empresa";
import { EcoCondition } from "@app/data/schema/salaryband/EcoCondition";
import { IEcoConditionExport, SALARY_BAND_HEADER_EXPORT } from "@app/data/schema/salaryband/EcoConditionExport";
import { EcoConditionQueryFilter } from "@app/data/schema/salaryband/EcoConditionQueryFilter";
import { AreaService } from "@app/data/service/areas.service";
import { CargoService } from "@app/data/service/cargo.service";
import { EmployeeService } from "@app/data/service/employee.service";
import { SalaryBandService } from "@app/data/service/salaryband.service";
import { SBEcoCondExportService } from "@app/data/service/salayband/sbecoconditionexport.service";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";

@Component({
  selector: "app-economic-condition",
  templateUrl: "./economic-condition.component.html",
  styleUrls: ["./economic-condition.component.scss"],
})
export class EconomicConditionComponent implements OnInit {
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;

  private headerExport: IEcoConditionExport[];
  constructor(
    private _salaryBandService: SalaryBandService,
    private _serviceEmployee: EmployeeService,
    private areaService: AreaService,
    private snack: MatSnackBar,
    public confirmService: AppConfirmService,
    public cargoService: CargoService,
    public  exportService:SBEcoCondExportService,
    private dialog: MatDialog
  ) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 600){
      this.responsive = true; 
    }
    this.headerExport = SALARY_BAND_HEADER_EXPORT;
  }

  title = "Elaboración de Presupuesto";

  Filter = <EcoConditionQueryFilter>{
    IdArea: 0,
    IdCompany: 0,
    Period: 0,
    IdCargo:0, 
    Month:1
  };
  listdata = [];  
  isSelectedRow=[];

  areas: any[] = [];
  cargos:any[]=[];
  companies: ICompanyList[] = [];
  currentPeriod = 0;
  previousPeriod = 0;
  monthPeriod = 1;
  cargoFilter=<FilterCargo>{
    idArea:0,
    idEmpresa:0,
    nombreCargo:''
  }
  

  listmonth = [
    { code: 1, name: "Enero" },
    { code: 2, name: "Febrero" },
    { code: 3, name: "Marzo" },
    { code: 4, name: "Abril" },
    { code: 5, name: "Mayo" },
    { code: 6, name: "Junio" },
    { code: 7, name: "Julio" },
    { code: 8, name: "Agosto" },
    { code: 9, name: "Setiembre" },
    { code: 10, name: "Octubre" },
    { code: 11, name: "Noviembre" },
    { code: 12, name: "Diciembre" },
  ];

  gerencias: Areas[];
  
  subAreas: Areas[];
  subAreaFC='';
  
  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;
  areaFC = '';
  gerenciaFC='';
  public empresas: Empresa[];
  bussineFC = '';
  areascc=[];
  areaCCFC='';
  titletab ='Elaboración de Presupuesto';
  responsive = false;
  screenWidth: number;


  ngOnInit(): void {
      
    this.Filter.Period = new Date().getFullYear()+1;

    this.getListCompany();
    this.Filter.IdCompany = 1;
    
    this.getCargos();

    this.loadEmpresas();
    // this.getList();
  }

  getList(): void {
    
    this.Filter.IdCargo= parseInt(this.Filter.IdCargo.toString());

    this.Filter.IdCompany= Number(this.bussineFC);
    this.Filter.IdGerencia= Number(this.gerenciaFC);

    this.Filter.IdArea= Number(this.areaFC);
    this.Filter.IdSubArea= Number(this.subAreaFC);
    this.Filter.AreaCC= this.areaCCFC;
    let title ="Elaboración de Presupuesto "  + this.listmonth.filter(i=>i.code=== this.Filter.Month)[0].name  + " - "+ this.Filter.Period;
    this.titletab = title;
    this._salaryBandService
      .getEcoConditionList(this.Filter)
      .subscribe((resp) => {
        this.currentPeriod = this.Filter.Period;
        this.previousPeriod = this.Filter.Period - 1;
        this.monthPeriod =  this.Filter.Month;
        this.listdata = resp.data;
      });

      if (this.responsive){
        this.dialog.open(this.DetailDialog,{
          width: '100%',
          maxWidth: '100hv'
        });
      }     
  }
  resetFilter() {
    

    
    this.Filter.IdCompany= 1;
    this.Filter.Period = new Date().getFullYear()+1;
    this.Filter.IdCargo=0;
    this.Filter.ChargeName='';

    
    
    this.Filter.IdGerencia= 0;

    this.Filter.IdArea= 0;
    this.Filter.IdSubArea= 0;

    this.bussineFC ='';
    this.gerenciaFC='';
    this.areaFC='';
    this.subAreaFC='';

    this.disabledGerencia = true;
    this.disabledArea = true;
    this.disabledSubArea = true;

    this.areascc=[];
    this.areaCCFC='';


  }

  getListCompany(): void {
    this._serviceEmployee
      .getListCompany()
      .subscribe((resp) => {
          this.companies = resp
          this.Filter.IdCompany=1;
          this.getAreas();
        });
  }
  getAreas(): void {
    this.areaService.getByCompany(this.Filter.IdCompany).subscribe((resp) => {
      
      this.areas = resp.data;
      this.Filter.IdArea =  0;
      this.getCargos();
    });
  }
  
  getCargos():void{
    
    this.cargoFilter.idArea= parseInt(this.Filter.IdArea.toString()) ;
    this.cargoFilter.idEmpresa = this.Filter.IdCompany;

    this.cargoService.getComboCargo(this.cargoFilter).subscribe((resp) => {
      this.Filter.IdCargo =  0;
      this.cargos = resp.data;
    });

  }



  changecompany() {
    this.getAreas();
  }
  
  onCalculate(item: EcoCondition, typeincrement: number) {
    
 
    if (item.increase.toString() === "") {
      item.increase = 0;
    }
    if (item.increasePassive.toString() === "") {
      item.increasePassive = 0;
    }

    

    let incrementType = "";
    if (typeincrement == 1) {
      incrementType = "incremento en los ingresos";
      
      if (item.increase === item.increase_ant){
        return;
      }


    } else {
      incrementType = "incremento en los pasivos";

      if (item.increasePassive === item.increasePassive_ant){
        return;
      }


    }



    
      this.confirmService
        .confirm({
          message: `Se está realizando un ${incrementType}, ¿desea continuar ?.`,
        })
        .subscribe((res) => {
          if (res) {
            let basicmonth = item.basicMonth; // Y6
            let increase = parseFloat(item.increase.toString()); // Z6
            let otherFixedMonth = item.otherFixedMonth; // AA6
            let variableMonth = item.variableMonth; // AB6
            let passive = item.passive; // AC6
            let increasePassive = parseFloat(item.increasePassive.toString()); // AD6
            let otherUnpaid = item.otherUnpaid; // AE6
            let monthlyIncome = item.monthlyIncome; // AF6
            let annualCost = item.annualCost; // AH6
            let annualBonus = item.annualBonus; // AG6
            let prevAnnualCost = item.prevAnnualCost; // U6

            item.increase = increase;
            item.increasePassive = increasePassive;

            monthlyIncome =
              basicmonth +
              increase +
              otherFixedMonth +
              variableMonth +
              passive +
              increasePassive +
              otherUnpaid;

            item.monthlyIncome = monthlyIncome;

            annualCost =
              (basicmonth + increase + otherFixedMonth + variableMonth) *
                1.46 *
                12 +
              (passive + increasePassive) * 1 * 12 +
              otherUnpaid * 1 * 11 +
              annualBonus * 1.2 * 1;

            item.annualCost = annualCost;

            /* Calcular Variacion ingreso mes */
            let prevMonthlyIncome = item.prevMonthlyIncome; // S6
            let variationMontlyIncome = item.variationMontlyIncome; //  W6

            variationMontlyIncome =(monthlyIncome / prevMonthlyIncome - 1) * 100;
            if(variationMontlyIncome==Infinity){
              variationMontlyIncome=0;
            }
            item.variationMontlyIncome = variationMontlyIncome;

            /* Calcular Variacion costo anual */

            let variationAnnualCost = item.variationAnnualCost;

            variationAnnualCost = (annualCost / prevAnnualCost - 1) * 100;
            if(variationAnnualCost==Infinity){
              variationAnnualCost=0;
            }
            item.variationAnnualCost = variationAnnualCost;

            
            if (typeincrement == 1) {
              item.increase_ant = item.increase;
            } else {
              item.increasePassive_ant = item.increasePassive
            }



          } else {
            if (typeincrement == 1) {
              item.increase = item.increase_ant;
            } else {
              item.increasePassive = item.increasePassive_ant;
            }

            return;
          }
        });
    //}
  }

  save() {
    

    let payload = {
      currentPeriod: this.currentPeriod,
      previousPeriod: this.previousPeriod,
      monthPeriod: this.monthPeriod,
      conditions: this.listdata,
    };

    this._salaryBandService.saveEconomicCondition(payload).subscribe(
      (data) => {
        if (data !== null && data !== undefined) {
          if (data.stateCode !== 200) {
            this.snack.open(data.messageError[0], "OK", { duration: 4000 });

            return;
          }

          this.snack.open(data.messageError[0], "OK", { duration: 4000 });
          this.getList();
          //this.dialogRef.close();
        } else {
          this.snack.open("Ocurrió un error", "OK", { duration: 4000 });
        }
      },
      (err) => {
        this.snack.open(err.message, "OK", { duration: 4000 });
      }
    );
  }

  getVariationclass(amountvar){


        if ( amountvar=== null  || amountvar ===0 ){
          return 'semaforovar0'
        }
        if ( amountvar>0 && amountvar <= 30){
          return 'semaforovar1'
        }
        if ( amountvar>30 && amountvar <= 50){
          return 'semaforovar2'
        }
        if ( amountvar>50 ){
          return 'semaforovar3'
        }
        return 'semaforovar0'
  }
  printXls(){
    this.Filter.IdArea = parseInt(this.Filter.IdArea.toString());
    this.Filter.IdCargo= parseInt(this.Filter.IdCargo.toString());



    this._salaryBandService.getEcoConditionExportXls(this.Filter).subscribe((resp) => {
      

       let title ="Elaboración de Presupuesto "  + this.listmonth.filter(i=>i.code=== this.Filter.Month)[0].name  + " - "+ this.Filter.Period;

      this.exportService.export(this.headerExport, 'Reporte Elaboracion de Presupuesto', 'Listado', resp.data,this.Filter.Period,title);

    });
  }

  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  selectedRow(row){
    this.isSelectedRow=row;

  }

  changeGerencia(): void {
    this.loadAreas();

    this.areaFC='';
    this.subAreaFC='';
    this.areaCCFC ='';

    this.disabledArea = false;
    this.disabledSubArea = true;
  }

  loadAreas() {
    const payload = {
      IdArea: Number(this.gerenciaFC)

    }
    
    this._salaryBandService.getareaccbygerencia(Number(this.gerenciaFC)).subscribe((res) => {
      
      this.areascc = res.data;
    });


  }

  changeEmpresa(): void {
    

    this.loadGerencia();
    this.disabledGerencia = false;

    this.gerenciaFC='';
    this.areaFC='';
    this.subAreaFC='';
    this.disabledGerencia = false;
    this.disabledArea = true;
    this.disabledSubArea = true;
    this.areaCCFC='';
    
  }

  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC)

    }
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }
  
  loadEmpresas() {
    
    let idUser = 0; 
    const payload = {
      IdUser: idUser

    }
    this.areaService.getCompanyByUser(payload).subscribe((res) => {
      this.empresas = res.data;
    });

  }
  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
  }
  loadSubAreas() {
    const payload = {
      IdArea: Number(this.areaFC)

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
  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }



}
