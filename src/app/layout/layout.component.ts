import { Component, HostBinding, ChangeDetectorRef, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @HostBinding('class') componentCssClass;

  private mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public loading: boolean = false;

  constructor(
    public overlayContainer: OverlayContainer,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.loaderService.isLoading.subscribe((l) => this.loading = l);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    overlayContainer.getContainerElement().classList.add('default-theme');
  }

  ngOnInit(): void { }

  onSetTheme(theme: string): void {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  getUserName(): string {
    let auth = JSON.parse(sessionStorage.getItem('auth'));
    return auth ? auth.name : 'usuário sem nome';
  }
}
