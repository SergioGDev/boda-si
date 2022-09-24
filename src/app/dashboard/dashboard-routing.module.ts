import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { DistribucionMesasComponent } from './pages/distribucion-mesas/distribucion-mesas.component';
import { GestionInvitadosComponent } from './pages/gestion-invitados/gestion-invitados.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';

const routes: Routes = [
    {
        path: '',
        component: MenuLateralComponent,
        children: [
            // { path: 'galeria', component: GaleriaComponent },
            { path: 'distribucion-mesas', component: DistribucionMesasComponent },
            { path: 'gestion-invitados', component: GestionInvitadosComponent },
            { path: 'ubicaciones', component: UbicacionesComponent },
            { path: '**', redirectTo: 'ubicaciones' }
            //{ path: 'path/:routeParam', component: MyComponent },
            //{ path: 'staticPath', component: ... },
            //{ path: '**', component: ... },
            //{ path: 'oldPath', redirectTo: '/staticPath' },
            //{ path: ..., component: ..., data: { message: 'Custom' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
