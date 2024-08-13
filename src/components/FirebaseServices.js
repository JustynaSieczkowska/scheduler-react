import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

const addEvents = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, "events"), eventData);
    console.log("Wydarzenie zapisane z ID: ", docRef.id);
  } catch (e) {
    console.error("Błąd podczas zapisywania wydarzenia: ", e);
  }
};

export { addEvents };

const getEvents = async () => {
  const querySnapshot = await getDocs(collection(db, "events"));
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
};

export { getEvents };
