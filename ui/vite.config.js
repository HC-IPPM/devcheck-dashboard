import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       // Proxy all API requests starting with `/api` to your backend
//       "/api": {
//         target: "https://3001-cs-281831690367-default.cs-us-east1-yeah.cloudshell.dev",
//         changeOrigin: true, // Change the origin to the target URL
//         rewrite: (path) => path.replace(/^\/api/, ""), // Remove `/api` prefix before forwarding
//       },
//     },
//   },
// });
