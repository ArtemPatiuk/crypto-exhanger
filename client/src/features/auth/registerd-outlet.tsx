import { Navigate,Outlet} from 'react-router-dom';
import { selectIsAuthenticated } from './authSlice';
import { selectUser } from './authSlice';
import { LayoutPage } from '../layout';
import { Paths } from '../../paths';
import { useAppSelector } from '../../app/store';


export const RegisteredUser = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return isAuthenticated
        ? <Outlet />
        : <Navigate to={Paths.home} replace />;
};
