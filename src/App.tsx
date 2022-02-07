import { observer } from 'mobx-react-lite';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
   const { store } = useContext(Context);
   const [users, setUsers] = useState<IUser[]>([]);

   useEffect(() => {
      if (localStorage.getItem('token')) {
         store.checkAuth();
      }
   }, []);

   async function getUsers() {
      try {
         const response = await UserService.fetchUsers();
         setUsers(response.data);
      } catch (error) {
         console.log(error);
      }
   }

   if (store.isLoading) {
      return <div>Loading...</div>;
   }

   if (!store.isAuth) {
      return (
         <div>
            <LoginForm></LoginForm>
            <button onClick={getUsers}>Get users</button>
         </div>
      );
   }

   return (
      <div>
         <h1>{store.isAuth ? `User is authorized ${store.user.email}` : 'Authorize please'}</h1>
         <h1>{ store.user.isActivated ? 'Account activated from email' : 'Confirm account!!!!'}</h1>
         <button onClick={() => store.logout()}>Logout</button>
         <button onClick={getUsers}>Get users</button>
         {users.map(user => (
            <div key={user.email}>{user.email}</div>
         ))}
      </div>
   );
};

export default observer(App);
