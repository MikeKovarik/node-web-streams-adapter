(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('stream')) :
	typeof define === 'function' && define.amd ? define(['exports', 'stream'], factory) :
	(factory((global['node-web-streams-adapter'] = {}),global.stream));
}(this, (function (exports,stream) { 'use strict';

var nextTick = process.nextTick || self.setImediate || sel.setTimeout;
var global = typeof self !== 'undefined' ? self : typeof global === 'object' ? global : window;

// Web Streams ReadableStream shim built on top of Node.js' stream.Readable class
// https://streams.spec.whatwg.org/#rs-class
// https://streams.spec.whatwg.org/#rs-constructor
// https://streams.spec.whatwg.org/#rs-prototype
class ReadableStreamAdapter extends stream.Readable {

	// https://streams.spec.whatwg.org/#rs-constructor
	constructor(underlyingSource, options) {
		super(options);
		this._ReadableStreamConstructor(underlyingSource, options);
	}

	// https://streams.spec.whatwg.org/#rs-constructor
	_ReadableStreamConstructor(underlyingSource = {}, {size, highWaterMark = 1} = {}) {
		this._underlyingSource = underlyingSource;
		// ReadableStreamDefaultController shim
		this._controller = new ReadableStreamDefaultController(this, underlyingSource);
		/*this._controller = {
			close: () => this.push(null),
			enqueue: chunk => this.push(chunk),
			error: err => nextTick(() => this.emit('error', err)),
			// If error occurs, emit it in the next tick as the Node docs require
		}*/

		this._underlyingSource.start(this._controller);
	}

	// WEB READABLESTREAM APIS
	// https://streams.spec.whatwg.org/#rs-prototype

	// https://streams.spec.whatwg.org/#rs-locked
	get locked() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.locked');
		return
	}

	// https://streams.spec.whatwg.org/#rs-cancel
	cancel(reason) {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.cancel()');
		return
	}

	// https://streams.spec.whatwg.org/#rs-get-reader
	getReader({mode} = {}) {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.getReader()');
		if (mode === 'byob') {
			return // TODO, return byob reader
		} else {
			return new ReadableStreamDefaultReader(this)
		}
	}

	// https://streams.spec.whatwg.org/#rs-pipe-through
	pipeThrough({writable, readable}, options) {
		this.pipeTo(writable, options);
		return readable
	}

	// https://streams.spec.whatwg.org/#rs-pipe-to
	async pipeTo(dest, {preventClose, preventAbort, preventCancel} = {}) {
		if (preventClose !== undefined)
			console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.pipeTo() preventClose option');
		if (preventAbort !== undefined)
			console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.pipeTo() preventAbort option');
		if (preventCancel !== undefined)
			console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.pipeTo() preventCancel option');
		this.pipe(dest);
		// TODO
	}

	// https://streams.spec.whatwg.org/#rs-tee
	// Duplicates the stream and returns two instances
	tee() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.tee()');
		return [this, this]
	}

	// NODE READABLE APIS

	// Readable itself will be calling _read whenever it needs us to supply more data.
	async _read(maxSize) {
		await this._underlyingSource.pull(this._controller);
	}

	// Handle destruction of the stream safely by stopping reader.
	async _destroy(err, callback) {
		if (this._underlyingSource.cancel)
			await this._underlyingSource.cancel(err);
		if (callback) callback();
	}

}


// https://streams.spec.whatwg.org/#rs-default-controller-class
class ReadableStreamDefaultController {

	// https://streams.spec.whatwg.org/#rs-default-controller-constructor
	constructor(stream$$1, underlyingSource, size, highWaterMark) {
		this.stream = stream$$1;
		this.underlyingSource = underlyingSource;
	}

	// https://streams.spec.whatwg.org/#rs-default-controller-prototype

	// https://streams.spec.whatwg.org/#rs-default-controller-desired-size
	get desiredSize() {
		var state = this.stream._readableState;
		return state.highWaterMark - state.length
	}

	// https://streams.spec.whatwg.org/#rs-default-controller-close
	close() {
		this.stream.push(null);
	}

	// https://streams.spec.whatwg.org/#rs-default-controller-enqueue
	enqueue(chunk) {
		this.stream.push(chunk);
	}

	// If error occurs, emit it in the next tick as the Node docs require
	// https://streams.spec.whatwg.org/#rs-default-controller-error
	error(e) {
		nextTick(() => this.stream.emit('error', e));
	}
}



// https://streams.spec.whatwg.org/#default-reader-class
class ReadableStreamDefaultReader {

	// https://streams.spec.whatwg.org/#default-reader-constructor
	constructor(stream$$1) {}

	// https://streams.spec.whatwg.org/#default-reader-prototype

	// https://streams.spec.whatwg.org/#default-reader-closed
	get closed() {}

	// https://streams.spec.whatwg.org/#default-reader-cancel
	cancel(reason) {}

	// https://streams.spec.whatwg.org/#default-reader-read
	read() {}

	// https://streams.spec.whatwg.org/#default-reader-release-lock
	releaseLock() {}
}

class WritableStreamAdapter extends stream.Writable {

	constructor(underlyingSink = {}, {size, highWaterMark = 1} = {}) {
		super(options);
	}

	// https://streams.spec.whatwg.org/#ws-constructor
	_WritableStreamConstructor(underlyingSink, options = {}) {
	}

	// WEB WRITABLESTREAM APIS
	// https://streams.spec.whatwg.org/#ws-prototype

	// https://streams.spec.whatwg.org/#ws-locked
	get locked() {
		console.warn('TO BE IMPLEMENTED WritableStreamAdapter.locked');
		return
	}

	// https://streams.spec.whatwg.org/#ws-abort
	abort(reason) {
		console.warn('TO BE IMPLEMENTED WritableStreamAdapter.abort()');
		return
	}

	// https://streams.spec.whatwg.org/#ws-get-writer
	getWriter() {
		console.warn('TO BE IMPLEMENTED WritableStreamAdapter.getWriter()');
		return new WritableStreamDefaultWriter(this)
	}

	// NODE WRITABLE APIS

}


// https://streams.spec.whatwg.org/#default-writer-class
class WritableStreamDefaultWriter {

	// https://streams.spec.whatwg.org/#default-writer-constructor
	constructor(stream$$1) {}

	// https://streams.spec.whatwg.org/#default-writer-prototype

	// https://streams.spec.whatwg.org/#default-writer-closed
	get closed() {}

	// https://streams.spec.whatwg.org/#default-writer-desiredSize
	get desiredSize() {}
	// https://streams.spec.whatwg.org/#default-writer-ready
	get ready() {}

	// https://streams.spec.whatwg.org/#default-writer-abort
	abort(reason) {}

	// https://streams.spec.whatwg.org/#default-writer-close
	close() {}

	// https://streams.spec.whatwg.org/#default-writer-release-lock
	releaseLock() {}

	// https://streams.spec.whatwg.org/#default-writer-write
	write(chunk) {}
}

if (!global.ReadableStream)
	global.ReadableStream = ReadableStreamShim
if (!global.WritableStream)
	global.WritableStream = WritableStreamShim

exports.ReadableStreamAdapter = ReadableStreamAdapter;
exports.WritableStreamAdapter = WritableStreamAdapter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
