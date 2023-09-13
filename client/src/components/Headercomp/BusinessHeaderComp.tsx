import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import style from './headercomp.module.css';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../user-profile/UserProfile';
import ShoppingCart from '../ShoppingCart/ShoppingCart';



// import useAuth from '../../Hooks/useAuth';
// import Icontext from '../icon-text/Icontext';
// import './headercomp.css';
const dummyImage = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80`;

// const sho

export default function BusinessHeaderComp({ pageName = 'Dashboard' }) {
    // const { userName } = useAuth();

    
    const navi = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        // message.success('get out');
        navi('/login');
    };

    const capitalize = (str:string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className={style["headerContainer"]}>
            <div className={style["pageName"]}>{capitalize(pageName.replace('/',''))}</div>
            <div className={style["userIconDiv"]}>
                <h1 >Notifications</h1>
                {/* <p>user name</p> */}
                {/* <Icontext icon={<UserOutlined />} text={userName} /> */}
                <ShoppingCart />
                
                 <UserProfile />
                {/*<LogoutOutlined
                    rotate={-90}
                    style={{
                        fontSize: '24px',
                        marginLeft: '8px',
                        cursor: 'pointer',
                        color: 'red',
                    }}
                    title="Log Out"
                    // onClick={handleLogout}
                /> */}
            </div>
        </div>
    );
}


