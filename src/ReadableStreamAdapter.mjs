import {Readable} from 'stream'
import {nextTick} from './util.mjs'


// Web Streams ReadableStream shim built on top of Node.js' stream.Readable class
// https://streams.spec.whatwg.org/#rs-constructor
// https://streams.spec.whatwg.org/#rs-prototype
export default class ReadableStreamAdapter extends Readable {

	constructor (underlyingSource, options = {}) {
		super(options)
		this._ReadableStreamConstructor(underlyingSource, options)
	}

	// https://streams.spec.whatwg.org/#rs-locked
	get locked() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.locked')
	}

	// https://streams.spec.whatwg.org/#rs-cancel
	cancel(reason) {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.tee()')
	}

	// https://streams.spec.whatwg.org/#rs-get-reader
	getReader({mode} = {}) {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.getReader()')
	}

	// https://streams.spec.whatwg.org/#rs-pipe-through
	pipeThrough({writable, readable}, options) {
		this.pipeTo(writable, options)
		return readable
	}

	// https://streams.spec.whatwg.org/#rs-pipe-to
	pipeTo(dest, {preventClose, preventAbort, preventCancel} = {}) {
		this.pipe(dest)
		// TODO
	}

	// https://streams.spec.whatwg.org/#rs-tee
	tee() {
		console.warn('TO BE IMPLEMENTED ReadableStreamAdapter.tee()')
	}

	// https://streams.spec.whatwg.org/#rs-constructor
	_ReadableStreamConstructor(underlyingSource = {}, {size, highWaterMark} = {}) {
		this.underlyingSource
		// ReadableStreamDefaultController shim
		this.controller = {
			close: () => this.push(null),
			enqueue: chunk => this.push(chunk),
			error: err => nextTick(() => this.emit('error', err)),
			// If error occurs, emit it in the next tick as the Node docs require
		}

		this.underlyingSource.start(this.controller)
	}

	// Readable itself will be calling _read whenever it needs us to supply more data.
	async _read(maxSize) {
		this.controller.desiredSize = maxSize
		await this.underlyingSource.pull(this.controller)
	}

	// Handle destruction of the stream safely by stopping reader.
	async _destroy(err, callback) {
		if (this.underlyingSource.cancel)
			await this.underlyingSource.cancel(err)
		if (callback) callback()
	}

}