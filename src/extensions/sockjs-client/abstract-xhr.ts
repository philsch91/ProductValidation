/*
import AbstractXHRObject from 'sockjs-client/lib/transport/browser/abstract-xhr';

const _start = AbstractXHRObject.prototype._start;

AbstractXHRObject.prototype._start = function(method: any, url: any, payload: any, opts: any) {
    if (!opts) {
        opts = { noCredentials: true };
    }
    return _start.call(this, method, url, payload, opts);
};
*/

export {}
