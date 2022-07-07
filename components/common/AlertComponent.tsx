import { Text, Alert, HStack, VStack, IconButton, CloseIcon } from "native-base";
import React, { useState } from "react";

export const AlertComponent = ({ status, text }: any) => {

    const [hidden, setHidden] = useState(false)

  return !hidden ? <Alert status={status} marginY={5}>
    <VStack space={2} flexShrink={1} w="100%">
      <HStack flexShrink={1} space={2} justifyContent="space-between">
        <HStack space={2} flexShrink={1}>
          <Alert.Icon mt="1" />
          <Text>{text}</Text>
        </HStack>
        <IconButton
          variant="unstyled"
          _focus={{
            borderWidth: 0,
          }}
          icon={<CloseIcon size="3" color="coolGray.600" />}
          onPress={()=>setHidden(!hidden)}
        />
      </HStack>
    </VStack>
  </Alert> : <></>
};
