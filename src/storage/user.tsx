import { create } from 'zustand';
import { UserInterface } from '../interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProps {
   data : UserInterface;
   fetchData : () => Promise<void>;
   setUser : (user_ : UserInterface) => void;
   getUser : () => void;
   closeSession : () => void;
}

const UserStorage: any = create<UserProps>((set) =>({
    data : {
        id_user : 0,
        nombre: '',
        qr: '',
        cod_empleado: 0,
        role: 0, 
        active: false,
    },

    fetchData : async () => {
        try {
            const storedData = await AsyncStorage.getItem('user');
            if (storedData !== null) {
              set({ data: JSON.parse(storedData) });
            }
      
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    },

    setUser : async (users_ : UserInterface) => {
        try {
            set({ data: users_ });
            await AsyncStorage.setItem('user', JSON.stringify(users_));
        } catch (error) {
            console.log('NO FUE POSIBLE GUARDAR EL USUARIO');
        }
    }, 

    getUser : () =>{
        try {
            const { data } = UserStorage.getState();
            return data;
        } catch (error) {
            console.log('ERROR PARA OBTENER EL USUARIO');
        }
    },

    closeSession :async  () =>{
        try {
            await UserStorage.removeItem('user')
            return true;
        } catch (error) {
            console.log('ERROR PARA CERRAR SESION');
            return false
        }
    }

}));

export default UserStorage;