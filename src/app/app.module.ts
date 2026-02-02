import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SoaComponent } from './soa/soa.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppComponent,
    SoaComponent
  ],
  providers: []
  
})
export class AppModule {}