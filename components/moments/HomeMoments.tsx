import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject, LocationObjectCoords } from "expo-location";
import { AlertComponent } from "../common/AlertComponent";
import { Button, Input, Modal, ScrollView, Select, Text } from "native-base";
import { activitiesList, IActivities } from "../../services/activities";
import { addMomentRest, IMoment } from "../../services/moments";

const HomeMoments = () => {
  const [location, setLocation] = useState<ILocation>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [perimeter, setPerimeter] = useState(0.05);
  const [addMoment, setAddMoment] = useState(false);
  const [activities, setActivities] = useState<Array<IActivities>>([]);
  const [newMoment, setNewMoment] = useState<IMoment | {}>({});

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

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      ...location,
      coords: {
        ...location.coords,
        latitudeDelta: perimeter,
        longitudeDelta: perimeter / 2,
      },
    });
  }, []);

  const obtainActivities = useCallback(async () => {
    const activities = await activitiesList();
    setActivities(activities);
  }, []);

  useEffect(() => {
    const objectLocation = transformLocation();
    if (objectLocation) new AnimatedRegion(objectLocation);
  }, [perimeter]);

  useEffect(() => {
    obtainLocation();
    obtainActivities();
  }, [obtainLocation, obtainActivities]);

  const addMomentModal = (evt: number[]) => {
    setNewMoment((current) => ({ ...current, location: evt }));
    setAddMoment(true);
  };

  const saveMoment = async () => {
    await addMomentRest(newMoment);
  };

  // const ASPECT_RATIO = width / height;
  // const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  return (
    <>
      <Modal isOpen={addMoment} onClose={setAddMoment} size="md">
        <Modal.Content maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Agregar un momento</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Input
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
            </ScrollView>
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
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={transformLocation()}
          zoomControlEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"title"}
            description={"description"}
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
    width: Dimensions.get("screen").width - 20,
    height: Dimensions.get("screen").height - 300,
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
