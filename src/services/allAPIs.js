import commonAPI from "./commonAPI";
import { BASEURL } from "./baseURL";

export const userRegistrationAPI = async (user) => {
  // Fetch all users
  const response = await commonAPI("GET", `${BASEURL}/users`);

  // Ensure the data is an array
  const allUsers = response.data || [];

  // Check if email already exists
  const emailExists = allUsers.find(
    (existingUser) => existingUser.email === user.email
  );

  if (emailExists) {
    throw new Error("Email already exists!");
  }

  // Add new user
  return await commonAPI("POST", `${BASEURL}/users`, user);
};


export const userLoginAPI = async (credentials) => {
  // Fetch all registered users
  const response = await commonAPI("GET", `${BASEURL}/users`);
  const allUsers = response.data || [];

  // Find user by email
  const existingUser = allUsers.find(
    (user) => user.email === credentials.email
  );

  if (!existingUser) {
    throw new Error("Email not found! Please register first.");
  }

  if (existingUser.password !== credentials.password) {
    throw new Error("Invalid password! Please try again.");
  }

  // Return the full user object (contains id)
  return existingUser;
};




// Fetch all exercises for a user
export const getExercisesAPI = async (userId) => {
  return await commonAPI("GET", `${BASEURL}/exercises?userId=${userId}`);
};

// Add a new exercise
export const addExerciseAPI = async (exercise) => {
  return await commonAPI("POST", `${BASEURL}/exercises`, exercise);
};

// Update an existing exercise
export const updateExerciseAPI = async (id, exercise) => {
  return await commonAPI("PUT", `${BASEURL}/exercises/${id}`, exercise);
};

// Delete an exercise
export const deleteExerciseAPI = async (id) => {
  return await commonAPI("DELETE", `${BASEURL}/exercises/${id}`);
};