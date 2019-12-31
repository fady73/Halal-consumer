import { AuthGuard } from './shared/services/auth-guard.service';
import { LayoutHomeComponent } from './shared/layout-home/layout-home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserModule } from './user/user.module';
import { LayoutComponent } from './shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: 'user',
        component: LayoutHomeComponent,
        loadChildren: () => import( './user/user.module' ).then( m => m.UserModule )
    },
    {
        path: 'master',
        //canActivate:[AuthGuard],canActivateChild:[AuthGuard],
        component: LayoutComponent,
        loadChildren: './shared/master/master.module#MasterModule',
    },
    {
        path: 'profile',
        canActivate:[AuthGuard],canActivateChild:[AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/company/company.module#CompanyModule',
    },
    {
        path: 'request',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/request/request.module#RequestModule',
    },
    {
        path: 'notification',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/show-notification/show-notification.module#ShowNotificationModule',
    },

    {
        path: 'agreement',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/agreement/agreement.module#AgreementModule',
    },
    {
        path: 'agreement',
        component: LayoutComponent,
        loadChildren: './components/agreement/agreement.module#AgreementModule',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard]
    },


    {
        path: 'audit-plan',
        component: LayoutComponent,
        loadChildren: './components/audit-plan/audit-plan.module#AuditPlanModule',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard]
    },

    {
        path: 'payment',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/payment/payment.module#PaymentModule',
    },
    {
        path: 'complaint',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/Complaint/complaint/complaint.module#ComplaintModule',
    },
    // {
    //     path: 'modification',
    //     canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    //     component: LayoutComponent,
    //     loadChildren: './components/modification-body-certification/modification-body/modification-body.module/ModificationBodyModule',
    // },
  
    {
        path: 'dashboard',
        canActivate:[AuthGuard],canActivateChild:[AuthGuard],
        component: LayoutComponent,
        loadChildren: './components/dashboard/dashboard.module#DashboardModule',
    },
    {
        path: '',
        // component: LayoutComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: '', component: HomeComponent },
        ]
    },
    { path: '**', component: PageNotFoundComponent }
]

@NgModule( {
    imports: [RouterModule.forRoot( routes )],
    exports: [RouterModule],
    declarations: [],
} )
export class AppRoutingModule { }