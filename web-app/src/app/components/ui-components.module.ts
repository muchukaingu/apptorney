import { NgModule } from '@angular/core';
import { AppSidebarComponent } from './app-sidebar/app-sidebar.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  imports: [LandingPageComponent, AppSidebarComponent, ChatViewComponent],
  exports: [LandingPageComponent, AppSidebarComponent, ChatViewComponent]
})
export class UiComponentsModule {}
