import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminMaterialsComponent } from './admin-materials/admin-materials.component';
import { AdminRefDataComponent } from './admin-ref-data/admin-ref-data.component';
import { AppSidebarComponent } from './app-sidebar/app-sidebar.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  imports: [LandingPageComponent, AppSidebarComponent, ChatViewComponent, AdminDashboardComponent, AdminMaterialsComponent, AdminRefDataComponent],
  exports: [LandingPageComponent, AppSidebarComponent, ChatViewComponent, AdminDashboardComponent, AdminMaterialsComponent, AdminRefDataComponent]
})
export class UiComponentsModule {}
