import axiosClient from "./axiosClient";

// POST /users/signup creates a new account. The backend's CreateUserDto
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

// POST /users/signin authenticates the user. The backend sets HttpOnly
// access_token and refresh_token cookies on success and returns the user
// object in the JSON body. `rememberMe` controls whether the refresh cookie
// is persistent (survives browser restarts) or a session cookie.
export const loginUser = async ({ email, password, rememberMe }) => {
  const response = await axiosClient.post("/users/signin", {
    email,
    password,
    rememberMe: Boolean(rememberMe),
  });
  return response.data;
};

// POST /users/refresh trades a valid refresh cookie for a fresh access +
// refresh pair. Used by the axios interceptor to silently recover from 401s
// without forcing the user back to the login screen.
export const refreshSession = async () => {
  const response = await axiosClient.post("/users/refresh");
  return response.data;
};

// GET /users/profile returns the currently authenticated user. Called on
// app boot so we can rehydrate the React auth state from the HttpOnly
// cookie set by a previous "Keep me signed in" login.
export const fetchProfile = async () => {
  const response = await axiosClient.get("/users/profile");
  return response.data;
};

// POST /users/logout clears the auth cookies and revokes the server-side
// refresh token so it can't be replayed later.
export const logoutUser = async () => {
  const response = await axiosClient.post("/users/logout");
  return response.data;
};
