import { RecruitMentPersonnelService } from "@app/data/service/recruitment-personnel.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { PostJobOfferService } from "@app/data/service/postjoboffer.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Empresa } from "@app/data/schema/empresa";
import { EmpresaService } from "@app/data/service/empresa.service";
import { AreaService } from "@app/data/service/areas.service";
import { MastertableService } from "@app/data/service/mastertable.service";
import { UtilService } from "@app/data/service/util.service";
import { MatTable, MatTableModule, MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";

import { JobInternalService } from "@app/data/service/jobs-internal.service";
import { CargoService } from "@app/data/service/cargo.service";


import Swal from "sweetalert2";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from "@app/modules/human-management/page/recruitment/recruitment-detail/dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-crud-postjoboffer",
  templateUrl: "crud-postjoboffer.component.html",
  styleUrls: ["crud-postjoboffer.component.scss"],
})
export class CrudPostJobOfferComponent implements OnInit {
  idRequest: number;
  public itemForm: FormGroup;
  public empresas: Empresa[];
  public sGradoAcademico:string = "";
  lstAreas: any[];
  lstJobType: any[] = [];
  lstJoblevel: any[] = [];
  lstWorkType: any[] = [];
  lstWorkTypeNew: any[] = [];
  lstDepartament: any[] = [];
  lstProvince: any[] = [];
  lstDistrict: any[] = [];
  lstGender: any[] = [];
  lstEducationLevel: any[] = [];
  lstEducationLevelSituation: any[] = [];
  lstIdiom: any[] = [];
  lstIdiomLevel: any[] = [];
  lstJobIdiom: any[] = [];
  lstkeyword: any[] = [];
  idiomSelected: any;
  lstEducationGrado: any;
  idiomLevelSelected: any;
  displayedColumns: string[] = ["delete", "idiom", "idiomLevel"];
  displayedColumnsKeywork: string[] = ["delete", "keyWord"];
  @ViewChild(MatTable) tablelang: MatTable<any>;
  @ViewChild('tablekeyword') tablekeyword: MatTable<any>;
  type: number;
  request: any;
  competencias: any[] = [];
  textoCompetencias: string = '';
  textoRequerimiento: string = '';
  textoBeneficios: string = '';
  textoFunciones: string = '';
  editorOptions= {
    toolbar: [
      [{ 'list': 'bullet' }],
      [ 'bold', 'italic', 'underline'],
    ],
  };

  displayedColumnsLanguages:string[]=[
    "idioma",
    "nivel",
    "acciones"
  ]
  idioma:any={};
  lstIdiomas:Array<any>=[];
  LanguagesDT: MatTableDataSource<any> = new MatTableDataSource([]);
  GradosDT: MatTableDataSource<any> = new MatTableDataSource([]);
  lstEducationGradoAcademico: any[] = [];
  displayedColumnsGrado:string[]=[
    "grado",
    "carrera",
    "nivel",
    "acciones"
  ];

