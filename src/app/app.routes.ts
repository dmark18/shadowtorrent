import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadComponent } from './pages/upload/upload.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/registration/registration.component';
import { TorrentDetailComponent } from './pages/torrent-detail/torrent-detail.component'

export const routes: Routes = [
{path: 'home', component: HomeComponent},
{path: 'browse', component: BrowseComponent},
{path: 'profile', component:ProfileComponent},
{ path: 'admin', component: AdminComponent},
{path: 'upload', component:UploadComponent},
{path: 'login', component:LoginComponent},
{path: 'registration', component:RegisterComponent},
{ path: 'torrent/:id', component: TorrentDetailComponent },
{path: '', redirectTo: 'home', pathMatch: 'full'},
{path: '**', component: HomeComponent}
];
