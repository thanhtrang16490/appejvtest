import { createClient } from "@/lib/supabase/server";
import { CustomerHome } from "@/components/customer/CustomerHome";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/customer-login')
  }

  // Check if user is a sales person, redirect to sales dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile && (profile as any).role && ['sale', 'admin', 'sale_admin'].includes((profile as any).role)) {
    redirect('/sales')
  }

  return <CustomerHome />
}
