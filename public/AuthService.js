app.service('AuthService', function($http, $state){
  //DONT CLOBBER ME
  const user = {
  };

  const exhangeTokenForUser = (token)=> {
    return $http.get(`/api/sessions/${token}`)
    .then( response => response.data)
    .then( (_user) => angular.copy(_user, user))
  };

  const authenticate = (credentials)=> {
    $http.post('/api/sessions', credentials)
      .then( response => response.data)
      .then( data => {
        const { token } = data;
        window.localStorage.setItem('token', token);
        return token;
      })
      .then( token  => exhangeTokenForUser(token)) 
      .then(()=> $state.go('appointments')); 
  };

  const logout = ()=> {
    window.localStorage.removeItem('token');
    angular.copy({}, user);
    $state.go('login');
  }

  const attemptLoginFromToken = ()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      exhangeTokenForUser(token);
    }
  }
  return {
    user,
    authenticate,
    attemptLoginFromToken,
    logout
  };
});
