import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContactComponent } from "./page/contact/contact.component";
import { CrudAreaComponent } from "./page/crud-areas/crud-area.component";
import { CrudCargoComponent } from "./page/crud-cargo/crud-cargo.component";
import { CrudHomeSliderComponent } from "./page/crud-home-slider/crud-home-slider.component";
import { CrudHomeDocumentosComponent } from "./page/crud-home-documentos/crud-home-documentos.component";
import { CrudHomeOrganizationComponent } from "./page/crud-home-organization/crud-home-organization.component";
import { CrudUserComponent } from "./page/crud-user/crud-user.component";
import { CrudempleadoComponent } from "./page/crudempleado/crudempleado.component";
import { CrudNotificationComponent } from "./page/crud-notification/crud-notification.component";
import { CrudPostJobOfferComponent } from "./page/crud-postjoboffer/crud-postjoboffer.component";
import { CrudBandboxComponent } from "./page/crud-bandbox/crud-bandbox.component";
import { CrudTypeStaffRequestComponent } from "./page/crud-type-staff-request/crud-type-staff-request.component";
import { CrudNineboxComponent } from "./page/crud-ninebox/crud-ninebox.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/support/contact",
    pathMatch: "full",
  },
  {
    path: "",
    children: [
      {
        path: "contact",
        component: ContactComponent,
        data: { title: "Contacto", breadcrumb: "Contacto" },
      },
      {
        path: "crud-areas",
        component: CrudAreaComponent,
        data: { title: "Areas", breadcrumb: "Areas" },
      },
      {
        path: "crud-cargo",
        component: CrudCargoComponent,
        data: { title: "Cargo", breadcrumb: "Cargo" },
      },
      {
        path: "crud-home-slider",
        component: CrudHomeSliderComponent,
        data: { title: "Home Slider", breadcrumb: "Home Slider" },
      },
      {
        path: "crud-home-documentos",
        component: CrudHomeDocumentosComponent,
        data: { title: "Home Documentos", breadcrumb: "Home Documentos" },
      },
      {
        path: "crud-home-organization",
        component: CrudHomeOrganizationComponent,
        data: { title: "Home Organización", breadcrumb: "Home Organización" },
      },
      {
        path: "crud-user",
        component: CrudUserComponent,
        data: { title: "Usuario", breadcrumb: "Usuario" },
      },
      {
        path: "crud-empleado",
        component: CrudempleadoComponent,
        data: { title: "Empleado", breadcrumb: "Empleado" },
      },
      {
        path: "crud-notification",
        component: CrudNotificationComponent,
        data: { title: "Notificación", breadcrumb: "Notificación" },
      },
      {
        path: "crud-postjoboffer/:id",
        component: CrudPostJobOfferComponent,
        data: {
          title: "Publicar Anuncio de Empleo",
          breadcrumb: "Publicar Anuncio de Empleo",
        },
      },
      {
        path: "crud-bandbox",
        component: CrudBandboxComponent,
        data: { title: "Bandas", breadcrumb: "Bandas" },
      },
      {
        path: "crud-type-staff-request",
        component: CrudTypeStaffRequestComponent,
        data: { title: "Tipo de Solicitud", breadcrumb: "Tipo de Solicitud" },
      },
      {
        path: "crud-ninebox",
        component: CrudNineboxComponent,
        data: { title: "Ninebox", breadcrumb: "Ninebox" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
