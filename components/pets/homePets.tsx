import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Radio,
  Spinner,
  Text,
  TextArea,
  View,
  Input,
  Select,
  Box,
  ScrollView,
} from "native-base";
import { deletePetRest, petsListRest, savePetRest } from "../../services/pets";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";
import { Alert, Dimensions } from "react-native";

const HomePets = () => {
  const [pets, setPets] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { width, height } = Dimensions.get("window");

  const listPets = useCallback(async () => {
    const responsePet = await petsListRest();
    setPets(() => {
      setIsLoad(false);
      return responsePet;
    });
  }, [isLoad]);

  useEffect(() => {
    listPets();
  }, [listPets]);

  const transformPetsTable = useCallback(() => {
    const x = pets.map(({ breed, size, ageRange, id, type, name }, index) => [
      [name],
      [breed],
      [`${ageRange} años`],
      [size],
      [type],
      [
        <Button key={index} onPress={() => deletePet(id, type, name)}>
          x
        </Button>,
      ],
    ]);

    return x;
  }, [pets]);

  const deletePet = useCallback( (id: string,type:string,name:string) => {
    Alert.alert("Borrado de mascota",`Seguro quiere borrar a mi ${type} ${name}?`,[
      {
        text:"Si",
        onPress:async ()=> {
           await deletePetRest(id);
           Alert.alert("No Hay vuelta Atras...","Mascota Borrada correctamente");
           listPets();
        }
      },
      {
        text:"No",
        onPress:()=>{
          Alert.alert("Maravilloso!!!","No se Borro Ninguna Mascota")
        }
      }
    ])
    
    
  }, []);

  return isLoad ? (
    <HStack
      space={8}
      justifyContent="center"
      alignItems="center"
      width="100%"
      position="absolute"
      left="220"
      top="300"
    >
      <Spinner size="lg" />
    </HStack>
  ) : (
    <>
      <View
        style={{
          flex: 1,
          padding: 16,
          paddingTop: 30,
          backgroundColor: "#fff",
          width,
        }}
      >
        {transformPetsTable().length ? (
          <ScrollView>
            <Text>Aquí encontrarás tus mascotas</Text>
            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
              <Row
                data={["Nombre","Raza", "Edad", "Tamaño","Soy un...", "Borrar"]}
                textStyle={{ margin: 6 }}
              />
              {transformPetsTable().map((t, index) => (
                <Row key={index} data={t} textStyle={{ margin: 6 }} />
              ))}
            </Table>
          </ScrollView>
        ) : (
          <>
            <Box
              paddingY={4}
              bg={{
                linearGradient: {
                  colors: ["lightBlue.300", "violet.800"],
                  start: [0, 0],
                  end: [1, 0],
                },
              }}
              p="12"
              rounded="xl"
              _text={{
                fontSize: "md",
                fontWeight: "medium",
                color: "warmGray.50",
                textAlign: "center",
              }}
            >
              <Text textAlign="center" fontSize="md">
                {" "}
                Aun No tienes Mascotas puedes Agregar Las que quieras...
              </Text>
            </Box>
          </>
        )}
      </View>

      <ModaladdPetModal
        show={showModal}
        setShow={setShowModal}
        refresh={listPets}
      />

      <Button onPress={() => setShowModal(true)}>Agregar Mascota</Button>
    </>
  );
};

const ModaladdPetModal = ({ show, setShow, refresh }: any) => {
  const [pet, setPet] = useState({});
  const [load, setLoad] = useState(false);

  const savePet = async () => {
    setLoad(true);
    if (Object.values(pet).length === 5) {
      const response = await savePetRest(pet);
      refresh();
      setShow(false);
    } else {
      alert("debe llenar todos los campos");
    }

    setLoad(false);
  };

  return (
    <>
      <Modal isOpen={show} onClose={setShow} size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Agregar un momento</Modal.Header>
          <Modal.Body>
            <Text>Agrega los datos de tu mascota</Text>
            <Input
              onChangeText={(name) => {
                setPet((current) => ({ ...current, name }));
              }}
              placeholder="Nombre"
              mt={5}
            ></Input>
            <Input
              onChangeText={(breed) => {
                setPet((current) => ({ ...current, breed }));
              }}
              placeholder="Raza"
              mb={5}
              mt={5}
            ></Input>
            <Select
              accessibilityLabel="Tamaño"
              placeholder="Tamaño"
              onValueChange={(size) => {
                setPet((current) => ({ ...current, size }));
              }}
            >
              <Select.Item label="Grande" value="grande" />
              <Select.Item label="Mediano" value="mediano" />
              <Select.Item label="Pequeño" value="pequeño" />
            </Select>

            <Select
              accessibilityLabel="Edad"
              placeholder="Edad"
              onValueChange={(ageRange) => {
                setPet((current) => ({ ...current, ageRange }));
              }}
              mt={5}
            >
              <Select.Item label="1-3 años" value="1-3" />
              <Select.Item label="3-6 años" value="3-6" />
              <Select.Item label="6-8 años" value="6-8" />
              <Select.Item label="8-13 años" value="8-13" />
              <Select.Item label="13-16 años" value="13-16" />
              <Select.Item label="16-+ años" value="16-30" />
            </Select>

            <Select
              accessibilityLabel="Mi mascota es ..."
              placeholder="Mi mascota es ..."
              onValueChange={(type) => {
                setPet((current) => ({ ...current, type }));
              }}
              mb={5}
              mt={3}
            >
              <Select.Item label="Perro" value="perro" />
              <Select.Item label="Gato" value="gato" />
            </Select>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setLoad(false);
                  setShow(false);
                }}
              >
                cancelar
              </Button>
              <Button isLoading={load} onPress={savePet}>
                guardar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>{" "}
      </Modal>
    </>
  );
};

export default HomePets;
