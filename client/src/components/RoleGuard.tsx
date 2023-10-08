
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getLocalUserInfo } from '../utils/helpers/setUserLocalInfo';

function RoleGuard({ allowedRoles }: any) {
    // check if auth has info 
    const oldData = getLocalUserInfo();
    const { loggedIn, role } = oldData;
    const isAllowed = allowedRoles.includes(role);

    console.log('allowed ', allowedRoles, 'my role', oldData.role);
    console.log('roles', allowedRoles, 'my roles ', role, 'verdict : ', isAllowed);

    if (isAllowed && loggedIn) {
        return <Outlet />
    }
    return <Navigate to="/login" />;
}

export default RoleGuard;