  pregrado:any={};
  lstPregrado:Array<any>=[];
  postgrado:any={};
  lstPostgrado:Array<any>=[];
  lstGeneral:Array<any>=[];
  gradoSelected:any;
  jobExistente: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private postJobOfferService: PostJobOfferService,
    private empresaService: EmpresaService,
    public dialog: MatDialog,
    // private areaService: RecruitMentAreaService,
    private areaService: AreaService,
    private masterTable: MastertableService,
    private utilsService: UtilService,
    private _router: Router,
    private requestService: RecruitMentPersonnelService,
    private jobInternalService: JobInternalService,
    private chargeService: CargoService

  ) {
    this.initForm();
    this.route.params.subscribe((params) => {
      this.idRequest = parseInt(params["id"]);
      this.loadInfoRequest();
    });
  }

  ngOnInit() {
    this.load();
  }

  initForm() {
    this.itemForm = this.fb.group({
      title: [null],
      idArea: [null || null],
      noticeDetails: [null || null, Validators.required],
      requirements: [null || null, Validators.required],
      benefits: [null || null, Validators.required],
      tags: [null || null],
      location: [null || null, Validators.required],
      id_Area: [null || null, Validators.required],
      id_JobLevel: [null || null, Validators.required],
      id_JobType: [null, Validators.required],
      id_WorkType: [753, Validators.required],
      id_Company: [ null, Validators.required],
      idDepartment: [null || null, Validators.required],
      idProvince: [null || null, Validators.required],
      idDistrict: [null || null, Validators.required],
      vacancies: [0],
      includeKeywords: [null || null],
      isSuitableForDisabled: [null || false],
      idSex: [null, Validators.required],
      minimumAge: [null, Validators.required],
      maximumAge: [null, Validators.required],
      workExperience: [null || null], // , Validators.required
      workCarrera: [null || null],
      minimumSalary: [null || null], // , Validators.required
      maximumSalary: [ null], // , Validators.required
      showSalaryInNotice: [false],
      isPostedBumeran: [false],
      isPostedComputrabajo: [false],
      idEducationLevel: [null, Validators.required],
      idEducationLevelSituation: [null, Validators.required],
      idiomSelected: "",
      lstEducationGrado: "",
      idiomLevelSelected: "",
      gradoSelected: "",
      jobIdiomList: [null || null],
      jobKeyWordList: [null || null],
      lstPostgrado:[null || null],
      lstPregrado:[null || null],
      idRequest: [0],
      id_Job: [null || 0],
      // finishDate: [null || null, Validators.required],
      finishDate: [null, Validators.required],
      idCharge: [null],
      idApplicant: [null]
    });
  }

  getJob() {
    
    this.postJobOfferService.getbyid(this.idRequest).subscribe(res => {
       if (res.data == null) {
        
        this.jobExistente = false;
        this.loadPostJobOffer();
       } else {
        this.jobExistente = true;
        
        this.buildItemFormJob(res.data);
       }
    });
  }

  stopProp(e) {
    e.stopPropagation();
  }

  loadPostJobOffer() {
    this.buildItemForm(this.request);
  }

  loadInfoRequest() {
    this.requestService.getrequestById(this.idRequest).subscribe((res) => {
      this.type = res.ntype;
      this.request = res;
      
      if (this.type == 1) {
          this.getJob();
      } else {
        this.getJobInternal();
      }
    });
  }

  loadCompetenciaByCargo(_id: number) {
    this.chargeService.getCompetenciaByCargo(0, _id, 0).subscribe(
      (resp) => {
        this.competencias = resp.data;
      },
      (err) => {},
      () => {}
    );
  }

  getJobInternal() {
    this.postJobOfferService.getbyidintern(this.idRequest).subscribe(res => {
      if (res.data == null) {
        this.jobExistente = false;
        this.loadPostJobOffer();
        this.itemForm.get('minimumAge').clearValidators();
        this.itemForm.get('maximumAge').clearValidators();
        this.itemForm.get('workExperience').clearValidators();
        this.itemForm.updateValueAndValidity();
      } else {
        this.jobExistente = true;
        this.buildItemFormJob(res.data);
        this.itemForm.get('minimumAge').clearValidators();
        this.itemForm.get('maximumAge').clearValidators();
        this.itemForm.get('workExperience').clearValidators();
        this.itemForm.updateValueAndValidity();
      }
    })
  }

  update(item) {
    item.favorite = true;
    this.postJobOfferService.update(item).subscribe((res) => {});
  }

  buildItemForm(item) {
    
    this.textoFunciones=item.sfunctions==null?'':item.sfunctions;
    this.loadCompetenciaByCargo(item.chargerequired);
    this.loadProvince(item.nid_department_sede);
    this.loadDistrict(item.nid_province_sede);

    if(item.lstLanguages.length > 0){
      for (let index = 0; index < item.lstLanguages.length; index++) {
        const element = item.lstLanguages[index];
        this.lstJobIdiom.push(element);
      }
      this.LanguagesDT = new MatTableDataSource(this.lstJobIdiom);
      this.lstIdiomas = item.lstLanguages
    }

    // INICIO DATA DE GRADO ACADEMICO
    if(this.request.lstPregrado.length > 0){
      // if(item.jobPregradoList.length > 0){
        for (let pr = 0; pr < this.request.lstPregrado.length; pr++) {
          const nopre = this.request.lstPregrado[pr];
          this.request.lstPregrado[pr].stextGrado = 'Pre-Grado'
          this.lstGeneral.unshift(nopre)
          this.lstPregrado.unshift(nopre)
        }

      }
      if(this.request.lstPostgrado.length > 0){ 
      // if(item.jobPostgradoList.length > 0){
        for (let po = 0; po < this.request.lstPostgrado.length; po++) {
          const nopost = this.request.lstPostgrado[po];
          this.request.lstPostgrado[po].stextGrado = 'Post-Grado'
          this.lstGeneral.unshift(nopost)
          this.lstPostgrado.unshift(nopost)
        }
      }
    
    this.GradosDT = new MatTableDataSource(this.lstGeneral);
    // FINAL DATA GRADO ACADEMICO

    this.textoCompetencias= this.textoFunciones;
    for(let i = 0;i<this.lstEducationLevelSituation.length;i++)
    {
      if(this.lstEducationLevelSituation[i].id==item.idEducationLevelSituation)
        this.sGradoAcademico = this.lstEducationLevelSituation[i].descriptionValue;
    }
    this.textoRequerimiento = item.sabilities + item.sknowledge + this.sGradoAcademico + '<br>' + 'Tener una disponibilidad de '+ item.schedule +'.';
    this.textoBeneficios = item.smodalitycontracting;
    if(item.nid_sex === 3377){
      item.nid_sex = 12
    }else if(item.nid_sex === 3378){
      item.nid_sex = 11
    } else {
        item.nid_sex = 939
    }

    
    this.itemForm = this.fb.group({
      title: [item.sname || null],
      idArea: [null || null],
      noticeDetails: [item.sfunctions, Validators.required],
      requirements: [this.textoRequerimiento, Validators.required],
      benefits: [this.textoBeneficios, Validators.required],
      tags: [null || null],
      location: [item.saddress_sede, Validators.required],
      id_Area: [null || null, Validators.required],
      id_JobLevel: [null || null, Validators.required],
      id_JobType: [item.nid_modalitycontracting || null, Validators.required],
      id_WorkType: [753, Validators.required],
      id_Company: [item.nid_company_position || null, Validators.required],
      idDepartment: [item.nid_department_sede, Validators.required],
      idProvince: [item.nid_province_sede, Validators.required],
      idDistrict: [item.niddistrict_sede, Validators.required],
      vacancies: [item.nvacancy || null],
      includeKeywords: [null || null],
      isSuitableForDisabled: [item.isSuitableForDisabled],
      // idSex: [11 || null, Validators.required],
      idSex: [item.nid_sex || null, Validators.required],
      minimumAge: [item.nminimumage || null, Validators.required],
      maximumAge: [item.nmaximumage || null, Validators.required],
      workExperience: [null || null],// , Validators.required
      workCarrera: [null || null],// , Validators.required
      minimumSalary: [null || null], // , Validators.required
      maximumSalary: [item.nsalary || null], // , Validators.required
      showSalaryInNotice: [
        item.showSalaryInNotice == undefined ? false : item.showSalaryInNotice,
      ],
      isPostedBumeran: [
        item.isPostedBumeran == undefined ? false : item.isPostedBumeran,
      ],
      isPostedComputrabajo: [
        item.isPostedComputrabajo == undefined
          ? false
          : item.isPostedComputrabajo,
      ],
      idEducationLevel: [item.nidgrade, Validators.required],
      // idEducationLevelSituation: [
      //   item.idEducationLevelSituation || null,
      //   Validators.required,
      // ],
      idiomSelected: "",
      idiomLevelSelected: "",
      lstEducationGrado: "",
      gradoSelected: "",
      jobIdiomList: [null || null],
      jobKeyWordList: [null || null],
      lstPregrado:[null || null],
      lstPostgrado:[null || null],
      idRequest: [item.nid_request || 0],
      id_Job: [null || 0],
      // finishDate: [null || null, Validators.required],
      finishDate: [item.dfinish_date, Validators.required],
      idCharge: [item.chargerequired || null],
      idApplicant: [item.nid_applicant || null]
    });
    
    this.loadAreas(item.nid_company_position, item.nid_area_position);

  }

  buildItemFormJob(item) {
    if (item.idDepartment != null) {
       this.loadProvince(item.idDepartment);
    }
    if (item.idProvince != null) {
      this.loadDistrict(item.idProvince);
    }
    // DATA DE IDIOMAS
    for (let j = 0; j < item.jobIdiomList.length; j++) {
      const nod = item.jobIdiomList[j];
        item.jobIdiomList[j].slanguage = nod.idiom
        item.jobIdiomList[j].snivel = nod.idiomLevel
    }
    
    this.LanguagesDT = new MatTableDataSource(item.jobIdiomList);
    this.lstIdiomas = item.jobIdiomList
    // FIN DE IDIOMAS
    // INICIO DATA DE GRADO ACADEMICO  jobPregradoList
    // if(this.request.lstPregrado.length > 0){
    if(item.jobPregradoList.length > 0){
      for (let pr = 0; pr < item.jobPregradoList.length; pr++) {
        const nopre = item.jobPregradoList[pr];
        item.jobPregradoList[pr].stextGrado = 'Pre-Grado'
        this.lstGeneral.unshift(nopre)
        this.lstPregrado.unshift(nopre)
      }
      // this.lstGeneral.unshift(item.jobPregradoList[0])
      // this.lstPregrado.unshift(item.jobPregradoList[0])
    }
    // if(this.request.lstPostgrado.length > 0){ jobPostgradoList
    if(item.jobPostgradoList.length > 0){
      for (let po = 0; po < item.jobPostgradoList.length; po++) {
        const nopost = item.jobPostgradoList[po];
        item.jobPostgradoList[po].stextGrado = 'Post-Grado'
        this.lstGeneral.unshift(nopost)
        this.lstPostgrado.unshift(nopost)
      }
      // this.lstGeneral.unshift(item.jobPostgradoList[0])
      // this.lstPostgrado.unshift(item.jobPostgradoList[0])
    }

    
    this.GradosDT = new MatTableDataSource(this.lstGeneral);
    // FINAL DATA GRADO ACADEMICO

    this.lstkeyword = item.jobKeyWordList;
    var divbenefits = item.benefits.split('<br>'); 
    this.itemForm = this.fb.group({
      title: [item.title || null],
      idArea: [item.idArea || null],
      noticeDetails: [item.noticeDetails || null, Validators.required],
      requirements: [item.requirements|| null, Validators.required],
      benefits: [divbenefits[0] || null, Validators.required],
      tags: [item.tags || null],
      location: [item.location || null, Validators.required],
      id_Area: [item.id_Area || null, Validators.required],
      id_JobLevel: [item.id_JobLevel || null, Validators.required],
      id_JobType: [item.id_JobType || null, Validators.required],
      id_WorkType: [item.id_WorkType || null, Validators.required],
      id_Company: [item.id_Company || null, Validators.required],
      idDepartment: [item.idDepartment || null, Validators.required],
      idProvince: [item.idProvince || null, Validators.required],
      idDistrict: [item.idDistrict || null, Validators.required],
      // vacancies: [item.vacancies || null, Validators.required],
      vacancies: [item.vacancies || null],
      includeKeywords: [null || null],
      isSuitableForDisabled: [item.isSuitableForDisabled || false],
      idSex: [item.idSex || null, Validators.required],
      minimumAge: [item.minimumAge || null, Validators.required],
      maximumAge: [item.maximumAge || null, Validators.required],
      workExperience: [item.workExperience || null], //, Validators.required
      workCarrera: ['' || null],// , Validators.required
      minimumSalary: [item.minimumSalary || null], // , Validators.required
      maximumSalary: [item.maximumSalary || null], // , Validators.required
      showSalaryInNotice: [
        item.showSalaryInNotice == undefined ? false : item.showSalaryInNotice,
      ],
      isPostedBumeran: [
        item.isPostedBumeran == undefined ? false : item.isPostedBumeran,
      ],
      isPostedComputrabajo: [
        item.isPostedComputrabajo == undefined
          ? false
          : item.isPostedComputrabajo,
      ],
      idEducationLevel: [item.idEducationLevel || null, Validators.required],
      // idEducationLevelSituation: [
      //   item.idEducationLevelSituation || null,
      //   Validators.required,
      // ],
      idiomSelected: "",
      idiomLevelSelected: "",
      gradoSelected: "",
      lstEducationGrado: "",
      jobIdiomList: [item.jobIdiomList || null],
      jobKeyWordList: [item.jobKeyWordList || null],
      lstPregrado:[null || null],
      lstPostgrado:[null || null],
      idRequest: [item.nid_request || 0],
      id_Job: [item.id_Job || 0],
      finishDate: [item.finishDate || null, Validators.required],
      idCharge: [item.idCharge || null],
      idApplicant: [item.idApplicant || null],
    });
    

    this.loadAreas(item.id_Company, item.id_Area);
  }

  valideKey(evt) {
    // code is the decimal ASCII representation of the pressed key.
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
        // backspace.
        return true;
    } else if (code >= 48 && code <= 57) {
        // is a number.
        return true;
    } else {
        // other keys.
        return false;
    }
}

  submit() {
  

    if (this.itemForm.invalid) {
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    //nuevo para publicar - estilos
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '182px',
      data:{message: 'Estas seguro de publicar esta Solicitud?', 
            messageAditional: '',
            messageAditional2: '',
            result: true,
            textButton: 'Publicar'},// "¿Estás seguro de aprobar?",
    });

    dialogRef.afterClosed().subscribe(resp => {
      
      if(resp.result){
          
          for (let i = 0; i < this.lstIdiomas.length; i++) {
            const element = this.lstIdiomas[i];
            for (let c = 0; c < this.lstIdiom.length; c++) {
              const elementnodei = this.lstIdiom[c];
                if(elementnodei.descriptionValue === element.slanguage){
                  this.lstIdiomas[i].slanguage = elementnodei.id
                  this.lstIdiomas[i].Idiom = elementnodei.descriptionValue
                  this.lstIdiomas[i].IdIdiom = elementnodei.id
                }
            }
            for (let c = 0; c < this.lstIdiomLevel.length; c++) {
              const elementnoden = this.lstIdiomLevel[c];
                if(elementnoden.descriptionValue === element.snivel){
                  this.lstIdiomas[i].snivel = elementnoden.id
                  this.lstIdiomas[i].IdiomLevel = elementnoden.descriptionValue
                  this.lstIdiomas[i].IdIdiomlevel = elementnoden.id
                }
            }
          }
          
          this.lstPostgrado = [];
          this.lstPregrado = []
          for (let g = 0; g < this.lstGeneral.length; g++) {
            const element = this.lstGeneral[g];
            
            if(element.stextGrado === 'Post-Grado'){
              this.lstPostgrado.unshift(element)
            }else{
              this.lstPregrado.unshift(element)
            }
          }
  
          this.itemForm.controls["jobIdiomList"].setValue(this.lstIdiomas);
          this.itemForm.controls["idRequest"].setValue(this.idRequest);
          this.itemForm.controls["vacancies"].setValue(0);
          this.itemForm.controls["minimumSalary"].setValue(0);
          this.itemForm.controls["maximumSalary"].setValue(0);
          this.itemForm.controls["jobKeyWordList"].setValue(this.lstkeyword);
  
          const payload = {
            lstPregrado:this.lstPregrado,
            lstPostgrado:this.lstPostgrado,
            IdRequest:this.idRequest,
            optionalJobs:(this.type == 1)?1:2,
            nid_job:(this.itemForm.value.id_Job == 0)?null:this.itemForm.value.id_Job
          }
          
          if (this.itemForm.value.id_Job == 0) {
          
            if (this.type == 1) {
          
              this.postJobOfferService.add(this.itemForm.value).subscribe(
                (res) => {
          
                  payload.nid_job = res.lastId
                  
                  this.requestService.UpdatePregrado(payload).subscribe((resp1) => {
                    
                  });
  
                  if (res.stateCode == 200) {
                    this.snack.open("¡Publicado correctamente!", "OK", { duration: 4000 });
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
                  // this.load();
                  // this.loadInfoRequest();
                  this._router.navigate([`humanmanagement/recruitment-detail/${this.idRequest}`], {
                    skipLocationChange: true
                  });
                }
              );
            } else {
              
              this.postJobOfferService.addInternal(this.itemForm.value).subscribe(
                (res) => {
                  
                  payload.nid_job = res.lastId
                  this.requestService.UpdatePregrado(payload).subscribe((resp1) => {
                    
                  });
  
                  if (res.stateCode == 200) {
                    this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
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
                  // this.load();
                  // this.loadInfoRequest();
                  this._router.navigate([`humanmanagement/recruitment-detail/${this.idRequest}`], {
                    skipLocationChange: true
                  });
                }
              );
            }
          } else {
            
            if (this.type == 1) {
              
              this.postJobOfferService.update(this.itemForm.value).subscribe(
                (res) => {
                  
                  this.requestService.UpdatePregrado(payload).subscribe((resp1) => {
                    
                  });
                  // this.loader.close();
                  if (res.stateCode == 200) {
                    this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
                  } else {
                    this.snack.open("Ocurrio un error en el servidor", "Error", {
                      duration: 4000,
                    });
                  }
                },
                (err) => {},
                () => {
                  // this.load();
                  this._router.navigate([`humanmanagement/recruitment-detail/${this.idRequest}`], {
                    skipLocationChange: true
                  });
                }
              );
            } else {
              
              this.postJobOfferService.addInternal(this.itemForm.value).subscribe(
                (res) => {
                  
                  this.requestService.UpdatePregrado(payload).subscribe((resp1) => {
                    
                  });
                  
                  if (res.stateCode == 200) {
                    this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
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
                  // this.load();
                  this._router.navigate([`humanmanagement/recruitment-detail/${this.idRequest}`], {
                    skipLocationChange: true
                  });
                }
              ); 
            }
          }
      }
    });


    // Swal.fire({ 
    //   title: 'Estas seguro de publicar esta Solicitud?',
    //   //showDenyButton: true,
    //   showCancelButton: true,
    //   confirmButtonText: 'Guardar',
    //   customClass: {
    //     confirmButton: 'clase-confirmar',
    //     cancelButton: 'clase-cancelar'
    //   }
    //   //denyButtonText: `Don't save`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {

    //   }
    // })

  }

  load() {
    this.loadEmpresas();
    this.loadJobLevel();
    this.loadJobType();
    this.loadWorkType();
    this.loadDepartament();
    this.loadGender();
    this.loadEducationLevel();
    this.loadEducationLevelSituation();
    this.loadIdiom();
    this.loadIdiomLevel();
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe((res) => (this.empresas = res));
  }

  loadAreas(idCompany: number, idArea: number) {
    this.areaService.getByCompany(idCompany).subscribe((res) => {
      this.lstAreas = res.data;
      
      if(idArea != 0) {
        this.itemForm.get("id_Area").setValue(idArea);
      }
    });
  }

  loadJobLevel() {
    this.masterTable
      .getByIdFather(114)
      .subscribe((res) => (this.lstJoblevel = res));
  }

  loadJobType() {
    this.masterTable
      .getByIdFather(66)
      .subscribe((res) => (this.lstJobType = res));
  }

  loadWorkType() {
    this.masterTable
      .getByIdFather(752)
      .subscribe((res) => (
       
      this.lstWorkType = res.filter((item) => item.id !== 754 && item.id !== 755)
       
      ));
  }

  loadGender() {
    this.masterTable
      .getByIdFather(7)
      .subscribe((res) => (
        this.lstGender = res
      ));
  }

  loadEducationLevel() {
    this.masterTable
      .getByIdFather(64)
      .subscribe((res) => (this.lstEducationLevel = res));
  }

  loadEducationLevelSituation() {
    this.masterTable
      .getByIdFather(110)
      .subscribe((res) => (this.lstEducationLevelSituation = res));
  }

  loadIdiom() {
    this.masterTable
      .getByIdFather(93)
      .subscribe((res) => (this.lstIdiom = res));
  }

  loadIdiomLevel() {
    this.masterTable
      .getByIdFather(88)
      .subscribe((res) => (this.lstIdiomLevel = res));
  }

  loadDepartament() {
    this.utilsService.getDepartament().subscribe((res) => {
      this.lstDepartament = res;
    });
  }

  loadProvince(id) {
    this.utilsService.getProvince(id).subscribe((res) => {
      this.lstProvince = res;
    });
  }

  loadDistrict(id) {
    this.utilsService.getDistrit(id).subscribe((res) => {
      this.lstDistrict = res;
      
    });
  }

  changeProvince(event) {
    this.loadProvince(event.value);
  }

  changeDistrict(event) {
    this.loadDistrict(event.value);
  }

  addIdiom()
  {
    this.idioma.slanguage= this.itemForm.get("idiomSelected").value;
    this.idioma.snivel = this.itemForm.get("idiomLevelSelected").value;
    
    if(this.idioma.slanguage && this.idioma.snivel)
    {
      //SE AGREGA VALIDACION PARA NO PERMITIR REPETIDOS
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

  addKeyword() {
    let palabraclave = this.itemForm.get("includeKeywords").value;
      if(palabraclave=='' || palabraclave==null){
        this.snack.open("ERROR: Debe ingresar la palabra clave.", "Error", {
          duration: 4000,
        });

        return;
      }
    let keyword = {
      id: null,
      idJob: null,
      keyWord: palabraclave,
    };

    this.lstkeyword.push(keyword);
    this.tablekeyword.renderRows();
    this.itemForm.controls["includeKeywords"].setValue("");
  }

  deleteKeyword(index) {
    this.lstkeyword.splice(index, 1);
    this.tablekeyword.renderRows();
  }

  deleteIdiom(index) {
    this.lstJobIdiom.splice(index, 1);
    this.tablelang.renderRows();
  }

  getDetailPath(id: number): void {
    this._router.navigate(['/humanmanagement/recruitment-detail',id], {
      skipLocationChange: true
    })
  }

  changeSelect($event) {
    
    this.lstEducationLevel = this.lstEducationLevel.filter((item) => item.id !== 76 && item.id !== 751)
    if($event.value === 'pre'){ //Pregrado
      this.lstEducationGradoAcademico = this.lstEducationLevel
    }else{ //PostGrado
      this.lstEducationGradoAcademico = this.lstEducationLevelSituation
    }
    
  }

  addGrado()
  {
    
    this.pregrado.sidGrado = this.itemForm.get("gradoSelected").value;
    this.pregrado.stextGrado = (this.pregrado.sidGrado === 'pre')?'Pre-Grado':'Post-Grado' 

    this.pregrado.scareer = this.itemForm.get("workCarrera").value;
    this.pregrado.idgrade = Number(this.itemForm.get("lstEducationGrado").value);
    
      if(this.pregrado.sidGrado && this.pregrado.scareer && this.pregrado.idgrade)
      {
        //SE AGREGA VALIDACION PARA NO PERMITIR REPETIDOS
        if(this.lstGeneral.some(pre => pre.scareer == this.pregrado.scareer && pre.idgrade === this.pregrado.idgrade))
        {
          Swal.fire({
            icon: 'warning',
            text: `El grado ya existe en la lista.`
          });
          return false;
        }

      if(this.pregrado.sidGrado === 'pre'){

          for(let i=0;i<this.lstEducationLevel.length;i++)
          {
            if(this.lstEducationLevel[i].id==this.itemForm.get("lstEducationGrado").value)
              this.pregrado.sgrade = this.lstEducationLevel[i].descriptionValue;
          }

          this.lstPregrado.unshift(this.pregrado)

      }else{

        for(let i=0;i<this.lstEducationLevelSituation.length;i++)
          {
            if(this.lstEducationLevelSituation[i].id==this.itemForm.get("lstEducationGrado").value)
              this.pregrado.sgrade = this.lstEducationLevelSituation[i].descriptionValue;
          }

          this.lstPostgrado.unshift(this.pregrado)
      }
        
        this.lstGeneral.unshift(this.pregrado);
        
        this.pregrado = {}
        this.GradosDT = new MatTableDataSource(this.lstGeneral);
      }
  }

  EliminarGrado(id: number, scareer: string)
  {
    
    if(typeof id === 'undefined'){
      this.lstGeneral = this.lstGeneral.filter(pre => pre.scareer !== scareer);
    }else{
      this.lstGeneral = this.lstGeneral.filter(pre => pre.id !== id);
    }
    this.GradosDT = new MatTableDataSource(this.lstGeneral);
    

  }

}

export interface Element {
  nid_request: number;
  slanguage: string;
  snivel: string;
}