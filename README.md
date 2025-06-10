# Your home page

Set the [https://homepage.komlosidev.net](https://homepage.komlosidev.net) URL as your home page, and customize it to you liking!

- set your bookmarks, pin your favourites,
- manage your calendar and diary,
- set some todo items, mark your progress,
- check the weather for today and the next 3 days,
- (optionally) log in with your Google account,

## Features:

- [ ] local settings
- [ ] notes
- [ ] timer/reminder
- [x] bookmarks with import/export
- [x] calendar with diary
- [x] current weather widget and 3 day forecast
- [x] dynamic background
- [x] keyboard navigation
- [x] localization with react-i18n
- [x] site statistics
- [x] todo list
- [x] (optional) authentication with Google One-Tap login

### Made with

- [React](https://react.dev/) with [Typescript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [Redux](https://redux.js.org/)
- [Tailwind](https://tailwindcss.com/)
- [Vite](https://vite.dev/)
- [shadcn](https://ui.shadcn.com/)-based components
- deployed with [Vercel](https://vercel.com/) to [live page](homepage.komlosidev.net)
- [react-i18n](https://react.i18next.com/)
  > used with a custom type-safe `useTypesafeTranslations` hook - see the [input dictionary](./app/locales/en.json), the [.d.ts generator](./generateTranslationTypes.ts), the [generated .d.ts file](./app/translations.d.ts) and the [custom hook](./app/i18n.ts) here
