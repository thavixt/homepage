import { useUser } from '~/context/userContext';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function AuthButton() {
  const { authenticated, login } = useUser();

  return (
    <div className="absolute top-4 right-4 z-2000">
      {authenticated ? (
        <LoggedInButton />
      ) : (
        <Button variant="secondary" onClick={login}>Log in with Google</Button>
      )}
    </div>
  )
}

function LoggedInButton() {
  const { userName, logout } = useUser();

  if (!userName) {
    return null;
  }

  const onClick = (link: string) => () => {
    window.open(link, '__blank');
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Hi {userName}!</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit mr-4">
        <div className='flex flex-col gap-2 items-start justify-center'>
          <Button variant="link" onClick={onClick('https://mail.google.com/mail')}>My Gmail account</Button>
          <Button variant="link" onClick={onClick('https://calendar.google.com/calendar')}>My Google calendar</Button>
          <Button variant="link" onClick={onClick('https://www.google.com/maps')}>Google Maps</Button>
          <Button variant="link" onClick={onClick('https://myaccount.google.com/')}>My Google account</Button>
          <Button variant="link" onClick={() => logout()}>Log out</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
