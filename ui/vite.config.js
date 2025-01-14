import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


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
