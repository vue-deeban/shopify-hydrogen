// ./sanity.config.ts

// Add these imports
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation';
import {locations} from './presentation/locations';

export default defineConfig({
  projectId:'93vxj2j5'
  dataset: 'production',
  plugins: [
    presentationTool({
      previewUrl: {
        origin: 'http://localhost:3000',
        preview: '/',
        previewMode: {
          // This should match the route you created earlier
          enable: '/resource/preview',
        },
      },
    }),

    // ..all other plugins
  ],
});
