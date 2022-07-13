import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const basePath = "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev";

const list = async (): Promise<IActivities[]> => {
  const {
    data: { data: {Items} },
  } = await axios.get(`${basePath}/activities/list`);
  await AsyncStorage.setItem("activities", JSON.stringify(Items));
  return Items;
};

interface IActivities {
  id: string;
  description: string;
  name: string;
}

export { list as activitiesList, IActivities };
