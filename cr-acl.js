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

  this.$get = ['$q', '$rootScope', '$state', function($q, $rootScope, $state){
    var crAcl = {};

    crAcl.setInheritanceRoles = function(roles){
        angular.forEach(roles, function(inheritance, roleName){
        if(roleName == "ROLE_USER" && roleName == "ROLE_GUEST"){
            throw roleName+" is a reserved world because is a father of ROLE, you can not override it";
        }
        self.roles[roleName] = inheritance;
        });
    };

    crAcl.setRedirect = function(redirectStateName){
        self.redirect = redirectStateName;
    };

    crAcl.setRole = function(role){
        self.identityRole = role;
    };

    crAcl.getRole = function(){
        if(self.identityRole === undefined){
          return "ROLE_GUEST";
        }
        return self.identityRole;
    };


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(!toState.data || !toState.data.is_granted){
        return crAcl;
      }
      if(toState.data.is_granted[0] === "*"){
        return crAcl;
      }
      var is_allowed = (toState.data.is_granted !== undefined) ? toState.data.is_granted : ["ROLE_GUEST"];
      var isGranted = self.isGranted(crAcl.getRole(), is_allowed);

      if(!isGranted && self.redirect !== false){
        event.preventDefault();
        if(self.redirect != toState.name) {
          $state.go(self.redirect);
        }
      }
    });

    return crAcl;

  }];
}]);
