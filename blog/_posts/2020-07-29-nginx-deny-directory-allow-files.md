---
layout: post
title: NGINX&#58; Require Authentication for Directories but Still Allow Direct File Access
categories: [nginx, linux, lemp, security]
---

I came across this problem when I was trying to host and share images on my server but didn't want people to be able to access the actual *directory* which contained them.

NGINX does this by default if you don't turn on directory listing in your configuration file (with `autoindex on;`), but the catch here was that **I still wanted to be able to access the directory listing via username/password authentication.**

Here are some examples of the result I was looking for:
- `/images/photo.jpg`: public access
- `/images/`: authenticate
- `/images/old/photo.jpg`: public access
- `/images/old/`: authenticate

## Solution: Explicitly Disable Authentication

After much Googling and trial-and-error, I found that a combination of **nested location blocks** and `auth_basic off;` did the trick. Here is my solution to this problem in my NGINX configuration @ `nginx.conf`:

```nginx
location ~^/images/.*$ {
    # style directory listing
    fancyindex on;
    fancyindex_exact_size off;
    fancyindex_footer /Nginxy/footer.html;
    fancyindex_header /Nginxy/header.html;
    fancyindex_css_href /Nginxy/style.css;
    fancyindex_time_format "%B %e, %Y";

    auth_basic "Private Property";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # turn off authentication for files
    location ~ "\..{3,4}$" {
        auth_basic off;
    }
}
```

A few notes on this solution:
- The parent `location` block and the nested `location` block must *both* use regex, otherwise it won't work (see [this post](https://serverfault.com/a/627309/519089) for more information)
- `fancyindex` is a NGINX module that styles directory listing. Check out my post on installing it [here](/blog/install-nginx-fancyindex/)
- NGINX basic authentication can be set up quite easily and there are plenty of tutorials on doing so, like [this one](https://www.digitalocean.com/community/tutorials/how-to-set-up-basic-http-authentication-with-nginx-on-ubuntu-14-04)
    - Or, if you're on CentOS/RHEL, try this one-liner `yum -y install httpd-tools && sudo htpasswd -c /etc/nginx/.htpasswd your_username`
- My regex just allows all file extensions of 3-4 characters in length. This may or may not work for you, depending on the files you are storing. To allow specific filetypes, try something like this: `location ~ \.(jpg|png|gif)$ {...}`
- Remember to run `nginx -t` before reloading/restarting NGINX to check for syntax errors!

Hope this helps!