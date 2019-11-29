import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth = JSON.parse(sessionStorage.getItem('auth'));
    let token = auth ? `${auth.tokenType} ${auth.accessToken}` : '';
    let dupReq = req.clone({
      headers: req.headers.set('Authorization', token)
    });
    this.requests.push(dupReq);
    this.loaderService.isLoading.next(true);
    return Observable.create(observer => {
      const subscription = next.handle(dupReq)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
            this.removeRequest(dupReq);
            observer.error(err);
          },
          () => {
            this.removeRequest(dupReq);
            observer.complete();
          });
      return () => {
        this.removeRequest(dupReq);
        subscription.unsubscribe();
      };
    });
  }
}
