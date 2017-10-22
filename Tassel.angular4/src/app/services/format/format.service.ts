import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { FormatTime } from 'ws-format-time';
import { ServerService } from './../server/server.service';
import { IdentityService } from './../identity/identity.service';
import { Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';

@Injectable()
export class FormatService extends AsyncableServiceBase {

    private logger: Logger<FormatService>;

    constructor(
        private identity: IdentityService,
        private server: ServerService) {
        super();
        this.logger = this.logsrv.GetLogger(FormatService).SetModule('service');
    }

    public readonly TimeFormat = (time: FormatTime) => {
        const seconds = Math.floor((Date.now() - time.UnixTime) / 1000);
        if (seconds > 315361000) {
            return time.FormatDateTime;
        } else if (seconds > 25921000) {
            const months = Math.floor(seconds / 2592000);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (seconds > 604800) {
            const weeks = Math.floor(seconds / 604800);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (seconds > 86400) {
            const days = Math.floor(seconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (seconds > 3600) {
            const hours = Math.floor(seconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (seconds > 60) {
            const mnts = Math.floor(seconds / 60);
            return `${mnts} minute${mnts > 1 ? 's' : ''} ago`;
        } else {
            return 'just now';
        }
    }

}