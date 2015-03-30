describe("CrAcl is initializable", function(){

  beforeEach(function(){
      module('cr.acl');
  });

  it('Exists a config object', inject(["cr-acl.config", function(config) {
      expect(config).toBeDefined();
  }]));
});
