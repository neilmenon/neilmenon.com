---
layout: post
title: Angular&#58; Preventing Multiple HTTP Requests to the Same Endpoint in Different Components
categories: [angular, typescript, http, api, rxjs]
excerpt_separator: <!--end_excerpt-->
---

While working on my new project, [lastfm-with-friends](https://github.com/neilmenon/lastfm-with-friends), I noticed that I was making a call to my backend user service multiple times in a single page load.

<!--end_excerpt-->

## The Problem

I figured out it was because I need the data in several different components. My `UserService` had a function `getUser()` which simply returned the `HttpClient`'s `Observable` to the components:

```ts
getUser() {
    return this.http.get(config.api_root + '/users/' + this.user);
}
```

And in my components:

```ts
this.userService.getUser().toPromise().then(data => {
    this.user = data
})
```

So for every component I used this function, I got a separate call made to my backend. This is obviously a waste so I looked for a way to prevent multiple calls.

## The Solution

After quite a bit of trial and error, I stumbled upon a solution that worked for me.


```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { config } from './config'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  username: string = localStorage.getItem("lastfm_username");
  user: Observable<any>;
  constructor(private http: HttpClient) { }
  
  /**
   * Prevent making multiple API requests for the same endpoint on different components.
   * Thanks to https://stackoverflow.com/a/50865911/14861722 for solution
  */
  getUser(): Observable<any> {
    if (this.user) {
      return this.user;
    } else {
      this.user = this.http.get(config.api_root + '/users/' + this.user).pipe(share());
      return this.user;
    }
  }
}
```

The basic idea here is to save the `Observable` from the first request in the `UserService`. When another components wants the data, the service will check if it already exists in the `this.user` variable. This seems pretty simple, but the real magic is in the [`share()`](https://www.learnrxjs.io/learn-rxjs/operators/multicasting/share) function, which I learned allows a resource to be shared among multiple subscribers. Pretty convenient.

Now I am calling this `getUser()` function in several components and seeing only one backend call.