import axios from 'axios'


const basePath = "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev"
const login = async ({ email, password }) =>
  axios.post(`${basePath}/users/login`,{email,password});


  export {
      login
  }