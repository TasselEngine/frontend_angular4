import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TasselNavigationBase } from '../base.component';
import { IdentityService, AdminService, RootService, StatusService } from '../../../../services/app.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UnionUser } from '../../../../model/app.model';

@Component({
    selector: 'tassel-usericon-div',
    templateUrl: './user-div.html',
    styleUrls: ['./div.scss']
})
export class UserDivComponent extends TasselNavigationBase implements OnInit, OnDestroy, OnChanges {

    @Input()
    private config: any;
    public get AppMain() { return this.config || {}; }

    @Input()
    private user: UnionUser;
    public get CurrentUser(): UnionUser { return <any>(this.user || {}); }

    @Input()
    private showPopover: boolean;
    public get ShowPopover() { return this.showPopover || false; }
    public set ShowPopover(value: boolean) { this.showPopover = value; }

    public ShowRefresh = false;
    public ShowMenu = false;

    public get ShowType() {
        return this.ShowRefresh && !this.ShowSlider ? 'three' : (this.ShowRefresh && this.ShowSlider) || (!this.ShowRefresh && !this.ShowSlider) ? 'two' : 'one';
    }

    private refreshInvoker: Function;

    public get WindowWidth() { return window.innerWidth; }
    public get IsWideScreen() { return window.innerWidth > 768; }
    public get ShowSlider() { return window.innerWidth > 1280; }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    public get Logined() { return (this.identity && this.identity.IsLogined) || false; }

    constructor(
        private status: StatusService,
        private admin: AdminService,
        private root: RootService,
        protected router: Router) {
        super(router);
    }

    ngOnInit(): void {
        this.menuInit();
        this.refreshButtonInit();
    }

    ngOnDestroy(): void {
        this.dispose();
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    private menuInit() {
        this.subscribe(this.router.events, (event) => {
            if (!(event instanceof NavigationEnd)) { return; }
            this.ShowMenu = false;
            this.ShowRefresh = false;
            this.refreshInvoker = null;
        });
    }

    private refreshButtonInit() {
        this.subscribe(this.root.RefreshButtonSubject, ([toShow, invoker]) => {
            setTimeout(() => {
                this.ShowRefresh = toShow;
                this.refreshInvoker = invoker;
            });
        });
    }

    public ShowMainMenu() {
        const config = {
            title: 'MENU', items: [
                { label: 'Home', onClick: () => this.navigator.GoHome() },
                {
                    label: 'Status', onClick: () => {
                        this.status.ClearStatusCollection();
                        this.navigator.GoToStatusIndex();
                    }
                },
                { label: 'Posts', onClick: () => { } },
                { label: 'Notes', onClick: () => { } },
            ]
        };
        if (this.Logined && (this.CurrentUser.Role === 'admin' || this.CurrentUser.Role === 'core')) {
            config.items.push({ label: 'Manage', onClick: () => this.navigator.GoToAdminDashboard() });
        }
        this.root.ShowBottomPop(config);
    }

    public ShowUserMenu() {
        const username = this.CurrentUser.FriendlyName;
        const config = {
            title: username, items: [
                { label: 'Profile', onClick: () => this.ToUserProfile() },
                { label: 'Logout', onClick: () => this.Logout() },
            ]
        };
        if (this.Logined && (this.CurrentUser.Role === 'admin' || this.CurrentUser.Role === 'core')) {
            config.items.push({ label: 'Manage', onClick: () => this.ToAdminDashboard() });
        }
        this.root.ShowBottomPop(config);
    }

    public RefreshInvoke() {
        if (this.refreshInvoker) {
            this.refreshInvoker();
        }
    }

    public Logout() {
        this.identity.LogoutAsync(async () => {
            this.admin.CheckAccess(false);
            this.hideMenuAndPopover();
            await this.Delay(100);
            this.navigator.GoHome();
        });
    }

    public async ToUserProfile() {
        this.hideMenuAndPopover();
        await this.Delay(100);
        this.navigator.GoToUserProfile();
    }

    public async ToAdminDashboard() {
        this.hideMenuAndPopover();
        await this.Delay(100);
        this.navigator.GoToAdminDashboard();
    }

    private hideMenuAndPopover() {
        this.ShowMenu = this.showPopover = false;
    }

}