import { useUser } from '~/context/userContext';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useTypesafeTranslation } from '~/i18n';

export function AuthButton() {
  const { authenticated, login } = useUser();
  const t = useTypesafeTranslation(); 

  return (
    <div className="absolute top-4 right-4 z-2000">
      {authenticated ? (
        <LoggedInButton />
      ) : (
        <Button variant="secondary" onClick={login}>
          {t('auth.login')}
        </Button>
      )}
    </div>
  )
}

function LoggedInButton() {
  const { userName, logout } = useUser();
  const t = useTypesafeTranslation(); 

  if (!userName) {
    return null;
  }

  const onClick = (link: string) => () => {
    window.open(link, '__blank');
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">{t('auth.loggedInAs', {name: userName})}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit mr-4">
        <div className='flex flex-col gap-2 items-start justify-center'>
          <Button variant="link" onClick={onClick('https://mail.google.com/mail')}>
            {t('auth.gmail')}
          </Button>
          <Button variant="link" onClick={onClick('https://calendar.google.com/calendar')}>
            {t('auth.calendar')}
          </Button>
          <Button variant="link" onClick={onClick('https://www.google.com/maps')}>
            {t('auth.maps')}
          </Button>
          <Button variant="link" onClick={onClick('https://myaccount.google.com/')}>
            {t('auth.account')}
          </Button>
          <Button variant="link" onClick={() => logout()}>
            {t('auth.logout')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
