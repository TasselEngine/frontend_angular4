import { WSi18N } from './token';

export class I18N {

    private cache = {};

    constructor(private i18n: WSi18N) { }

    public ResetI18N(locale: string): boolean {
        if (this.i18n.files[locale]) {
            this.i18n.current = <any>this.i18n.files[locale];
            this.i18n.locale = locale;
            this.cache = {};
            return true;
        }
        return false;
    }

    public get Language() { return this.i18n.locale; }

    public get Locale() { return this.i18n.current; }

    public Get(KeyValue: string, isSearch = true): string | boolean | number {
        if (this.Locale[KeyValue]) {
            return this.Locale[KeyValue];
        } else {
            if (this.cache[KeyValue]) {
                return this.cache[KeyValue];
            }
            let real: any;
            for (const prop in this.i18n.files) {
                if (prop) {
                    const file = this.i18n.files[prop];
                    const target = Object.keys(file).find(key => file[key] === KeyValue);
                    if (target) {
                        real = this.Locale[target] || KeyValue;
                        this.cache[KeyValue] = real;
                        break;
                    }
                }
            }
            return real || KeyValue;
        }
    }
}
