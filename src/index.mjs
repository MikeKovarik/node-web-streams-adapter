import ReadableStreamAdapter from './ReadableStreamAdapter.mjs'
import WritableStreamAdapter from './WritableStreamAdapter.mjs'
import {global} from './util.mjs'


export {ReadableStreamAdapter, WritableStreamAdapter}

if (!global.ReadableStream)
	global.ReadableStream = ReadableStreamShim
if (!global.WritableStream)
	global.WritableStream = WritableStreamShim
