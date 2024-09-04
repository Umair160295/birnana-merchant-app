
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {

  constructor(public util: UtilService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const intro = localStorage.getItem('intro');
    console.log('intro', localStorage.getItem('intro'));
    if (intro && intro != null && intro != 'null') {
      this.util.navigateRoot('tabs');
      return true;
    }
    this.util.navigateRoot('/intro');
    return false;
  }
}
