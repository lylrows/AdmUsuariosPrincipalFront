import { egretAnimations } from './../../animations/egret-animations';
import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html',
  styleUrls: ['./sidenav.template.scss'],
  animations: egretAnimations
})
export class SidenavComponent { 
  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;
  selectedIndex = 0;

  constructor(private el: ElementRef) {}
  ngOnInit() {}

  // Only for demo purpose
  addMenuItem() {
    this.menuItems.push({
      name: 'ITEM',
      type: 'dropDown',
      tooltip: 'Item',
      icon: 'done',
      state: 'material',
      sub: [
        {name: 'SUBITEM', state: 'cards'},
        {name: 'SUBITEM', state: 'buttons'}
      ]
    });
  }

  setColor(index) {

  }
  
  clickMenu(index) {
    console.log('element', index);
    this.selectedIndex = index;

    // this.menuItems.forEach((res, _index) => {
    //   const idMenu = _index + 1;
    //   const _textoId = 'menu_' + idMenu;
    //   const _element = document.getElementById(_textoId).classList;

    //   if(_index != index){
    //     if (_element.contains('open')) {
    //       _element.remove('open');
    //     }
    //   }
    // }); 
  }

}