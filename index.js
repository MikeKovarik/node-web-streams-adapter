(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('stream')) :
	typeof define === 'function' && define.amd ? define(['exports', 'stream'], factory) :
	(factory((global['node-web-streams-adapter'] = {}),global.stream));
}(this, (function (exports,stream) { 'use strict';

var nextTick = process.nextTick || self.setImediate || sel.setTimeout;
var global = typeof self !== 'undefined' ? self : typeof global === 'object' ? global : window;

class ReadableStreamAdapter extends stream.Readable {

	constructor (underlyingSource, options = {}) {
		console.warn('implement .pipeTo, .pipeThrough, .getReader() and other things from spec');
		console.warn('implement cancel');
		super(options);
		this.underlyingSource = underlyingSource;
		this.__applyReadableStreamAdapter(underlyingSource);
	}

	pipeTo() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.pipeTo()');
	}
	pipeThrough() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.pipeThrough()');
	}
	getReader() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.getReader()');
	}
	tee() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.tee()');
	}

	__applyReadableStreamAdapter(underlyingSource) {
		this.underlyingSource;
		// ReadableStreamDefaultController shim
		this.controller = {
			close: () => this.push(null),
			enqueue: chunk => this.push(chunk),
			error: err => nextTick(() => this.emit('error', err)),
			// If error occurs, emit it in the next tick as the Node docs require
		};

		this.underlyingSource.start(this.controller);
	}

	// Readable itself will be calling _read whenever it needs us to supply more data.
	async _read(maxSize) {
		this.controller.desiredSize = maxSize;
		await this.underlyingSource.pull(this.controller);
	}

	// Handle destruction of the stream safely by stopping reader.
	async _destroy(err, callback) {
		if (this.underlyingSource.cancel)
			await this.underlyingSource.cancel(err);
		if (callback) callback();
	}

}

class WritableStreamAdapter extends stream.Writable {

	constructor (underlyingSource, options = {}) {
		super(options);
		console.warn('TO BE IMPLEMENTED: WritableStreamAdapter');
	}

}

if (!global.ReadableStream)
	global.ReadableStream = ReadableStreamShim
if (!global.WritableStream)
	global.WritableStream = WritableStreamShim

exports.ReadableStreamAdapter = ReadableStreamAdapter;
exports.WritableStreamAdapter = WritableStreamAdapter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
