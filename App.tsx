import Login from "./components/login";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import React from "react";

// components
import Register from "./components/register";
import Menu from "./components/menu";
import Verify from "./components/verify";

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
    name: "verify",
    options: { title: "verificar Correo" },
  },
];

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>
          <Stack.Group
            screenOptions={({ navigation }) => ({
              headerLeft: () => <Menu />,
            })}
          >
            {routes.map((route) => (
              <Stack.Screen {...route} />
            ))}
          </Stack.Group>
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
