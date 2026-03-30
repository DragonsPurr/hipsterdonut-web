'use client';

/**
 * This configuration is used for the Sanity Studio mounted at /studio
 */

import { dashboardTool } from "@sanity/dashboard";
import { vercelWidget } from "sanity-plugin-dashboard-widget-vercel";
import { umamiTool } from 'sanity-plugin-umami-analytics-tool'
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash';

import { apiVersion, dataset, projectId } from './sanity/env';
import { schema } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId: projectId!,
  dataset: dataset!,
  schema,
  plugins: [
    structureTool({ structure }),
    unsplashImageAsset(),
    dashboardTool({
      widgets: [
        vercelWidget(),
      ],
    }),
    umamiTool({
      url: 'https://cloud.umami.is/share/vJpbTl1ahjz4rS0w',
    }),
  ],
});
