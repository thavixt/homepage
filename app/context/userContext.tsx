import { googleLogout, useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";
import { toast } from "sonner";

export type User = Omit<TokenResponse, "error" | "error_description" | "error_uri"> & {
  // what else to store ?
}

interface UserContextValue {
  user?: User,
  setUser: (user: User) => void;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: undefined,
  setUser: () => null,
  login: () => null,
  logout: () => null,
});

export function UserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return stored ? JSON.parse(stored) : undefined;
  });

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUser(response)
      localStorage.setItem("homepage-auth", JSON.stringify(response));
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Google login failed - ${error.error_description}`);
    }
  });

  const logout = useCallback(() => {
    googleLogout();
    setUser(undefined);
    localStorage.removeItem("user");
  }, []);

  return (
    <UserContext.Provider value={{
      login: () => login(),
      logout,
      user,
      setUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext);
}
