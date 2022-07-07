import axios from "axios";
import { validateAccess } from "./security";

const basePath = "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev";

const addMoment = async (moment: IMoment | {}) => {
  const dataUser = await validateAccess();
  axios.post(`${basePath}/moments/add`, moment, {
    headers: { Authorization: `Bearer ${dataUser.token}` },
  });
};

export { addMoment as addMomentRest, IMoment };

interface IMoment {
  name: string;
  location: string[];
  activity: string;
  id?: string;
}
