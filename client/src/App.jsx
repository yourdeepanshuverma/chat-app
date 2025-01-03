import axios from "axios";
import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Protect from './components/auth/Protect';
import LayoutLoader from "./components/Loaders.jsx";
import { server } from "./components/constants/config.js";
import { useDispatch } from "react-redux";
import { userExists, userNotExists } from "./store/reducers/authSlice.js";
import { SocketProvider } from "./socket.jsx";

const Home = lazy(() => import('./pages/Home.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Groups = lazy(() => import('./pages/Groups.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement.jsx'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement.jsx'));
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement.jsx'));


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/users/me`, { withCredentials: true })
      .then((data) => dispatch(userExists(data.data)))
      .catch((err) => dispatch(userNotExists()));
  }, [])


  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <SocketProvider>
          <Protect authentication>
            <Home />
          </Protect>
        </SocketProvider>
      ),
      exact: true
    },
    {
      path: "/chat/:chatId",
      element: (
        <SocketProvider>
        <Protect authentication>
          <Chat />
        </Protect>
        </SocketProvider>
      ),
      exact: true
    },
    {
      path: "/groups",
      element: (
        <Protect authentication>
          <Groups />
        </Protect>
      ),
      exact: true
    }
    ,
    {
      path: "/login",
      element: (
        <Protect authentication={false}>
          <Login />
        </Protect>
      ),
      exact: true
    },
    {
      path: "/signup",
      element: (
        <Protect authentication={false}>
          <Signup />
        </Protect>
      ),
      exact: true
    },
    {
      path: "/admin-login",
      element: (
        <AdminLogin />
      ),
      exact: true
    },
    {
      path: "/admin/dashboard",
      element: (
        <Dashboard />
      ),
      exact: true
    },
    {
      path: "/admin/users",
      element: (
        <UserManagement />
      ),
      exact: true
    },
    {
      path: "/admin/chats",
      element: (
        <ChatManagement />
      ),
      exact: true
    },
    {
      path: "/admin/messages",
      element: (
        <MessageManagement />
      ),
      exact: true
    },
    {
      path: "*",
      element: <NotFound />
    }
  ])

  return (
    <Suspense fallback={<LayoutLoader />}>
      <RouterProvider router={router} />
    </Suspense>

  )
}

export default App
