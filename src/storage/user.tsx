import { create } from 'zustand';
import { UserInterface } from '../interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import isConnectedToInternet from '../utils/network_conn';

interface UserProps {
    data: UserInterface;
    fetchData: () => Promise<void>;
    setUser: (user_: UserInterface) => Promise<void>;
    getUser: () => Promise<UserInterface | null>;
    closeSession: () => Promise<boolean>;
    getType: () => Promise<number>;
}

const UserStorage = create<UserProps>((set, get) => ({
    data: {
        id_user: 0,
        nombre: '',
        active: false,
        qr: '',
        cod_empleado: 0,
        role: 0,
        type_: 0
    },

    fetchData: async () => {
        try {
            const storedData = await AsyncStorage.getItem('user');
            if (storedData !== null) {
                set({ data: JSON.parse(storedData) });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },

    setUser: async (user_: UserInterface) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user_));
            set({ data: user_ });
            console.log('Usuario GUARDADO : ', get().data);
        } catch (error) {
            console.error('Error saving user data:', error);
            Alert.alert('NO SE PUDO GUARDAR EL USUARIO');
        }
    },

    getUser: async () => {
        try {
            const storedData = await AsyncStorage.getItem('user');
            if (storedData !== null) {
                return JSON.parse(storedData);
            }
            return null;
        } catch (error) {
            console.log('ERROR PARA OBTENER EL USUARIO');
            return null;
        }
    },

    closeSession: async () => {
        try {
            const isconn = await isConnectedToInternet();
            if (isconn) {
                await AsyncStorage.removeItem('user');
                set({
                    data: {
                        id_user: 0,
                        nombre: '',
                        active: false,
                        qr: '',
                        cod_empleado: 0,
                        role: 0,
                        type_: 0
                    }
                });
                return true;
            } else {
                Alert.alert('Conexion', 'No está dentro de la red Empresarial. No puede cerrar la sesión.');
                return false;
            }
        } catch (error) {
            Alert.alert('No se borró el usuario');
            console.error('ERROR PARA CERRAR SESION', error);
            return false;
        }
    },

    getType: async () => {
        try {
            const user = await get().getUser();
            if (user) {
                return user.type_;
            }
            return 0;
        } catch (error) {
            console.log('ERROR PARA OBTENER EL USUARIO');
            return 0;
        }
    }
}));

export default UserStorage;
