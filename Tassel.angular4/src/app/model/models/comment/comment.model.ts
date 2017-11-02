import { JsonHelper } from './../../../utils/helpers/typed_json.helper';
import { FormatTime } from 'ws-format-time';
import { deserializeAs, serializeAs } from 'cerialize';
import { Creator } from './../user/user.model';
import { IComment } from './comment.contract';

export class UserComment {

    @serializeAs('id')
    @deserializeAs('id')
    private id: string;
    public get ID(): string { return this.id; }

    @serializeAs('details')
    @deserializeAs('details')
    private details: string;
    public get Content(): string { return this.details; }

    @serializeAs('creator')
    @deserializeAs(Creator, 'creator')
    private creator: Creator;
    public get Creator(): Creator { return this.creator; }

    @serializeAs('mentioned')
    @deserializeAs(Creator, 'mentioned')
    private mentioned: Creator;
    public get Mentioned(): Creator { return this.mentioned; }

    @serializeAs(Number, 'create_time')
    @deserializeAs(Number, 'create_time')
    private create_time: number;
    private cttm: FormatTime;
    public get CreateTime(): FormatTime {
        return !this.create_time ? undefined :
            this.cttm || (this.cttm = FormatTime.Create(!this.create_time ? undefined : this.create_time * 1000, 0));
    }

    @serializeAs(Number, 'update_time')
    @deserializeAs(Number, 'update_time')
    private update_time: number;
    private uttm: FormatTime;
    public get UpdateTime(): FormatTime {
        return !this.update_time ? undefined :
            this.uttm || (this.uttm = FormatTime.Create(!this.update_time ? undefined : this.update_time * 1000, 0));
    }

    public static Parse = (i: UserComment) => JsonHelper.FromJson<UserComment>(i, UserComment);

}
