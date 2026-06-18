import axiosClient from "./axiosClient";

// POST /users/signin creates a new account. The backend's CreateUserDto
// only accepts email, password, role, and an optional contactNo, so we
// build the payload explicitly to avoid forbidNonWhitelisted errors.
export const signupUser = async ({ email, password, role, contactNo }) => {
  const payload = { email, password, role };
  if (contactNo) {
    payload.contactNo = contactNo;
  }
  const response = await axiosClient.post("/users/signup", payload);
  return response.data;
};

// POST /users/login authenticates the user. The backend sets HttpOnly
// access_token and refresh_token cookies on success and returns the user
// object in the JSON body.
export const loginUser = async ({ email, password }) => {
  const response = await axiosClient.post("/users/signin", { email, password });
  return response.data;
};
