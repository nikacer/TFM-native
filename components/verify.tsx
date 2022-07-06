import { Input, Box, Button, Text } from "native-base";
import { SafeAreaView } from "react-native";

const Verify = ({ navigation, route }: any) => {
  return (
    <>
      <Box alignItems="center" alignContent="center">
        <SafeAreaView>
          <Input
            mx="3"
            type="text"
            placeholder="digite código"
            w="75%"
            maxWidth="300px"
            size="2xl"
            margin={3}
          />
          <Button
            onPress={() => console.log("hello world")}
            maxWidth="300px"
            mx="3"
            margin={3}
          >
            Confirmar
          </Button>
        </SafeAreaView>
      </Box>
    </>
  );
};

export default Verify;
