import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import PocketBase from 'pocketbase';
import { APP_ROUTES, AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    importProvidersFrom([BrowserAnimationsModule]),
    {
      provide: PocketBase,
      useValue: new PocketBase('https://hpmi-refactor.pockethost.io'),
    },
  ],
}).catch((e) => console.error(e));
