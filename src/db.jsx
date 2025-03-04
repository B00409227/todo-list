// db.js
// W07 - This file is all new
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("todo-photos");

db.version(1).stores({
  photos: "id", // Primary key, don't index photos
});

async function addPhoto(id, imgSrc) {
  if (!imgSrc) {
    console.log("No image source provided");
    return;
  }
  
  try {
    // Add the new photo with id used as key for todo array in localStorage
    const i = await db.photos.add({
      id: id,
      imgSrc: imgSrc,
    });
    console.log(`Photo successfully added. Got id ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
}

function GetPhotoSrc(id) {
  console.log("getPhotoSrc", id);
  const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
  console.table(img);
  if (Array.isArray(img) && img.length > 0) return img[0].imgSrc;
  return null; // Return null if no photo is found
}

export { addPhoto, GetPhotoSrc };
