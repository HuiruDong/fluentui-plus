import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TagPage from './pages/TagPage';
import NavPage from './pages/NavPage';
import InputTagPage from './pages/InputTagPage';
import SelectPage from './pages/SelectPage';
import CascaderPage from './pages/CascaderPage';
import CheckboxPage from './pages/CheckboxPage';
import ModalPage from './pages/ModalPage';
import MessagePage from './pages/MessagePage';
import TablePage from './pages/TablePage';
import SpinPage from './pages/SpinPage';
import PaginationPage from './pages/PaginationPage';

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
      {
        path: '/cascader',
        element: <CascaderPage />,
      },
      {
        path: '/checkbox',
        element: <CheckboxPage />,
      },
      {
        path: '/modal',
        element: <ModalPage />,
      },
      {
        path: '/message',
        element: <MessagePage />,
      },
      {
        path: '/table',
        element: <TablePage />,
      },
      {
        path: '/spin',
        element: <SpinPage />,
      },
      {
        path: '/pagination',
        element: <PaginationPage />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
