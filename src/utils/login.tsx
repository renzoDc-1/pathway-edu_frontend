// src/utils/login.js
const api_url = "http://18.229.118.35:3001";

export async function auth(email, password) {
  try {
    const response = await fetch(`${api_url}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.log("No hay credenciales");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("No se puede iniciar sesión", error);
    return null;
  }
}
