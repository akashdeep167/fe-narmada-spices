export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    role: "PURCHASER" | "SUPERVISOR" | "FINANCER" | "ADMIN";
  };
}

export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  role: "PURCHASER" | "SUPERVISOR" | "FINANCER" | "ADMIN";
}

// Global handler for token expiration (401 errors)
let tokenExpirationHandler: (() => void) | null = null;

export function setTokenExpirationHandler(handler: (() => void) | null): void {
  tokenExpirationHandler = handler;
}

function handleTokenExpiration(): void {
  if (tokenExpirationHandler) {
    tokenExpirationHandler();
  }
}

export async function login(username: string, password: string) {
  try {
    const res = await fetch("http://localhost:5001/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    return (await res.json()) as LoginResponse;
  } catch (error) {
    console.error("Login request failed:", error);
    throw error;
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAllUsers() {
  try {
    const res = await fetch("http://localhost:5001/api/users", {
      method: "GET",
      headers: {
        ...getAuthHeader(),
      } as HeadersInit,
    });

    if (res.status === 401) {
      handleTokenExpiration();
      throw new Error("Token expired");
    }

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return (await res.json()) as User[];
  } catch (error) {
    console.error("Fetch users failed:", error);
    throw error;
  }
}

export async function updateUser(
  id: number,
  data: Partial<User & { password?: string }>,
) {
  try {
    const res = await fetch(`http://localhost:5001/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      } as HeadersInit,
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      handleTokenExpiration();
      throw new Error("Token expired");
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update user");
    }

    return (await res.json()) as User;
  } catch (error) {
    console.error("Update user failed:", error);
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await fetch(`http://localhost:5001/api/users/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      } as HeadersInit,
    });

    if (res.status === 401) {
      handleTokenExpiration();
      throw new Error("Token expired");
    }

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    return await res.json();
  } catch (error) {
    console.error("Delete user failed:", error);
    throw error;
  }
}
