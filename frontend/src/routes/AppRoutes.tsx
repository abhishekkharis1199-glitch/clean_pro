import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import CustomerDashboardPage from '../pages/CustomerDashboardPage'
import ProviderDashboardPage from '../pages/ProviderDashboardPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import ProviderSignupPage from '../pages/ProviderSignupPage'
import ServiceProvidersPage from '../pages/ServiceProvidersPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/provider/signup" element={<ProviderSignupPage />} />
        <Route path="/services/:service" element={<ServiceProvidersPage />} />
        <Route path="/services/:service/:providerId" element={<ServiceProvidersPage />} />
        <Route path="/customer" element={<CustomerDashboardPage />} />
        <Route path="/provider" element={<ProviderDashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  )
}
