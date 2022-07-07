import { Input, Box, Button, Text, FormControl, Select, CheckIcon } from "native-base";
import { SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {register } from '../../services/security'

const form: Array<{
  type: "password" | "text" | "email" | "list" | "date";
  name: string;
  placeholder?: string;
  label: string;
  list?: Array<{ label: string; value: string }>;
  isRequired: boolean;
}> = [
  {
    name: "email",
    placeholder: "ejemplo@correo.com",
    type: "email",
    label: "Correo",
    isRequired: true,
  },
  {
    name: "firstName",
    type: "text",
    label: "Nombres",
    isRequired: true,
  },
  {
    name: "lastName",
    type: "text",
    label: "Apellidos",
    isRequired: true,
  },
  {
    name: "birthDate",
    isRequired: true,
    placeholder: "AAAA/MM/DD",
    type: "text",
    label: "Fecha Nacieminto",
  },
  {
    name: "gender",
    isRequired: true,
    type: "list",
    label: "Género",
    list: [
      { label: "Maculino", value: "M" },
      { label: "Feménino", value: "F" },
    ],
  },
  {
    name: "password",
    isRequired: true,
    placeholder: "coloque su contraseña",
    type: "password",
    label: "Contraseña",
  },
];

const Register = ({ navigation }: any) => {

    const [data,setData] = useState({})

    const sendData =async  ()=> {
       try {
           console.log(data);
           
            await register(data);
            navigation.navigate("Verify", { data });
       } catch (error) {
           console.error(error);     
       }
    }

  return (
    <>
      <Box alignItems="center" alignContent="center">
        <SafeAreaView>
          {form.map(
            ({ type, name, placeholder, list, label, isRequired }, index) => {
              let returnValue;
              if (type !== "list") {
                returnValue = (
                  <Input
                    type={type as "text" | "password"}
                    name={name}
                    placeholder={placeholder}
                    mx="3"
                    w="75%"
                    maxWidth="300px"
                    size="2xl"
                    margin={1}
                    key={index}
                    onChangeText={(value) =>
                      setData((current) => ({ ...current, [name]: value }))
                    }
                  />
                );
              } else if (type === "list") {
                returnValue = (
                  <Select
                    accessibilityLabel="Seleccione Género"
                    placeholder={placeholder}
                    w={300}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mx={1.5}
                    paddingBottom={3}
                    paddingTop={3}
                    key={index}
                    onValueChange={(value) =>
                      setData((current) => ({ ...current, [name]: value }))
                    }
                  >
                    {list?.map((item, index) => (
                      <Select.Item {...item} key={index} />
                    ))}
                  </Select>
                );
              }

              return (
                <FormControl isRequired={isRequired}>
                  <FormControl.Label>{label}</FormControl.Label>
                  {returnValue}
                </FormControl>
              );
            }
          )}

          <Text
            mx={3}
            color="blue.600"
            onPress={() => navigation.navigate("Login")}
          >
            Ya tienes una cuenta?
          </Text>
          <Button onPress={sendData} maxWidth="300px" mx="3" margin={3}>
            Registrarse
          </Button>
        </SafeAreaView>
      </Box>
    </>
  );
};

export default Register;
