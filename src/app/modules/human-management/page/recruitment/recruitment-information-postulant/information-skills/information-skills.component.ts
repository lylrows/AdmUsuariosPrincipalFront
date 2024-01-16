import { MatSnackBar } from '@angular/material/snack-bar';
import { InformationPostulantService } from "./../../../../../../data/service/information-postulant.service";
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MastertableService } from '@app/data/service/mastertable.service';

@Component({
  selector: "app-information-skills",
  templateUrl: "information-skills.component.html",
  styleUrls: ["./information-skills.component.scss"],
})
export class InformationSkillsComponent implements OnInit {
  @Input() infoskills: any;
  @Input() infolang: any;
  @Input() idPostulant: number;
  @Input() isReadOnly: boolean = false;
  @Output() afterchangerowwork = new EventEmitter();
  @Output() afterchangerowlang = new EventEmitter();

  public niveles:any;
  public nivelesComputacion:any;
  public languageslist:any;
  

  constructor(private service: InformationPostulantService, 
    private snack: MatSnackBar,
    private masterTableService:MastertableService) {
      this.loadJobLevel();
      this.loadKnowledgeLevel();
      this.loadLanguages();
    }

  ngOnInit() {
    
       this.loadInfoSkills();
       this.loadInfoLang();
      
  }

  loadInfoSkills() {
    this.service.getInfoSkills(this.idPostulant).subscribe(res => {
         this.infoskills = res.data;
    })
  }

  loadInfoLang() {
    this.service.getInfoLang(this.idPostulant).subscribe(res => {
         this.infolang = res.data;
    })
  }

  onRowEditSaveSkills(item ,action='') {
    
    if (action===''){
      let softwares = this.infoskills.filter(x=> x.software === item.software && x.id !== 0 &&  x.id !== item.id);
      if (softwares.length>0){
       this.snack.open("No se puede agregar dos Softwares iguales", "OK", { duration: 4000 });
           return false;
      }
   }
   
  
   if((item.software === "" || item.idLevel === 0) && action===''){
    this.snack.open("Datos incompletos !", "OK", { duration: 4000 });
    return false;
   }



    this.service.saveinformationSkills(item).subscribe((res) => {
      if (res.stateCode == 200) {

        if (action===''){
          this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
        }else{
          this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
        }

        
        this.loadInfoSkills();
      }
    });
  }

  onRowEditSaveLang(item,action='') {

    
    if (action===''){

        
      let softwares = this.infolang.filter(x=> x.idLanguage === item.idLanguage && x.id !== 0 &&  x.id !== item.id);
      if (softwares.length>0){
       this.snack.open("No se puede agregar dos Idiomas iguales", "OK", { duration: 4000 });
           return false;
      }
   }
    
    this.service.saveinformationlang(item).subscribe((res) => {
      if (res.stateCode == 200) {
        if(action===''){
          this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
        }else{
          this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
        }
        
        this.loadInfoLang();
      }
    });
  }

  addRowSkills() {
    const obj: any = {
      software: "",
      idLevel: 0,
      IdPostulant: this.idPostulant,
      id:0
    };
    this.infoskills.push(obj);
  }

  addRowLang() {

    let idLanguageDefault =this.languageslist[0].id;
    let idLevelDefault= this.niveles[0].id;


    const obj: any = {
      lang: "",
      levelOral: null,
      levelWritten: null,
      levelReading: null,
      IdPostulant: this.idPostulant,
      idLanguage:idLanguageDefault,
      idOralLevel:idLevelDefault,
      idWrittenLevel:idLevelDefault,

    };
    this.infolang.push(obj);
  }

  deleteRowSkills(index) {
    this.infoskills[index].software = "";
    this.onRowEditSaveSkills(this.infoskills[index],'Eliminar');
  }

  deleteRowLang(index) {
    this.infolang[index].idLanguage = 0;
    this.onRowEditSaveLang(this.infolang[index],'Eliminar');
  }
  CheckChanged(item,level)
  {
    switch(level)
    {
      case 'basico':
        if(item.levelBasico)
        {
          item.levelIntermedio = false;
          item.levelAvanzado = false;
        }
        break;
      case 'intermedio':
        if(item.levelIntermedio)
        {
          item.levelBasico = false;
          item.levelAvanzado = false;
        }
        break;
      case 'avanzado':
        if(item.levelAvanzado)
        {
          item.levelBasico = false;
          item.levelIntermedio = false;
        }
        break;
    }
  }
  loadJobLevel() {
    this.masterTableService.getByIdFather(88).subscribe(res => { 
      this.niveles = res ;
    },
      (err) => { },
      () => {
        
      });
  }
  loadKnowledgeLevel() {
    this.masterTableService.getByIdFather(99).subscribe(res => { 
      this.nivelesComputacion = res ;
    },
      (err) => { },
      () => {
        
      });
  }
  loadLanguages() {
    this.masterTableService.getByIdFather(93).subscribe(res => { 
      this.languageslist = res ;
      
    },
      (err) => { },
      () => {
        
      });
      
  }




  RoxIndexSkill = null;
  RoxIndexLanguage = null;

  ngAfterViewChecked() {
    if (this.RoxIndexSkill !== null) {
      let _element = <HTMLElement>(
        document.querySelectorAll(".init-edit-skill")[this.RoxIndexSkill]
      );

      _element.click();

      this.RoxIndexSkill = null;
    }

    if (this.RoxIndexLanguage !== null) {
      let _element = <HTMLElement>(
        document.querySelectorAll(".init-edit-language")[this.RoxIndexLanguage]
      );

      _element.click();

      this.RoxIndexLanguage = null;
    }
  }

  
  onRowEditCancelSkill(item, index){
    
    if (item.id ===0){

        this.infoskills.splice(index,1)
        this.cloneSkill= null;
    }else{
        
        this.infoskills[index] = this.cloneSkill;
        
        this.cloneSkill= null;
    }


   }

   onRowEditInitSkill(item) {
    
    this.cloneSkill=   {...item};;

   }
   cloneSkill= null;

   onRowEditCancelLang(item, index){
    
    if (item.id ===0){

        this.infolang.splice(index,1)
        this.cloneLang= null;
    }else{
        
        this.infolang[index] = this.cloneLang;
        
        this.cloneLang= null;
    }


   }

   onRowEditInitLang(item) {
    
    this.cloneLang=   {...item};;

   }
   cloneLang= null;



  
}
