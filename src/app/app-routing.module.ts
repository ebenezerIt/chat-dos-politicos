import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { CustomRouteReuseStrategy } from './services/custom-route-reuse-strategy.service';

const routes: Routes = [
    // TEMPLATE
    {
        path: '',
        component: TemplateComponent,
        loadChildren: () => import('./template/template.module').then(m => m.TemplateModule),
        data: {
            shouldDetach: true
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    providers: [
        {
            provide: RouteReuseStrategy,
            useClass: CustomRouteReuseStrategy
        }
    ]
})
export class AppRoutingModule {
}
