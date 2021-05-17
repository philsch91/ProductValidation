import AbstractXHRObject from 'sockjs-client/lib/transport/browser/abstract-xhr';

const _start = AbstractXHRObject.prototype._start;

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    if (!opts) {
        opts = { noCredentials: true };
    }
    return _start.call(this, method, url, payload, opts);
};
