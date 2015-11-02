angular.module("cr.acl", [])
.constant("cr-acl.config", {
  "redirect": "unauthorized",
  "roles": {
    "ROLE_USER": ["ROLE_USER"],
    "ROLE_GUEST": ["ROLE_GUEST"]
  }
})
.provider("crAcl", ['cr-acl.config', function(config){
  var self = {};
  self.roles = config.roles;
  self.redirect = config.redirect;

  /**
   * Your role is granted for this route?
   * @param string identityRole
   * @param array  sstateRolesGranted
   * @return bool
   */
  self.isGranted = function(identityRole, stateRolesGranted){
    var granted = false;

    if((identityRole in self.roles) === false){
      throw "This role["+identityRole+"] not exist into InheritanceRoles declaration";
    }

    if(stateRolesGranted.indexOf(identityRole) !== -1){
      granted = true;
    }

    for(var ii in self.roles[identityRole]) {
      if(stateRolesGranted.indexOf(self.roles[identityRole][ii]) !== -1){
        granted = true;
      }
    }

    return granted;
  };

  this.$get = ['$q', '$rootScope', '$injector', function($q, $rootScope, $injector){
    var crAcl = {};

    /**
     * Configure roles tree
     * @param arrat roles
     */
    crAcl.setInheritanceRoles = function(roles){
        angular.forEach(roles, function(inheritance, roleName){
        if(roleName == "ROLE_USER" && roleName == "ROLE_GUEST"){
            throw roleName+" is a reserved world because is a father of ROLE, you can not override it";
        }
        self.roles[roleName] = inheritance;
        });
    };

    /**
     * Set route name for redirect after unauthorized operation
     */
    crAcl.setRedirect = function(redirectStateName){
        self.redirect = redirectStateName;
    };

    /**
     * Set Role
     * @param string role
     */
    crAcl.setRole = function(role){
        self.identityRole = role;
    };

    /**
    * Return your role
    * @return string
    */
    crAcl.getRole = function(){
        if(self.identityRole === undefined){
          return "ROLE_GUEST";
        }
        return self.identityRole;
    };

    var afterChangeStart = function(event, toState, toParams, fromState, fromParams) {
      if(!toState.data || !toState.data.is_granted){
        return crAcl;
      }
      if(toState.data.is_granted[0] === "*"){
        return crAcl;
      }
      var is_allowed = (toState.data.is_granted !== undefined) ? toState.data.is_granted : ["ROLE_GUEST"];
      var isGranted = self.isGranted(crAcl.getRole(), is_allowed);
      return isGranted;
    };

    $rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams) {
        $injector.invoke(["$state", function($state) {
          var isGranted = afterChangeStart(event, toState, toParams, fromState, fromParams);

          if(!isGranted && self.redirect !== false){
            event.preventDefault();
            if(self.redirect != toState.name) {
              $state.go(self.redirect);
            }
          }
        }]);
    });

    $rootScope.$on('$routeChangeStart',  function(event, toState, toParams, fromState, fromParams) {
        $injector.invoke(["$location", function($location) {
          var isGranted = afterChangeStart(event, toState, toParams, fromState, fromParams);

          if(!isGranted && self.redirect !== false){
            event.preventDefault();
            if(self.redirect != toState.name) {
              $location.path(self.redirect);
            }
          }
        }]);
    });

    return crAcl;

  }];
}])
.directive("crGranted", ['crAcl', '$animate', function(acl, $animate){
  return {
    restrict: "A",
    replace: false,
    transclude: 'element',
    terminal: true,
    link: function(scope, elem, attr, ctrl, $transclude){
      var content = false;
      $transclude(function(clone, newScope) {
        childScope = newScope;
        clone[clone.length++] = document.createComment(' end crGranted: ' + attr.crGranted + ' ');
        block = {
          clone: clone
        };
        content = clone;
      });


      scope.$watch(function() {
        return acl.getRole();
      }, function(newV, oldV){
      var allowedRoles = attr.crGranted.split(",");
      if(allowedRoles.indexOf(acl.getRole()) != -1) {
        $animate.enter(content, elem.parent(), elem);
      }
      else {
        if(content) {
          content.remove();
        }
      }
      });
    }
  };
}]);
