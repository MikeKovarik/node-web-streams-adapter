import {Writable} from 'stream'
import {nextTick} from './util.mjs'


// Web Streams WritableStream shim built on top of Node.js' stream.Writable class
// https://streams.spec.whatwg.org/#ws-class
// https://streams.spec.whatwg.org/#ws-constructor
// https://streams.spec.whatwg.org/#ws-prototype
export default class WritableStreamAdapter extends Writable {

	constructor(underlyingSink = {}, {size, highWaterMark = 1} = {}) {
		super(options)
	}

	// https://streams.spec.whatwg.org/#ws-constructor
	_WritableStreamConstructor(underlyingSink, options = {}) {
	}

	// WEB WRITABLESTREAM APIS
	// https://streams.spec.whatwg.org/#ws-prototype

	// https://streams.spec.whatwg.org/#ws-locked
	get locked() {
		console.warn('TO BE IMPLEMENTED WritableStreamAdapter.locked')
		return
	}

	// https://streams.spec.whatwg.org/#ws-abort
	abort(reason) {
		console.warn('TO BE IMPLEMENTED WritableStreamAdapter.abort()')
		return
	}

	// https://streams.spec.whatwg.org/#ws-get-writer
	getWriter() {
		console.warn('TO BE IMPLEMENTED WritableStreamAdapter.getWriter()')
		return new WritableStreamDefaultWriter(this)
	}

	// NODE WRITABLE APIS

}


// https://streams.spec.whatwg.org/#default-writer-class
class WritableStreamDefaultWriter {

	// https://streams.spec.whatwg.org/#default-writer-constructor
	constructor(stream) {}

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