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
      port: parseInt(process.env.PORT) || parseInt(env.VITE_PORT) || 8080, // Default to 8080 for Cloud Run
      // port: isCloudShell ? 8080 : parseInt(env.VITE_PORT) || 5173,
      strictPort: true,
    },
  };
});

// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd());

//   return {
//     plugins: [react()],
//     server: {
//       host: "0.0.0.0",
//       port: parseInt(env.VITE_PORT) || 8080, // Cloud Run uses 8080
//       strictPort: true,
//     },
//     publicDir: "public", // Ensure Vite includes static files
//     build: {
//       outDir: "dist", // Ensure production files go to `dist`
//       rollupOptions: {
//         input: {
//           main: path.resolve(__dirname, "index.html"),
//         },
//       },
//     },
//   };
// });



