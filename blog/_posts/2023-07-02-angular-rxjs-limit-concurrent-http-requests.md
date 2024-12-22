---
layout: post
title: "Angular/RxJS: Limiting Concurrent HTTP Requests"
categories: [angular, rxjs, http, typescript]
---


In a recent project, I was working with handling parallel file uploads from the UI. In some cases, there would be 50+ upload HTTP requests to process. Initially, I implemented the parallel upload handler using [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). However, this method fires all the requests at once which would crash the browser. I wanted a way to control how many uploads could be going at once.

## The Solution

The solution required putting the list of requests through a pipe with [`mergeMap`](https://rxjs.dev/api/operators/mergeMap), which has a concurrency parameter. Then, I could extract the results of each request using [`tap`](https://rxjs.dev/api/operators/tap) and catch any individual errors with [`catchError`](https://rxjs.dev/api/operators/catchError). Once one request finishes, the next request starts immediately. Here is a sample implementation:

```typescript
import { HttpClient, HttpErrorResponse, HttpRequest } from "@angular/common/http";
import { from, of } from "rxjs";
import { catchError, mergeMap, tap } from "rxjs/operators";

// constructor, other things, etc...

ngOnInit(): void {
    this.uploadLimitConcurrency().then(res => {
        if (res instanceof Error) {
        // throw error
        } else {
        // your results
        }
    })
}

async uploadLimitConcurrency(): Promise<any> {
    const uploadRequests: Array<HttpRequest> = [...] // your many HTTP requests
    const CONCURRENT_UPLOADS = 3 // # of concurrent uploads to go at once
    let results: Array<any> = []
    let requestsCompleted: number = 0
    const concurrentPipe = await from(uploadRequests).pipe(
        mergeMap(obj => this.httpClient.request(obj), CONCURRENT_UPLOADS), // this allows us to limit concurrent uploads
        tap((res: any) => { 
        if(res?.status == 200) { // do something with the results
            // push the headers of the response to results
            results.push(res)

            // you can keep track of progress of overall upload
            requestsCompleted++
        }
        }),
        catchError((err: HttpErrorResponse) => {
        if (err.status == 403) { 
            return of(new Error(`A 403 error ocurred while trying to upload the file: ${err.error}`))
        }
        return of(new Error(`Some other error occurred: ${err.error}`))
        })
    ).toPromise()

    // handle error outside the pipe
    if (concurrentPipe instanceof Error) { 
        console.log(concurrentPipe) // contains error
        return concurrentPipe
    }

    return results
}
```

## Demo / Conclusion

I've created a simple demo of this implementation using a random [`delay`](https://rxjs.dev/api/operators/delay) to mock real HTTP requests. View the code and demo below, or [here](https://stackblitz.com/edit/angular-t2hjd3).

<iframe style="width: 100%; height: 500px" src="https://stackblitz.com/edit/angular-t2hjd3?ctl=1&embed=1&file=src/app/app.component.ts&view=preview"></iframe>

That's all! Any issues or comments, drop me a line in the comments below.