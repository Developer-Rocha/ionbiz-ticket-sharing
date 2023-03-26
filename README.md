# Ionbiz Ticket Sharing

Ionbiz Ticket Sharing is a browser extension that provides a user-friendly link based on a ticket viewed in the Ionbiz application.

## Problem statement

This project aims to overcome the shortcomings of the use cases underneath.

First, If you click on a ticket in the ticket overview page (example.ionbiz.com/Issue/Index), the detail section of a ticket is shown.
The url however isn't updated to the ticket url.
Instead you have to search for the ticket in the overview page and have to click right mouse > copy url.

Secondly, If you search for a ticket in the general search bar, the same issue as above applies. The detail section a ticket is show, but the url isn't updated.

Thirdly, the option of copying a ticket url generates a plain link without the ticket number and title as description (https://example.ionbiz.com/Issue/Index/1)

## Solution

The browser extension detects a ticket section on the Ionbiz application and provides a link if you click on the browser extension.

By default the extension copies the link in a plain link format:

```
https://example.ionbiz.com/Issue/Index/1
```

A second option is to format the link in a html link with ticket id and description: 

```
<a href="example.ionbiz.com/Issue/Index/1">12345 - Description of ticket</a>
```

Lastly, a custom format can be chosen based on a link, id and description token.

```
https://example.ionbiz.com/Issue/Index/1 (12345 - Description of ticket)
```
