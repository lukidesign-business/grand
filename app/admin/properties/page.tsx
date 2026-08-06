import { AdminLogin } from '@/components/admin-login'
import { AdminPropertyDashboard } from '@/components/admin-property-dashboard'
import { isAdminAuthenticated } from '@/lib/admin'
import { getAllProperties } from '@/lib/properties'

export const metadata = { title: 'Property Manager' }

export default async function AdminPropertiesPage() {
  if (!(await isAdminAuthenticated())) return <AdminLogin />
  const properties = await getAllProperties()
  return <AdminPropertyDashboard initialProperties={properties} />
}
