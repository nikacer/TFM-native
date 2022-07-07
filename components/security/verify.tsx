import { Input, Box, Button, Text } from "native-base";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

import { verify } from "../../services/security";

const Verify = ({ navigation, route }: any) => {
  const [data, setData] = useState<{ code: string }>({ code: "" });

  const sendForm = async () => {
    try {
      console.warn({ ...data, email: route.params.data.email });
      if (!data.code) {
        await verify({ ...data, email: route.params.data.email });
        navigation.navigate("Login", {
          message: {
            text: "cuenta creada correctamente, puedes acceder normalmente",
            status: "success",
          },
        });
      } else console.warn("code no agregado");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box alignItems="center" alignContent="center">
        <SafeAreaView>
          <Text
            fontSize={15}
            margin={3}
            marginTop={5}
            maxWidth="300px"
            alignItems="center"
          >
            Enviamos un código a tu correo electrónico,{" "}
            {route.params.data.email} cuando lo tengas agregalo aquí
          </Text>
          <Input
            mx="3"
            type="text"
            placeholder="digite código"
            w="75%"
            maxWidth="300px"
            size="2xl"
            margin={3}
            onChangeText={(code) =>
              setData((current) => ({ ...current, code }))
            }
          />
          <Button onPress={sendForm} maxWidth="300px" mx="3" margin={3}>
            Confirmar
          </Button>
        </SafeAreaView>
      </Box>
    </>
  );
};

export default Verify;
