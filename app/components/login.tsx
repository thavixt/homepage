import { useUser } from '~/context/userContext';
import { Button } from './ui/button';

export function Login() {
  const { user, login, logout } = useUser();

  return (
    <div className="fixed top-4 right-4 z-2000">
      {user ? (
        <Button variant="secondary" onClick={logout}>Log out</Button>
      ) : (
        <Button variant="secondary" onClick={login}>Log in with Google</Button>
      )}
    </div>
  )
}