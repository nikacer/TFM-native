import {
  Input,
  Box,
  Button,
  Text,
} from "native-base";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { login, createAccess, validateAccess } from "../../services/security";
import { AlertComponent } from "../common/AlertComponent";


const Login = ({ navigation, route }:any) => {
  const [form, setForm] = useState({} as {email:string, password:string})
  const [error, setError]= useState()

  const changeDataForm = (value: any, key: string) => {
      setForm((current) => ({ ...current, [key]: value }));
      
  }
  

  const loginPOST = async ()=>{
    try {
      const { data } = await login(form);
      const response = await createAccess(data)  
      navigation.navigate("Home") 
    } catch (error:any) {
      console.error(error);
      setError(error)
    }
    
  }
  return (
    <>
      {route?.params?.message && <AlertComponent {...route.params.message} />}
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
            variant="subtle"
          >
            Acceder
          </Button>
        </SafeAreaView>
      </Box>
    </>
  );
};

export default Login
