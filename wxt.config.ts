import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: "Salesforce™ Dev One",
    permissions: ['storage', 'activeTab', 'scripting', 'webRequest'],
    host_permissions: ["https://*/_ui/common/apex/debug/ApexCSIPage/*"],
    browser_specific_settings: {
      gecko: {
        id: "sfdevone@rasclejero.me",
      },
    },
  },
});
