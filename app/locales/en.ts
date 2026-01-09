const en = {
  app: {
    title: "Home page"
  },
  auth: {
    account: "My Google account",
    calendar: "My Google calendar",
    gmail: "My Gmail inbox",
    loggedInAs: "Welcome back, {{name}}!",
    login: "Log in with Google",
    logout: "Log out",
    maps: "Google Maps"
  },
  bookmark: {
    delete: {
      title: "Delete bookmark",
      confirm: "Delete this bookmark",
      description: "Are you sure you want to delete the bookmark for \"{{title}}\", that points to \"{{url}}\"?"
    },
    edit: {
      title: "Edit bookmark",
      confirm: "Save bookmark",
      description: "Edit the name and the URL it points to."
    },
    form: {
      name: "Name",
      pinned: "Pinned",
      abbrev: "Abbrev. (max 3 chars.)",
      required: "Must provide a name and link for the bookmark",
      url: "URL"
    }
  },
  calendar: {
    createEvent: {
      title: "Create a new event",
      description: "Set a date and description for the event."
    },
    eventsToday: "Events today",
    header: "Calendar and diary",
    scheduledFor: "Events scheduled for {{date}}"
  },
  chat: {
    header: "Chat about anything with Homie, your personal assistant",
    tooltip: "Send a message to Gemini - just press enter while writing",
    homie: "Homie"
  },
  common: {
    day: "Day",
    emptyText: "Nothing here - for now.",
    from: "From",
    inputPlaceholder: "Type here...",
    loading: "Loading ...",
    me: "Me",
    refresh: "Refresh",
    reset: "Reset",
    searchPlaceholder: "Search...",
    today: "Today",
    yourLocation: "Your current location",
  },
  dashboard: {
    title: "Dashboard",
    settings: {
      button: "Settings",
    },
    fullscreen: {
      button: "Open fullscreen"
    }
  },
  error: {
    calendar: {
      required: "Must provide a date and description for the event"
    },
    unknown: "An unknown error occured. For now, just try again later."
  },
  feature: {
    ai: "Ask something, or chat about anything",
    calendar: "What am I supposed to be doing this weekend?",
    dashboard: "Dashboard",
    notes: "Keeping notes of the things that happened.",
    stats: "See how you are using this app.",
    settings: "Change the way this app works.",
    timer: "Set a timer or reminder for something important.",
    todos: "That sounds important - better write that down!",
    weather: "Maybe I should bring an umbrella tomorrow...",
  },
  home: {
    currentDate: "Today is {{date}}"
  },
  hotkey: {
    header: "(to come back here, press Shift + Space)"
  },
  notFound: {
    back: "Let's just go back home.",
    description: "... but maybe it's just not fully implemented - yet! Check again later :)",
    subtitle: "Alright, but this just doesn't exist",
    title: "404"
  },
  privacyPolicy: {
    title: "Privacy policy"
  },
  settings: {
    clear: {
      action: "Clear all app data",
      description: "Are you sure you want to reset EVERYTHING to defaults? This will reset all bookmarks, todos, and all other stored data and settings.",
      title: "Clear app data"
    },
    header: "Settings and preferences",
    reset: {
      action: "Reset settings",
      description: "Are you sure you want to reset settings to defaults?",
      feedback: "Reloading - all stored data was cleared/reset",
      title: "Reset all settings to defailts"
    }
  },
  stats: {
    counter: "{{count}} times",
    header: "Statistics collected",
    reset: {
      confirm: "Yes, reset my stats",
      description: "Reset all the statistics collected so far?",
      title: "Reset statistics"
    },
    searchLabel: "Search for a statistic:"
  },
  todo: {
    form: {
      deadline: "Deadline",
      description: "Description",
      title: "Title"
    }
  },
  todos: {
    clear: {
      description: "Are you sure you want to delete all the todos in the list?",
      title: "Delete all tasks"
    },
    create: {
      button: "Create task",
      description: "Edit the title, description and deadline of the task.",
      title: "Edit task"
    },
    deleteAll: {
      button: "Delete all tasks"
    },
    filter: {
      cancelled: "Show cancelled",
      completed: "Show completed",
      initial: "Show initial",
      inprogress: "Show in progress"
    },
    form: {
      required: "'Must provide a title and deadline for the todo'"
    },
    header: "Things to do",
    tip: {
      part1: "Click the",
      part2: "Create new task",
      part3: "button below to create a new todo task."
    }
  },
  weather: {
    attribution1: "Weather data from",
    attribution2: ", updated every hour.",
    condition: "Weather condition",
    conditionIcon: "Weather condition icon",
    header: "Weather forecast in {{location}}",
    heat_index: {
      title: "Heat index",
      description: "What the temperature feels like to the human body when relative humidity is combined with the air temperature"
    },
    humidity: {
      title: "Humidity",
      description: "Concentration of water vapor present in the air"
    },
    link: "View detailed weather information",
    loadingText: "Loading weather data ...",
    precip: {
      title: "Precipitation",
      description: "Rain, snow, sleet, or hail that falls to or condenses on the ground"
    },
    rain_chance: "Chance of rain",
    snow_chance: "Chance of snow",
    subtitle: "Last updated: {{date}}",
    temp_avg: "Average temperature",
    temp_max: "Max. temperature",
    temp_min: "Min. temperature",
    uv_index: "UV index",
    wind: {
      title: "Wind",
      description: "Max. wind speed - wind flow speed is a fundamental atmospheric quantity caused by air moving from high to low pressure, usually due to changes in temperature"
    },
    wind_max: "Max. wind speed"
  },
  wip: "Lorem ipsum",
  wip2: "Lorem ipsum dolor sit amet",
} as const;

export default en;