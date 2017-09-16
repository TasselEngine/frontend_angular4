import { IResponse, IError, APIResult } from './../../model/interfaces/response.interface';
import { Http, RequestOptions, Response } from '@angular/http';
import { AsyncableClassBase as AsyncableServiceBase } from 'ws-async-base';
import { HttpType } from '../../model/enums/response.enum';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export { AsyncableServiceBase };

/**
 * 支持异步等待延时的API服务基类，封装了通用请求方法和静态类型化的返回结果
 */
export class AsyncableApiServiceBase extends AsyncableServiceBase {

    constructor(protected http: Http) { super(); }

    protected RequestInvokeAsync = async (url: string, options?: RequestOptions, params?: [HttpType, any]): Promise<APIResult> => {
        const [type, args] = params || [HttpType.GET, undefined];
        const action =
            type === HttpType.GET ? () => this.http.get(url, options) :
                type === HttpType.POST ? () => this.http.post(url, args, options) :
                    type === HttpType.PUT ? () => this.http.put(url, args, options) :
                        type === HttpType.DELETE ? () => this.http.delete(url, options) :
                            () => this.http.options(url, options);
        try {
            const result = await action().map(i => i.json() as IResponse).toPromise();
            return [true, null, result];
        } catch (error) {
            if (!(error instanceof Response)) {
                return [true, { errors: error, url: url, options: options, type: type, args: args }, null];
            }
            try {
                const response = error.json() as IResponse;
                return [true, null, response];
            } catch (erro2) { return [true, { errors: error, url: url, options: options, type: type, args: args }, null]; }
        }
    }

}
