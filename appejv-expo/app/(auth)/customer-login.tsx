import { Redirect } from 'expo-router'

// Redirect to main login page
// This page is kept for backward compatibility
export default function CustomerLoginScreen() {
  return <Redirect href="/(auth)/login" />
}
