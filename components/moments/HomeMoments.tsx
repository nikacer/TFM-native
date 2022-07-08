import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Linking, Platform, StyleSheet, View } from "react-native";
import MapView, { AnimatedRegion, Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject, LocationObjectCoords } from "expo-location";
import { AlertComponent } from "../common/AlertComponent";
import {
  Button,
  Input,
  Modal,
  Radio,
  ScrollView,
  Select,
  Text,
  TextArea,
} from "native-base";
import { activitiesList, IActivities } from "../../services/activities";
import { addMomentRest, IMoment, listMoment } from "../../services/moments";

const HomeMoments = () => {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [perimeter, setPerimeter] = useState(0.01);
  const [addMoment, setAddMoment] = useState(false);
  const [commnetMoment, setCommentMoment] = useState(false);
  const [activities, setActivities] = useState<Array<IActivities>>([]);
  const [newMoment, setNewMoment] = useState<IMoment | {}>({});
  const [markers, setMarkers] = useState([]);

  const transformLocation = () =>
    location
      ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: location.coords.latitudeDelta,
          longitudeDelta: location.coords.longitudeDelta,
        }
      : undefined;

  const obtainLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("No aprobastes los permisos :(");
      return;
    }

    Location.watchPositionAsync(
      {
        distanceInterval: 10,
        accuracy: Location.Accuracy.High,
      },
      (currentLocation) => {
        console.log(location);

        setLocation({
          ...currentLocation,
          coords: {
            ...currentLocation.coords,
            latitudeDelta: perimeter,
            longitudeDelta: perimeter / 2,
          },
        });
      }
    );
  }, []);

  const obtainActivities = useCallback(async () => {
    const activities = await activitiesList();
    console.log(activities);

    // setActivities(activities);
  }, []);

  const momentList = useCallback(async () => {
    const responseMoment = await listMoment();
    setMarkers(responseMoment ? responseMoment : []);
  }, []);

  useEffect(() => {
    const objectLocation = transformLocation();
    if (objectLocation) new AnimatedRegion(objectLocation);
  }, [perimeter]);

  useEffect(() => {
    obtainLocation();
    obtainActivities();
  }, [obtainLocation, obtainActivities]);

  useEffect(() => {
    momentList();
  }, [momentList]);

  const addMomentModal = (evt: number[]) => {
    setNewMoment((current) => ({ ...current, location: evt }));
    setAddMoment(true);
  };

  const saveMoment = async () => {
    await addMomentRest(newMoment);
    momentList();
  };

  const openMap = ({ latitude, longitude, label }: any) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "waze:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;

    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) Linking.openURL(url);
  };

  // const ASPECT_RATIO = width / height;
  // const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const ModalAddMoment = () => (
    <Modal isOpen={addMoment} onClose={setAddMoment} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Agregar un momento</Modal.Header>
        <Modal.Body>
          <Text marginBottom={5}>
            Agrega este momento, recurda que el nombre que le ingreses será el
            que todos los usuarios vean
          </Text>
          <Input
            marginBottom={5}
            placeholder="Nombre del momento"
            onChangeText={(text) =>
              setNewMoment((currentmoment) => ({
                ...currentmoment,
                name: text,
              }))
            }
          />
          <Select
            accessibilityLabel="Seleccione Actividad"
            placeholder="Seleccione Actividad"
            onValueChange={(text) =>
              setNewMoment((currentmoment) => ({
                ...currentmoment,
                activity: text,
              }))
            }
          >
            {activities.map((activity) => (
              <Select.Item
                label={activity.name}
                value={activity.name}
                key={activity.id}
              />
            ))}
          </Select>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setAddMoment(false);
              }}
            >
              cancelar
            </Button>
            <Button
              onPress={() => {
                saveMoment();
                setAddMoment(false);
              }}
            >
              guardar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );

  const ModalCommentModal = () => (
    <>
      <Modal isOpen={commnetMoment} onClose={setCommentMoment} size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Agregar un momento</Modal.Header>
          <Modal.Body>
            <Text>Agrega un comentario de tu experiencia</Text>
            <TextArea autoCompleteType={false}></TextArea>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              onChange={(nextValue) => {
                console.log(nextValue);
              }}
            >
              <Radio value="0" my={1}>
                0
              </Radio>
              <Radio value="1" my={1}>
                1
              </Radio>
              <Radio value="2" my={1}>
                2
              </Radio>
              <Radio value="3" my={1}>
                3
              </Radio>
              <Radio value="4" my={1}>
                4
              </Radio>
            </Radio.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setCommentMoment(false);
                }}
              >
                cancelar
              </Button>
              <Button
                onPress={() => {
                  setCommentMoment(false);
                }}
              >
                guardar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>{" "}
      </Modal>
    </>
  );

  return (
    <>
      <ModalAddMoment />
      <ModalCommentModal/>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={transformLocation()}
          zoomControlEnabled={true}
          showsMyLocationButton={true}
          showsUserLocation={true}
        >
          {markers.map((marker: any) => {
            if (
              marker &&
              marker.location &&
              marker.location[0] !== location.coords.latitude &&
              marker.location[1] !== location.coords.longitude
            ) {
              return (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.location[0],
                    longitude: marker.location[1],
                  }}
                  title={marker.name}
                >
                  <Callout>
                    <View
                      style={{
                        height: 70,
                        width: 250,
                        flexDirection: "row",
                        marginBottom: 10,
                      }}
                    >
                      <Button
                        borderRadius="0"
                        w="50%"
                        borderColor="white"
                        borderWidth={1}
                        onPress={() => {
                          openMap({
                            latitude: marker.location[0].toString(),
                            longitude: marker.location[1].toString(),
                            label: marker.name,
                          });
                        }}
                      >
                        Ir
                      </Button>
                      <Button
                        borderRadius="0"
                        w="50%"
                        borderColor="white"
                        borderWidth={1}
                        onPress={()=>{
                            setCommentMoment(true)
                        }}
                      >
                        Comentar
                      </Button>
                    </View>
                  </Callout>
                </Marker>
              );
            }
          })}

          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"tu estas Aquí"}
            pinColor={"purple"}
            onPress={() =>
              addMomentModal([
                location.coords.latitude,
                location.coords.longitude,
              ])
            }
          />
        </MapView>
      ) : (
        <>{errorMsg && <AlertComponent status="error" text={errorMsg} />}</>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height - 180,
  },
});

export default HomeMoments;

interface ILocation extends LocationObject {
  coords: newCoords;
}

interface newCoords extends LocationObjectCoords {
  latitudeDelta: number;
  longitudeDelta: number;
}
