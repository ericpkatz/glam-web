describe('a test', function(){
  it('true is true', ()=>{
    expect(true).to.be.true;
  });
  it('`${5 * 5}` is "25"', ()=>{
    expect(`${ 5 * 5}`).to.equal('25');
  });
});
