import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { MainLayout } from './layouts/MainLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { RequireAuth } from './components/auth/RequireAuth'
import { RequireAdmin } from './components/auth/RequireAdmin'
import { RequireGuest } from './components/auth/RequireGuest'

import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { FeedPage } from './pages/main/FeedPage'
import { NetworkPage } from './pages/main/NetworkPage'
import { LibraryPage } from './pages/main/LibraryPage'
import { OpportunitiesPage } from './pages/main/OpportunitiesPage'
import { BourseDetailsPage } from './pages/main/BourseDetailsPage'
import { MentorshipPage } from './pages/main/MentorshipPage'
import { ForumPage } from './pages/main/ForumPage'
import { ProfilePage } from './pages/main/ProfilePage'
import { PublicProfilePage } from './pages/main/PublicProfilePage'
import { ChatPage } from './pages/main/ChatPage'
import { NotificationsPage } from './pages/main/NotificationsPage'
import { SettingsPage } from './pages/main/SettingsPage'
import { DocumentCheckoutPage } from './pages/main/DocumentCheckoutPage'
import { DocumentDetailsPage } from './pages/main/DocumentDetailsPage'

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminCRMPage } from './pages/admin/AdminCRMPage'
import { AdminCertificationsPage } from './pages/admin/AdminCertificationsPage'
import { AdminModerationPage } from './pages/admin/AdminModerationPage'
import { AdminCMSPage } from './pages/admin/AdminCMSPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminMatchmakingPage } from './pages/admin/AdminMatchmakingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      }
    ]
  },
  {
    path: '/',
    element: (
      <RequireGuest>
        <AuthLayout />
      </RequireGuest>
    ),
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
      }
    ]
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: 'feed',
        element: <FeedPage />
      },
      {
        path: 'network',
        element: <NetworkPage />
      },
      {
        path: 'library',
        element: <LibraryPage />
      },
      {
        path: 'library/:id',
        element: <DocumentDetailsPage />
      },
      {
        path: 'library/checkout/:id',
        element: <DocumentCheckoutPage />
      },
      {
        path: 'opportunities',
        element: <OpportunitiesPage />
      },
      {
        path: 'opportunities/:id',
        element: <BourseDetailsPage />
      },
      {
        path: 'mentors',
        element: <MentorshipPage />
      },
      {
        path: 'forum',
        element: <ForumPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'profile/:id',
        element: <PublicProfilePage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'notifications',
        element: <NotificationsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '/admin/login',
    element: (
      <RequireGuest>
        <AdminLoginPage />
      </RequireGuest>
    )
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />
      },
      {
        path: 'crm',
        element: <AdminCRMPage />
      },
      {
        path: 'certifications',
        element: <AdminCertificationsPage />
      },
      {
        path: 'matchmaking',
        element: <AdminMatchmakingPage />
      },
      {
        path: 'moderation',
        element: <AdminModerationPage />
      },
      {
        path: 'cms',
        element: <AdminCMSPage />
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App