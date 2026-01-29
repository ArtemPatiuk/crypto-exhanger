import { Navigate } from 'react-router-dom';
import { LayoutPage } from '../layout';
import { selectIsAuthenticated } from './authSlice';
import { selectUser } from './authSlice';
import { Paths } from '../../paths';
import { useAppSelector } from '../../app/store';

export const AdminOutlet = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);

    return isAuthenticated && user?.role?.includes("ADMIN")
        ? <LayoutPage />
        : <Navigate to={Paths.home} replace />;
};
