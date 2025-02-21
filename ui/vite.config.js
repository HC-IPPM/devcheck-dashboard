// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd());

//   return {
//     plugins: [react()],
//     server: {
//       host: '0.0.0.0', // Required for Cloud Run
//       port: parseInt(env.VITE_PORT) || 8080, // Default to 8080 for Cloud Run
//       strictPort: true,
//     },
//   };
// });



import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Required for Cloud Run
      port: parseInt(env.VITE_PORT) || 8080, // Default to 8080 for Cloud Run
      strictPort: true,
    },
  };
});




