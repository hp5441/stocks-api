/* global gapi */
export const config = {
  client_id:
    "455912657305-qf9hdslu6r8fhlssiku16mptuasmjedb.apps.googleusercontent.com",
  scope: "https://www.googleapis.com/auth/userinfo.email",
};

export const gapiScript = (config) => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/client.js";

  script.onload = () => {
    const initClient = () => {
      gapi.client.init(config);
    };
    gapi.load("client:auth2", initClient);
  };

  document.body.appendChild(script);
};

export const createUserWithEmailAndPassword = async ({
  email,
  password,
  name,
}) => {
  const user = await fetch("/api/user/create/", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      name: name,
    }),
    Headers: {
      "Content-Type": "application/json",
    },
  });
  return user.then((res) => res.json());
};

export const signInUserWithGoogle = async () => {
  const auth2 = gapi.auth2.getAuthInstance();
  const user = await auth2.signIn();
  const authResponse = user.getAuthResponse(true);
  const Response = await fetch("/api/user/google/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authResponse),
  }).then((res) => res.json());
  return Response;
};

export const signInUserWithEmailAndPassword = async ({ email, password }) => {
  const user = await fetch("/api/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  }).then((res) => res.json());
  return user;
};

export const signOutUser = async () => {
  await fetch("/api/user/logout/", {
    method: "POST",
  });
  return;
};

export const getCurrentUser = async () => {
  const user = await fetch("/api/user/me/").then((res) => res.json());
  return user;
};

export const extractCSRF = async (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
