import axios from "axios";
import { validateAccess } from "./security";

const basePath =
  "https://hyhjn44h7b.execute-api.us-east-2.amazonaws.com/dev/pets";


const petsList = async () => {
    try {
        const dataUser = await validateAccess();
        return (await axios.post(
          `${basePath}/list`,
          {},
          {
            headers: { Authorization: `Bearer ${dataUser.token}` },
          }
        )).data.Items;
    } catch (error) {
        return []
    }
};

const savePetRest = async (pet: any) => {
  const dataUser = await validateAccess();
  return await axios.post(
    `${basePath}/add`,
    pet,
    {
      headers: { Authorization: `Bearer ${dataUser.token}` },
    }
  );
};

const deletePetRest = async (id:string) => {
  const dataUser = await validateAccess();
  return await axios.delete(`${basePath}/del/${ id }`, {
    headers: { Authorization: `Bearer ${dataUser.token}` },
  });
};

export { petsList as petsListRest, savePetRest, deletePetRest };
