import { Router } from '@angular/router';
import { IdentityService } from './../../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { OnInit, HostBinding, Component, OnDestroy } from '@angular/core';
import { TasselNavigationBase } from './../../../shared/components/base.component';
import { MessageService } from '../../../../services/app.service';
import { MessageType, UserMessage } from '../../../../model/app.model';

@Component({
    selector: 'tassel-user-message-box',
    templateUrl: './msg-box.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './msg-box.scss'
    ]
})
export class MessageBoxComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get IsWideScreen() { return window.innerWidth > 768; }

    public get Likes() { return this.message.Likes; }

    public get Comments() { return this.message.Comments; }

    public loaded = false;
    public get Loaded() { return this.loaded && this.message.Loaded; }

    public get UserName() { return this.identity.CurrentUser.FriendlyName; }

    public get Formater() { return this.formater; }

    constructor(
        private message: MessageService,
        protected router: Router) {
        super(router);
        this.setI18nPrefix("messageBox");
    }

    ngOnInit(): void {
        setTimeout(() => this.loaded = true);
    }

    ngOnDestroy(): void {

    }

    public ItemClicked(model) {

    }

    public GoToStatus(hostid: string, sourceid: string) {
        this.navigator.GoToStatusDetails(hostid);
        this.tryRead(sourceid);
    }

    private tryRead(sourceid: string) {
        this.message.Read(this.message.Messages.filter(i => !i.IsRead).find(i => i.ID === sourceid));
    }

    public IsEmpty(content: string) {
        return !content ? true : content.trim() === "<span></span>";
    }

}
