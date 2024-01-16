import { Component, OnInit } from '@angular/core';
import { ContactService } from '@app/data/service/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {


  contacts: any;
  
  constructor(
    private contactService: ContactService
  ) { }



  ngOnInit(): void {
    this.load();
  }

  load() {
    this.contactService.getAllActive().subscribe((res) => {
      console.log("🚀 ~ this.contactService.getAllActive ~ res:", res)
      this.contacts = res
      
    });
    
  }


}
