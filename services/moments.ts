import axios from "axios";
import { validateAccess } from "./security";

const basePath = "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev/moments";

const addMoment = async (moment: IMoment | {}) => {
  const dataUser = await validateAccess();
  return axios.post(`${basePath}/add`, moment, {
    headers: { Authorization: `Bearer ${dataUser.token}` },
  });
};

const listMoment = async () => {
    try {
        const dataUser = await validateAccess();
        const {data:{data:{Items}}} = await axios.post(`${basePath}/search`,{}, {
          headers: { Authorization: `Bearer ${dataUser.token}` },
        });
        return Items;
    } catch (error) {
        console.error(error);
        return []
        
    }
};

export { addMoment as addMomentRest,listMoment, IMoment };

interface IMoment {
  name: string;
  location: number[];
  activity: string;
  id?: string;
}
