// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBajZF0UgCmdo6IhJ0PRdp0Hv-YgUWCoKM',
    authDomain: 'blockparty-manager.firebaseapp.com',
    databaseURL: 'https://blockparty-manager.firebaseio.com',
    projectId: 'blockparty-manager',
    storageBucket: '',
    messagingSenderId: '777910149869'
  }
};
