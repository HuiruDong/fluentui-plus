import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TagPage from './pages/TagPage';
import NavPage from './pages/NavPage';
import InputTagPage from './pages/InputTagPage';
import SelectPage from './pages/SelectPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/tag',
        element: <TagPage />,
      },
      {
        path: '/nav',
        element: <NavPage />,
      },
      {
        path: '/inputtag',
        element: <InputTagPage />,
      },
      {
        path: '/select',
        element: <SelectPage />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
