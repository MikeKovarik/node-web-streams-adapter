# node-web-streams-adapter

Use the new Web Streams API built on top of Node Streams

## Installation

```
npm install node-web-streams-adapter
```

## Usage

Automatically assigns `ReadableStream` and `WritableStream` to `global`, `window` or `self`.

``` js
var readable = new ReadableStream({
    start(controller) {
        // initialize the source we're reading from
        this.myDataSource = SomethingWereReadingFrom()
    },
    async pull(controller) {
        // read (next) chunk from the source and add it to the 
        var chunk = await this.myDataSource.getData(controller.desiredSize)
        controller.enqueue(chunk)
    },
    cancel(reason) {
        // safely close our source if the stream gets cancelled
        this.myDataSource.destroy()
    }
}, {highWaterMark: 1024})

var writeable = new WriteableStream({
    // TODO, work in progress
})

readable.pipeTo(writeable)
```

To learn more about the upcoming Web Streams API standard, read the [spec](https://streams.spec.whatwg.org).

## Caveats

Node's `Readable` streams pushes (to the stream) and dispatches (to consumer) data synchronously. E.g. Immediately after adding new chunk to the stream with `readable.push(chunk)`, the stream sends to to consumer, empties the inner buffer and calls `_read` again even if the previous call is not done yet.

Simply put:
```
class MyReadable extends stream.Readable {
    _read(size) {
        // get the chunk
        var chunk = somehowGetTheChunk(size)
        // add it to the stream's internal buffer
        this.push(chunk)
        // WARNING: AT THIS POINT, STREAM HAS HANDED THE CHUNK TO CONSUMER AND CALLED THIS _read METHOD AGAIN,
        // BEFORE WE COULD CLOSE THE STREAM.
        if (wasTheLastChunk) {
            // close the stream
            this.push(null)
        }
    }
}
```

With Web Streams API (and this adapter) this code could be sligthly rewritten

```
new ReadableStream({
    pull(controller) {
        // get the chunk
        var chunk = somehowGetTheChunk(controller.desiredSize)
        // add it to the stream's internal buffer
        controller.enqueue(chunk)
        // Native ReadableStream's asynchrony let's us finish all we do in this pull() before calling the next one.
        // So we can safely close the stream. However, since this adapter is based on node. The same problem occurs.
        if (wasTheLastChunk) {
            // close the stream
            controller.close()
        }
    }
})
```

but because this adapter is based on Node's `Readable`, the same problem occurs. To avoid any problems, the method should be rewritten to close the stream as the first thing.

```
new ReadableStream({
    pull(controller) {
        // Always ask if the resource has no more data to read from and end this stream if so.
        if (wasTheLastChunk) {
            // close the stream
            controller.close()
        }
        // Only then we can read the next available chunk
        var chunk = somehowGetTheChunk(controller.desiredSize)
        // add it to the stream's internal buffer
        controller.enqueue(chunk)
    }
})
```

## Work in progress

So far only the `ReadableStream`'s basic implementation's done.