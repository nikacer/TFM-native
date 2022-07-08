import { Menu, Box, Pressable, HamburgerIcon, Actionsheet, useDisclose, Button } from "native-base";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";

const MenuComponent = ({ navigation }: any) => {
  const { isOpen, onOpen, onClose } = useDisclose();

  const changePath = (path:string) => {
    navigation.navigate(path)
    onClose()
  }

  return (
    <SafeAreaView>
      <Button onPress={onOpen} background="white">
        <HamburgerIcon />
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={() => changePath("Login")}>
            Acceder
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => changePath("Register")}>
            Registro
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </SafeAreaView>
  );
};

export default MenuComponent;
