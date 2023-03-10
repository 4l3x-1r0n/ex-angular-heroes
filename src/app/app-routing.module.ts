import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

import { ErrorPageComponent } from './shared/error-page/error-page.component';

const routes: Routes = [
    {
        path: 'auth',
        //esto se conoce como lazyload y lo que hace es cargar el modulo una vez se llama desde la ruta si no nuca los carga
        //para esto se definen rutas hijas en el modulo que estamos llamando
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'heroes',
        loadChildren: () =>
            import('./heroes/heroes.module').then((m) => m.HeroesModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
    },
    {
        path: '404',
        component: ErrorPageComponent,
    },

    {
        path: '**',
        // redirectTo: '404',
        redirectTo: 'auth/login',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
