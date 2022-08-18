# Ionbiz Ticket Link Provider

Ionbiz Ticket Link Provider is a browser extension that provides a user-friendly link based on a ticket viewed in the Ionbiz application.

## Problem statement

This project aims to overcome the shortcomings of the use cases underneath.

First, If you click on a ticket in the ticket overview page (example.ionbiz.com/Issue/Index), the detail section of a ticket is shown.
The url however isn't updated to the ticket url.
Instead you have to search for the ticket in the overview page and have to click right mouse > copy url.

Secondly, If you search for a ticket in the ticket overview page, the same issue as above applies. The url isn't updated to the ticket url.

Thirdly, the option of copying a ticket url generates a link without the ticket number and title as description:
```
<a href="example.ionbiz.com/Issue/Index/1">example.ionbiz.com/Issue/Index/1</a>
```

## Solution

The browser extension detects a viewed ticket page on the Ionbiz application and builds a link with the issue number and title as description.

```
<a href="example.ionbiz.com/Issue/Index/1">12345 - Description of ticket</a>
```

The user then has multiple options to copy the link for use.