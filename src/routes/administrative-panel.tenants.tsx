// src/routes/administrative-panel.tenants.tsx
import { createFileRoute } from '@tanstack/react-router'
import PlatformsPage from '../app/platform/pages/PlatformsPage'

export const Route = createFileRoute('/administrative-panel/tenants')({
  component: PlatformsPage,
})
