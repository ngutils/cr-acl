# CrAcl
[![Build Status](https://travis-ci.org/ngutils/cr-acl.svg?branch=master)](https://travis-ci.org/ngutils/cr-acl)
Access control list for AngularJs.

```javascript
angular.module(
        'ngtest',
        [
            'ui.router',
            'cr.acl'
        ]
)
```

There are two fathers of all roles, `ROLE_USER` for authenticated users and `ROLE_GUEST` for anonymouse user.
You can set a role hierarchy configuration.

```javascript
.run(['crAcl', function run(crAcl) {
  crAcl.setInheritanceRoles({
    "ROLE_FREE" : ["ROLE_USER"],
    "ROLE_CLIENT" : ["ROLE_FREE", "ROLE_USER"]
  });
}])
```

Now you can set a list of granted role for single state
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
          is_granted: ["ROLE_GUEST"]
       }
    });

    $stateProvider.state( 'try-free', {
        url: '/free',
        views: {
            "main": {
                controller: 'FreeCtrl',
                templateUrl: 'home/free.tpl.html'
            }
        },
        data:{
          is_granted: ["ROLE_FREE"]
       }
    });
})
```
After login you can set role of your admin into crAcl
```javascript
$scope.login = function(){
    crAcl.setRole("ROLE_FREE");
};
```
Default role is `ROLE_GUEST`

If your user is not allowed for this route triggers a redirect to `unauthorized` state.
You can override it

```javascript
.run(['crAcl', function run(crAcl) {
  crAcl.setRedirct("unauth");
}])
```

## Directive
I'm writing a new directive to manage pieces of page visibility
```html
<div cr-granted="ROLE_GUEST">Welcome <span>if you are GUEST don't show this stuff</span></div>
```
This directive support multiple roles you can write a string separated by comma
