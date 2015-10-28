# crAcl
[![Build Status](https://travis-ci.org/ngutils/cr-acl.svg?branch=master)](https://travis-ci.org/ngutils/cr-acl)

## Overview

crAcl is Access Control List module for AngularJs. It works with [UI-Router](https://github.com/angular-ui/ui-router) letting you to restrict the access of specific routes to a set of roles.

## Install

You can use bower
```bash
bower install cr-acl
```
add to your html:

```html
<script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<script src="bower_components/cr-acl/cr-acl.js"></script>
```
then inject it in your app:

```javascript
angular.module(
        'ngtest',
        [
            'ui.router',
            'cr.acl'
        ]
)
```

## Role configuration

There are two fathers of all roles: `ROLE_USER` for authenticated users and `ROLE_GUEST` for anonymous users.
You can set a role hierarchy configuration.

```javascript
.run(['crAcl', function run(crAcl) {
  crAcl.setInheritanceRoles({
    "ROLE_CUSTOMER" : ["ROLE_USER"],
    "ROLE_CLIENT" : ["ROLE_CUSTOMER", "ROLE_USER"]
  });
}])
```
In this exaple the role `ROLE_ADMIN` if over `ROLE_CUSTOMER` (that's father of `ROLE_USER`) and `ROLE_USER`.

## Assign role to users


Whenever you want (for example after a successful login action) you can set the role of a user with `crAcl` service (inject it into your controllers, services, directive...):

```javascript
$scope.login = function(){
    crAcl.setRole("ROLE_USER");
};
```

Default role is `ROLE_GUEST`

If your user is not allowed for this route triggers a redirect to `unauthorized` state.
You can override it in the run:

```javascript
.run(['crAcl', function run(crAcl) {
  crAcl.setRedirct("your-login-state-name");
}])
```


## Restrict route access

Now you can set a list of granted role for single state:

```javascript
.config(function config($stateProvider ) {
    $stateProvider.state('home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data:{
          is_granted: ["ROLE_USER"]
       }
    });

    $stateProvider.state( 'dashboard', {
        url: '/dashboard',
        views: {
            "main": {
                controller: 'DashboardCtrl',
                templateUrl: 'home/dashboard.tpl.html'
            }
        },
        data:{
          is_granted: ["ROLE_ADMIN"]
       }
    });
})
```

In this example, the `home` route is accessible by both `ROLE_CUSTOMER` and `ROLE_ADMIN` (because that roles extend `ROLE_USER`) and the `dashboard` route is accessible only by `ROLE_ADMIN`.


## Directive

You can prevent compilation of specific DOM components with the `cr-granted` directive:

```html
<div cr-granted="ROLE_ADMIN">Hello Admin!</div>
```

This directive supports multiple roles:

```html
<div cr-granted="ROLE_CUSTOMER,ROLE_SUPPORT,ROLE_GUEST">Hello guys!</div>
```
