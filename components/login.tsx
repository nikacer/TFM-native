import {
  Input,
  Box,
  Button,
  Text
} from "native-base";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { login, validateAccess } from "../services/security";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = ({ navigation, route }:any) => {
  const [form, setForm] = useState({} as {email:string, password:string})
  const [error, setError]= useState()

  const changeDataForm = (value: any, key: string) => {
      setForm((current) => ({ ...current, [key]: value }));
      
  }

  const loginPOST = async ()=>{
    try {
      const { data } = await login(form);
      await AsyncStorage.setItem("user", JSON.stringify(data.payload));
      await AsyncStorage.setItem("jwtToken", data.jwtToken);

      console.log(await validateAccess());
      
    } catch (error:any) {
      console.error(error);
      
      setError(error)
    }
    
  }
  return (
    <>
      <Box alignItems="center" alignContent="center">
        <SafeAreaView>
          <Input
            mx="3"
            placeholder="Correo Electrónico"
            w="75%"
            maxWidth="300px"
            size="2xl"
            margin={1}
            onChangeText={(evt) => changeDataForm(evt.toLowerCase(), "email")}
          />
          <Input
            mx="3"
            type="password"
            placeholder="contraseña"
            w="75%"
            maxWidth="300px"
            size="2xl"
            margin={3}
            onChangeText={(evt) => changeDataForm(evt, "password")}
          />
          <Text
            mx={3}
            color="blue.600"
            onPress={() => navigation.navigate("Register")}
          >
            {" "}
            No tienes una cuenta? Registrate aquí
          </Text>
          <Button
            maxWidth="300px"
            mx="3"
            margin={3}
            onPress={loginPOST}
          >
            Acceder
          </Button>
        </SafeAreaView>
      </Box>
    </>
  );
};

export default Login
