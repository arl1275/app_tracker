import { create } from 'zustand';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { Facturas } from '../interfaces/facturas';

interface FacturaState {
    data: Facturas[];
    CargaData: (values: Facturas[]) => void; // guarda todas las facturas
    GetFactbyID: (id: number) => void;
    UpdateIsChecked: (id: number) => void;
    GetIsCheckedFacts : () => void;
}

const useGuardList: any = create<FacturaState>((set) => ({
    data: [],

    CargaData: (values) => {    
        const {data} = useGuardList.getState();
        let alterData : Facturas[] = [];
        for(let i = 0; values.length > i ; i++){
            const dat = data.some((item: Facturas) => item.id === values[i].id);
            if(dat){
                //console.log('existe: ', values[i]);
            }else{
                console.log('no existe', values[i]);
                alterData.push(values[i]);
            }
        }
        const combinedData = [...data, ...alterData];
        set({ data: combinedData});
    },

    GetFactbyID: (id) => {
        const {data} = useGuardList.getState();
        return data.find((fact: Facturas) => fact.id === id);
    },

    GetIsCheckedFacts : () => {
        const {data} = useGuardList.getState();
        return data.filter((item : Facturas)=> item.is_check === true);
    },

    UpdateIsChecked: async (id) => {
        const {data} =  await useGuardList.getState();
        const facturaIndex = data.findIndex((item : Facturas) => item.id === id);
        if (facturaIndex !== -1) {
            data[facturaIndex] = {
                ...data[facturaIndex],
                is_check: true,
            };
        }
    }

}));

export default useGuardList;