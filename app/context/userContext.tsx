import { googleLogout, useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { toast } from "sonner";
import { getGoogleUserDataWithAccessToken, getGoogleUserDataFromCredential, type GoogleUserData } from "~/api/google";

type UserTokenType = 'one-tap-login' | 'access-token';

export type User = {
  token: string;
  tokenType: UserTokenType,
  data: GoogleUserData | null;
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
  const [authDisabled, setAuthDisabled] = useState(true);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedAuth = localStorage.getItem("homepage-auth");
    if (storedAuth) {
      console.debug('Stored auth found...');
      const user = JSON.parse(storedAuth) as User;
      if (!user.data) {
        console.debug('Stored auth user data missing - skipping')
        return;
      }
      setUser(user);
      console.debug(`Previously loggin in as ${user.data?.name}`)
      setAuthDisabled(true);
    } else {
      setAuthDisabled(false);
    }
  }, []);

  useGoogleOneTapLogin({
    auto_select: true,
    cancel_on_tap_outside: true,
    disabled: authDisabled,
    onSuccess: async (response) => {
      if (!response.credential) {
        console.error('Missing credential after Google OneTap login');
        toast.error('Failed to authenticate with Google OnTap Login');
        return;
      }
      const userData = await getGoogleUserDataFromCredential(response.credential);
      if (!userData) {
        localStorage.removeItem("homepage-auth");
        toast.error('Failed to authenticate with Google');
        return;
      }
      const storedAuth: User = {
        token: response.credential,
        tokenType: 'one-tap-login',
        data: userData,
      };
      setUser(storedAuth);
      localStorage.setItem("homepage-auth", JSON.stringify(storedAuth));
      toast.success('Authenticated with Google OnTap Login');
    },
    onError: () => {
      const error = new Error('Failed to log in with Google');
      console.error(error);
      toast.error(error.message);
    }
  });

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const userData = await getGoogleUserDataWithAccessToken(response.access_token);
      const storedAuth: User = {
        token: response.access_token,
        tokenType: 'access-token',
        data: userData,
      };
      setUser(storedAuth);
      localStorage.setItem("homepage-auth", JSON.stringify(storedAuth));
      toast.success('Authenticated in with Google Login');
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Google login failed - ${error.error_description}`);
    }
  });
  
  const logout = useCallback(() => {
    googleLogout();
    setUser(undefined);
    localStorage.removeItem("homepage-auth");
    toast.info('Logged out');
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
  const {
    login,
    logout,
    user,
  } = useContext(UserContext);

  return {
    login,
    logout,
    authenticated: user?.data ? true : false,
    token: user?.token ?? null,
    userName: user?.data?.given_name ?? null,
  }
}
