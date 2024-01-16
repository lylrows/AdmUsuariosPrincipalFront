import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[appProgressBarColor]'
})
export class ProgressBarColor implements OnChanges{
  static counter = 0;

  @Input() appProgressBarColor;
  styleEl:HTMLStyleElement = document.createElement('style');
  
  //generate unique attribule which we will use to minimise the scope of our dynamic style 
  uniqueAttr = `app-progress-bar-color-${ProgressBarColor.counter++}`;

  constructor(private el: ElementRef) { 
    const nativeEl: HTMLElement = this.el.nativeElement;
    nativeEl.setAttribute(this.uniqueAttr,'');
    nativeEl.appendChild(this.styleEl);
  }

  ngOnChanges(changes: SimpleChanges): void{
    this.updateColor();
  }

  updateColor(): void{
   
    
     

      if (this.appProgressBarColor.idGroup == 1){


      }


    
    let colorrojo="#FF0000";
    let colorrojo_2='#f57369';
    let colorverde="#219653";
    let colorverde_2='#b4edcd';
    let colorazul="#6366F1";
    let colorazul_2='#9597e6';
    let resultcolor =colorazul;
    let resultcolor_2 = colorazul_2;

    // if (this.appProgressBarColor<=70){
    //     resultcolor= colorrojo;
    //     resultcolor_2 = colorrojo_2;
    // }else if (this.appProgressBarColor>70 && this.appProgressBarColor<=100){
    //     resultcolor= colorverde;
    //     resultcolor_2 = colorverde_2;
    // }else if(this.appProgressBarColor>100){

      

    //     resultcolor=colorverde;
    //     resultcolor_2 = colorazul_2

    // }

    // bexceeded
    // percent

    let npercent = this.appProgressBarColor.percent;

     if (npercent<=70){
        resultcolor= colorrojo;
        resultcolor_2 = colorrojo_2;
    }else if ( npercent >70 && npercent <=100){
        resultcolor= colorverde;
        resultcolor_2 = colorverde_2;
    }else if(npercent>100){
        resultcolor=colorverde;
        resultcolor_2 = colorazul_2
    }
    if (this.appProgressBarColor.bexceeded == true){
      resultcolor=colorverde;
      resultcolor_2 = colorazul_2
    }


    // update dynamic style with the uniqueAttr
    this.styleEl.innerText = `[${this.uniqueAttr}] .mat-progress-bar-fill::after {
        background-color: ${resultcolor};
      }
      [${this.uniqueAttr}] .mat-progress-bar-buffer {
        background-color: ${resultcolor_2};
      }
    `;
    
    
  }

}