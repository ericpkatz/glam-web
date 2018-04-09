describe('a test', function(){
  beforeEach(module('glamsquad'));
  describe('FIZZ BUZZ', ()=> {
    let FizzBuzzService;
    beforeEach(inject(function(_FizzBuzzService_){
      FizzBuzzService = _FizzBuzzService_;
    }));
    it('FizzBuzz exists', ()=> {
      expect(FizzBuzzService.fizz).to.equal('buzz');
    });
  });
});
