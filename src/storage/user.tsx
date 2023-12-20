import { create } from 'zustand';
import { UserInterface } from '../interfaces/user';

interface UserProps {
   data : UserInterface;
   getRole : () => void;
   getName : () => void; 
   setUser : (user :  UserInterface) => void;
}

const User: any = create<UserProps>((set) =>({
    data : {
        nombre: '',
        password: '',
        qr: '',
        cod_empleado: 0,
        role: 0, 
    },
    
    getRole: () => {
        const {role} = User.getState();
        return role;
    },

    getName: () => {
        const {nombre} = User.getState();
        return nombre;
    },

    setUser: (user) =>{
        set({ data : user});
    }

}))