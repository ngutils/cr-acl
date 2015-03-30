describe('crGranted directive', function() {
  var $compile,
      element,
      $scope;

  beforeEach(module('ui.router'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('cr.acl'));

  afterEach(function() {
    delete element;
  });

  beforeEach(inject(function(_$compile_, _$rootScope_, _crAcl_){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
    element = $compile('<div></div>')($scope);
  }));

  it("My role is granted", function(){
    element.append($compile("<div cr-granted='ROLE_GUEST'>Ciao</div>")($scope));
    $scope.$apply();
    expect(element.html()).toContain("Ciao");
  });

  it("I am not granted", function(){
    element.append($compile("<div cr-granted='ROLE_USER'>Ciao</div>")($scope));
    $scope.$apply();
    expect(element.html()).not.toContain("Ciao");
  });

});
