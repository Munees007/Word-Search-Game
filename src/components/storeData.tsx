import { ref, set, get ,update} from "firebase/database";
import { db } from "../firebase"; // Adjust the import path based on your project structure
import  {FormData,UserData,GameData} from "../types/type";

const submitFormData = async (formData: FormData, gameData: any) => {
  try {
    const rollNumberKey = formData.rollNumber;

    // Reference to the users node in Firebase database
    const userRef = ref(db, `users/${rollNumberKey}`);

    // Check if the roll number already exists
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      return 'Duplicate';
    }

    // If roll number does not exist, proceed to store the new user data
    await set(userRef, {
      date:Date.now(),
      formData,
      gameData,
    });

    console.log('Form data and game data submitted successfully.');
  } catch (error) {
    console.error('Error submitting form and game data:', error);
    // Handle error, such as notifying the user or logging more details.
  }
};
const updateGameData = async (rollNumber: string, gameData: GameData) => {
  try {
    const userRef = ref(db, `users/${rollNumber}/gameData`);
    await update(userRef, gameData);
    console.log('Game data updated successfully.');
  } catch (error) {
    console.error('Error updating game data:', error);
    throw error;
  }
};
const getAllUserData = async () => {
  try {
    const usersRef = ref(db, 'users');
    
    const usersSnapshot = await get(usersRef);
    
    if (usersSnapshot.exists()) {
      return usersSnapshot.val();
    } else {
      throw new Error('No users found');
    }
  } catch (error) {
    console.error('Error fetching all user data:', error);
    throw error;
  }
};

const addDate = async (users:UserData[])=>{
  try{
    const timestamp = new Date("2024-07-26T00:00:00").getTime();
    const updates: Record<string, any> = {};
      users.map((data)=>{
        const path = `users/${data.formData.rollNumber}/date`
        updates[path] = timestamp;
      })

      await update(ref(db),updates);
  }
  catch(error){

  }
}
const getFlagData = async ():Promise<boolean>=>{
  try {
    const userRef = ref(db,'flag');

    const usersSnapshot = await get(userRef);

    if(usersSnapshot.exists())
    {
        console.log(usersSnapshot.val())
        return usersSnapshot.val();
      } else {
        throw new Error('No users found');
      }
    } catch (error) {
      console.error('Error fetching all user data:', error);
      throw error;
    }
};

const setFlagData = async (val:boolean)=>{
  try {
      const userRef = ref(db,'flag');

      await set(userRef,val);

      console.log("timer started successfully");
  } catch (error) {
      console.log(error)
  }
};


export { submitFormData,updateGameData,getAllUserData,getFlagData,setFlagData,addDate};
