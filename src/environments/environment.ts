// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
   REST_API_SERVER: 'localhost:2000',
  //REST_API_SERVER: 'https://backend.infinovae.com',
  //For social media API
  apiUrl: 'http://internal-LBA-1495990277.us-east-1.elb.amazonaws.com:2000',
  //facebookAppId: '314930319788683'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
