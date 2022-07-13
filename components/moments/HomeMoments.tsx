import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, {
  AnimatedRegion,
  Callout,
  Marker,
  CalloutSubview,
} from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject, LocationObjectCoords } from "expo-location";
import { AlertComponent } from "../common/AlertComponent";
import {
  Alert,
  Button,
  FlatList,
  FormControl,
  Input,
  Modal,
  Radio,
  ScrollView,
  Select,
  Text,
  TextArea,
  View,
} from "native-base";
import { activitiesList, IActivities } from "../../services/activities";
import {
  addMomentRest,
  commentMomentRest,
  IMoment,
  listMoment,
} from "../../services/moments";
import { background } from "native-base/lib/typescript/theme/styled-system";

const HomeMoments = () => {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [perimeter, setPerimeter] = useState(0.01);
  const [addMoment, setAddMoment] = useState(false);
  const [commnetMoment, setCommentMoment] = useState(false);
  const [activities, setActivities] = useState<Array<IActivities>>([]);
  const [newMoment, setNewMoment] = useState<IMoment | {}>({});
  const [newComment, setNewComment] = useState<any>({});
  const [markers, setMarkers] = useState([]);
  const [markerSelected, setMarkerSelected] = useState<any>(null);

  const transformLocation = () =>
    location
      ? {
          latitude: Number(location.coords.latitude),
          longitude: Number(location.coords.longitude),
          latitudeDelta: Number(location.coords.latitudeDelta),
          longitudeDelta: Number(location.coords.longitudeDelta),
        }
      : undefined;

  const obtainLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("No aprobastes los permisos :(");
      return;
    }

    const positionSubscription = await Location.watchPositionAsync(
      {
        distanceInterval: 10,
        accuracy: Location.Accuracy.High,
      },
      (currentLocation) => {
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

    return () => {
      positionSubscription.remove();
    };
  }, []);

  const obtainActivities = useCallback(async () => {
    if (!activities.length) {
      const activitiesResponse: any = await activitiesList();
      setActivities(activitiesResponse);
    }
  }, []);

  const momentList = useCallback(async () => {
    const responseMoment = await listMoment();
    console.log(responseMoment);
    
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

  const openMap = ({ latitude, longitude, label }: any) => {
    const scheme = Platform.select({
      ios: "maps:?q=",
      android: "geo:?q=",
    });
    const latLng = `${latitude},${longitude}`;

    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) Linking.openURL(url);
  };

  const optionsMap = [
    {
      label: "IR",
      callback: (marker: any) => {
        openMap({
          latitude: Number(marker.location[0]),
          longitude: Number(marker.location[1]),
          label: marker.name,
        });
      },
    },
    {
      label: "Comentar",
      callback: ({ id }: { id: string }) => {
        setNewComment(() => ({ id, rate: 4 }));
        setCommentMoment(true);
      },
    },
  ];

  return (
    <>
      <ModalAddMoment
        {...{
          addMoment,
          setAddMoment,
          activities,
          momentList,
          newMoment,
          setNewMoment,
        }}
      />
      <ModalCommentModal
        {...{ newComment, setNewComment, commnetMoment, setCommentMoment }}
      />
      {location ? (
        <>
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
                      latitude: Number(marker.location[0]),
                      longitude: Number(marker.location[1]),
                    }}
                    onPress={() => {
                      setMarkerSelected(marker);
                    }}
                  ></Marker>
                );
              }
            })}

            <Marker
              coordinate={{
                latitude: Number(location.coords.latitude),
                longitude: Number(location.coords.longitude),
              }}
              pinColor={"purple"}
              onPress={() =>
                addMomentModal([
                  location.coords.latitude,
                  location.coords.longitude,
                ])
              }
            />
          </MapView>
          {markerSelected && (
            <View
              style={{ position: "absolute", bottom: 0 }}
              w="100%"
              h="150"
              backgroundColor="blueGray.200"
            >
              <Text
                textAlign="center"
                fontSize="lg"
                style={{ marginTop: 25, marginBottom: 20 }}
              >
                {markerSelected.name}
              </Text>
              <Text
                position="absolute"
                right="0"
                fontSize="lg"
                padding={5}
                onPress={() => setMarkerSelected(null)}
              >
                X
              </Text>
              <View flex="0.7" flexDirection="row" opacity="0.8">
                {optionsMap.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      flex="0.5"
                      onPress={() => item.callback(markerSelected)}
                      borderColor="white"
                      borderWidth={1}
                      borderRadius="0"
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </View>
            </View>
          )}
        </>
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

const ModalAddMoment = ({
  addMoment,
  setAddMoment,
  activities,
  momentList,
  newMoment,
  setNewMoment,
}: any) => {
  const [loading, setLoading] = useState(false);
  const saveMoment = async () => {
    setLoading(true);
    await addMomentRest(newMoment);
    setLoading(false);
    setAddMoment(false);
    momentList();
  };
  return (
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
              setNewMoment((currentmoment: any) => ({
                ...currentmoment,
                name: text,
              }))
            }
          />
          <Select
            accessibilityLabel="Seleccione Actividad"
            placeholder="Seleccione Actividad"
            onValueChange={(text) =>
              setNewMoment((currentmoment: any) => ({
                ...currentmoment,
                activity: text,
              }))
            }
          >
            {activities.map((activity: any) => (
              <Select.Item
                label={`${activity.name} - ${activity.description}`}
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
              isLoading={loading}
              onPress={async () => {
                saveMoment();
              }}
            >
              guardar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const ModalCommentModal = ({
  newComment,
  commnetMoment,
  setNewComment,
  setCommentMoment,
}: any) => {
  const [loading, setLoading] = useState(false);
  const saveComment = async () => {
    if (newComment && Object.values(newComment).length === 3) {
      setLoading(true);
      const id = newComment.id;
      delete newComment.id;
      await commentMomentRest(id, {
        ...newComment,
        rate: Number(newComment.rate),
      });
      setCommentMoment(false);
      setNewComment({});
      setLoading(false);
    } else {
      alert("llene todos los campos");
    }
  };

  return (
    <>
      <Modal isOpen={commnetMoment} onClose={setCommentMoment} size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Agregar un momento</Modal.Header>
          <Modal.Body>
            <Text>Agrega un comentario de tu experiencia</Text>
            <TextArea
              autoCompleteType="off"
              mb={10}
              mt={5}
              onChangeText={(comment) => {
                setNewComment((current: any) => ({ ...current, comment }));
              }}
            ></TextArea>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              onChange={(rate) => {
                setNewComment((current: any) => ({ ...current, rate }));
              }}
              defaultValue="4"
            >
              <Radio value="0" my={1}>
                El Lugar no existe
              </Radio>
              <Radio value="1" my={1}>
                No cumplio con mis espectativas
              </Radio>
              <Radio value="2" my={1}>
                Aceptaban a mi mascota, pero no la actividad que referenciaba
              </Radio>
              <Radio value="3" my={1}>
                pude hacer la actividad, pero no me sentí satisfecho
              </Radio>
              <Radio value="4" my={1}>
                Cumple con todas las espectativas
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
                isLoading={loading}
                onPress={() => {
                  saveComment();
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
};
