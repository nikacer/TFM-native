import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";




const basePath = "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev"

const validateAccess = async () => ({
  jwtToken: await AsyncStorage.getItem("jwtToken"),
  user: JSON.parse(await AsyncStorage.getItem("user")),
});

const login = async ({ email, password }) =>
  axios.post(`${basePath}/users/login`,{email,password});


  export {
      login,
      validateAccess
  }