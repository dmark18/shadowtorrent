import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './app/pages/home/home.component';
import { AdminComponent } from './app/pages/admin/admin.component';
import { BrowseComponent } from './app/pages/browse/browse.component';
import { ProfileComponent } from './app/pages/profile/profile.component';
import { UploadComponent } from './app/pages/upload/upload.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/registration/registration.component';
import { TorrentDetailComponent } from './app/pages/torrent-detail/torrent-detail.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './app/environment'; // ez tartalmazza a Firebase configet

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([{path: 'home', component: HomeComponent},
    {path: 'browse', component: BrowseComponent},
    {path: 'profile', component:ProfileComponent},
    { path: 'admin', component: AdminComponent},
    {path: 'upload', component:UploadComponent},
    {path: 'login', component:LoginComponent},
    {path: 'registration', component:RegisterComponent},
    { path: 'torrent/:id', component: TorrentDetailComponent },
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', component: HomeComponent}]),
    provideHttpClient(),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
});
