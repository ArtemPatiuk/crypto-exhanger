import { createBrowserRouter } from 'react-router-dom';
import { Paths } from '../paths';
import { Home } from '../pages/home';
import { LayoutPage } from '../features/layout';
import { RegisteredUser } from '../features/auth/registerd-outlet';
import Reviews from '../pages/review';
import Admin from '../pages/admin';
import { AdminOutlet } from '../features/auth/admin-outlet';
import Cabinet from '../pages/cabinet/cabinet';
import { AddAssets } from '../pages/admin/assets/add-asset';
import { ProfileAsset } from '../pages/admin/assets/profile-asset';
import { EditAssets } from '../pages/admin/assets/edit-asset';
import {ListAssets } from '../pages/admin/assets/list-asset';
import { ListExchanges } from '../pages/admin/exchanges/list-exchanges';
import { ProfileExchange } from '../pages/admin/exchanges/profile-exchange';
import ContactPage from '../pages/contacts';


export const router = createBrowserRouter([
    {
        element: <LayoutPage />,
        children: [
            {
                path: Paths.home,
                element: <Home />
            },
            {
                path: Paths.review,
                element: <Reviews />
            },
            {
                path: Paths.contacts,
                element: <ContactPage />
            },
            {
                element: <RegisteredUser />,
                children: [
                    {
                        path: Paths.cabinet,
                        element: <Cabinet />
                    }
                ]
            },
            {
                path: Paths.admin,
                element: <AdminOutlet />,
                children: [
                    {
                        index: true,
                        element: <Admin />
                    },
                    {
                        path: 'assets',
                        element: <ListAssets />
                    },
                    {
                        path: 'assets/add',
                        element: <AddAssets />
                    },
                    {
                        path: 'assets/:id',
                        element: <ProfileAsset />
                    },
                    {
                        path: 'assets/:id/edit',
                        element: <EditAssets />
                    },
                    {
                        path: 'exchanges',
                        element: <ListExchanges />
                    },
                    {
                        path: 'exchanges/:id',
                        element: <ProfileExchange />
                    }
                ]
            },
            {
                path: '*',
                element: <Home />
            }
        ]
    }
]);