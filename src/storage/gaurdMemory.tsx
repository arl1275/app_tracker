import { create } from 'zustand';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { Facturas } from '../interfaces/facturas';

interface FacturaState {
    data: Facturas[];
    CargaData: (values: Facturas[]) => void; // guarda todas las facturas
    GetFactbyID: (id: number) => void;
    UpdateIsChecked: (id: string) => void;
    GetIsCheckedFacts : () => void;             
    updateIsInTransit : ( id : number) => void; // this is to save that the fact is in transit
}

const useGuardList: any = create<FacturaState>((set) => ({
    data: [],

    CargaData: (values) => {    
        const {data} = useGuardList.getState();
        let alterData : Facturas[] = [];
        for(let i = 0; values.length > i ; i++){
            const dat = data.some((item: Facturas) => item.factura_id === values[i].factura_id);
            if(dat){
                //console.log('existe: ', values[i]);
            }else{
                //console.log('GUARDADO : ', values[i])
                alterData.push(values[i]);
            }
        }
        const combinedData = [...data, ...alterData];
        set({ data: combinedData});
    },

    GetFactbyID: (id) => {
        const {data} = useGuardList.getState();
        return data.find((fact: Facturas) => fact.factura_id === id);
    },

    GetIsCheckedFacts : () => {
        const {data} = useGuardList.getState();
        const checked : Facturas[] = data.filter((item : Facturas)=> item.is_check === true);
        const filtered = checked.filter((item : Facturas) => item.is_Sinchro != true);
        return filtered;
    },

    UpdateIsChecked: async (id) => {
        const {data} =  await useGuardList.getState();
        const facturaIndex = data.findIndex((item : Facturas) => item.factura === id);
        if (facturaIndex !== -1) {
            data[facturaIndex] = {
                ...data[facturaIndex],
                is_check: true,
            };

        }
        
    },

    updateIsInTransit : async ( id ) => {
        const {data} =  await useGuardList.getState();
        const facturaIndex = data.findIndex((item : Facturas) => item.factura_id === id);
        if (facturaIndex !== -1) {
            data[facturaIndex] = {
                ...data[facturaIndex],
                is_Sinchro: true,
            };
        }   
    }

}));

export default useGuardList;