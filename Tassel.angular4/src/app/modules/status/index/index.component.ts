import { Status } from './../../../model/models/status/status.model';
import { pageShowAnimation } from './../../../utils/animations/page_show.animation';
import { HostBinding, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { TasselNavigationBase } from './../../shared/components/base.component';
import { IdentityService } from './../../../services/identity/identity.service';
import { RootService, StatusService } from '../../../services/app.service';
import { ServerStatus } from '../../../model/interfaces/response.interface';

@Component({
    selector: 'tassel-status-index',
    templateUrl: 'index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        'status-index.scss'
    ]
})
export class StatusIndexComponent extends TasselNavigationBase {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private _posts: Status[] = [];
    public get Posts() { return this._posts; }

    constructor(
        private status: StatusService,
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    public readonly postsProvide = async () => {
        const [succeed, status, error, response] = await this.status.GetAllStatusAsync();
        if (succeed && status === ServerStatus.Succeed) {
            return response;
        } else {
            return [];
        }
    }

    public readonly IsLiked = (model: Status): boolean => {
        let index = model.LikeUserIDs.findIndex(i => i === this.identity.CurrentUUID);
        if (index >= 0) { return true; }
        index = model.LikeUsers.findIndex(i => i.Creator.UUID === this.identity.CurrentUUID);
        return index >= 0;
    }

}
