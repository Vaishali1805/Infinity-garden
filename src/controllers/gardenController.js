import { gardenList } from "../gardenList.js";

export const handleGardenList = async (req,res) => {
    const list = gardenList.map(({name}) => ({name}));
    // console.log("list: ",list)
    return res.status(200).json(list);
}