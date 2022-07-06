import { Menu, Box, Pressable, HamburgerIcon, Actionsheet, useDisclose, Button } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";

const MenuComponent = () => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  return (
    <SafeAreaView>
      <Button onPress={onOpen} background="white"><HamburgerIcon /></Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item>Item</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </SafeAreaView>
  );
}

export default MenuComponent;
