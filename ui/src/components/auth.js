// // Example: https://my-cloud-run-service.run.app/books/delete/12345
// const url = 'https://ui-744920990938.northamerica-northeast1.run.app/accessibility-summary';

// // Example (Cloud Run): https://my-cloud-run-service.run.app/
// const targetAudience = 'https://api-744920990938.northamerica-northeast1.run.app';


// import {GoogleAuth} from 'google-auth-library';
// const auth = new GoogleAuth();

// async function request() {
//   console.info(`request ${url} with target audience ${targetAudience}`);
//   const client = await auth.getIdTokenClient(targetAudience);

//   // Alternatively, one can use `client.idTokenProvider.fetchIdToken`
//   // to return the ID Token.
//   const res = await client.request({url});
//   console.info(res.data);
// }

// request().catch(err => {
//   console.error(err.message);
// //   process.exitCode = 1;
// });

// =------------------------------------------
// // auth.js
// import { GoogleAuth } from 'google-auth-library';

// const API_URL = 'https://api-744920990938.northamerica-northeast1.run.app';

// export async function fetchWithAuth(endpoint) {
//   const auth = new GoogleAuth();

//   try {
//     const client = await auth.getIdTokenClient(API_URL);
//     const response = await client.request({ url: endpoint });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching data from ${endpoint}:`, error.message);
//     throw error;
//   }
// }


// -----------

import { GoogleAuth } from 'google-auth-library';

const API_URL = 'https://api-744920990938.northamerica-northeast1.run.app';

export async function fetchWithAuth(endpoint) {
  const auth = new GoogleAuth();

  try {
    const client = await auth.getIdTokenClient(API_URL);
    const response = await client.request({ url: endpoint });

    if (!response || !response.data) {
      throw new Error(`No data received from ${endpoint}`);
    }

    return response.data; // Ensure this returns valid data
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.message);
    throw error;
  }
}
