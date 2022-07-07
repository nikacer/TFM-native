import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";




const basePath = "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev"
const storageName = {
  token: "token",
  user:"user"
};


const validateAccess = async () => {
  const obtainParameter = await AsyncStorage.getItem(storageName.user)
  const response = obtainParameter ? JSON.parse(obtainParameter) : null;
  return response
};

const createAccess = async ({payload:user, jwtToken:token}: any) =>{
  try {
    await AsyncStorage.setItem(storageName.user, JSON.stringify({user,token}));
    return { user, token };
  } catch (error) {
    console.error(error);
    
  }
}

const login = ({ email, password }:any) =>
  axios.post(`${basePath}/users/login`,{email,password});

 const register = (data:any) =>
   axios.post(`${basePath}/users/register`, data); 

   const verify = (data:{email:string,code:string}) =>
     axios.post(`${basePath}/users/verify`, data); 


  export {
      login,
      validateAccess,
      register,
      verify,
      createAccess
  }