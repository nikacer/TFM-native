import Login from "./components/security/login";
import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Box, NativeBaseProvider } from "native-base";
import React, { useCallback, useEffect, useState } from "react";

// components
import Register from "./components/security/register";
import Menu from "./components/menu";
import Verify from "./components/security/verify";
import Home from "./components/generals/Home";

const routes = [
  {
    component: Login,
    name: "Login",
    options: { title: "Inicio de Sessión" },
  },
  {
    component: Register,
    name: "Register",
    options: { title: "Registrarse" },
  },
  {
    component: Verify,
    name: "Verify",
    options: { title: "verificar Correo" },
  },
  {
    component: Home,
    name: "Home",
    options: { title: "Tablero" },
  },
];

const Stack = createNativeStackNavigator();




export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Box paddingTop={15} flex={1}>
          <Stack.Navigator>
            <Stack.Group
              screenOptions={({ navigation }) => ({
                headerLeft: () => <Menu navigation={navigation} />,
              })}
            >
              {routes.map((route, index) => (
                <Stack.Screen {...route} key={index}/>
              ))}
            </Stack.Group>
          </Stack.Navigator>
        </Box>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
