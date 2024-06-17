import { box_to_check } from "../interfaces/box";
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface box_checker {
    data : box_to_check[];
    fetchData_ : (newData_ : box_to_check[]) => void;
    validateBox : (caja : string ) => void;
    toSynchro : ( caja : string ) => void;
    getcajasFacts : (factura : string, id : number) => void;
    closeBoxes : () => void;
}

const boxChequerStorage : any = create<box_checker>((set)=>({
    data : [],

    fetchData_ : (newData_: box_to_check[]) => {
      set(() => {
        const { data } = boxChequerStorage.getState();
        const data_: box_to_check[] = data;
    
        let newFilteredData: box_to_check[];
    
        if (data_.length > 0) {
          // Crear un Set para almacenar las cajas existentes
          const existingCajas = new Set(data_.map((box) => box.caja));
    
          // Filtrar las nuevas cajas que no existen en el Set
          const filteredNewData = newData_.filter((newBox) => !existingCajas.has(newBox.caja));
    
          // Combinar los datos existentes con las nuevas cajas filtradas
          newFilteredData = [...data_, ...filteredNewData];
    
          AsyncStorage.setItem('boxData', JSON.stringify(newFilteredData)).catch((error) => {
            console.error('Error saving data:', error);
          });
          console.log(' SE GUARDO LA DATA DE CAJAS DE FORMA LOCAL');
    
        } else {
          // Si no hay datos existentes, guardar todas las nuevas cajas
          AsyncStorage.setItem('boxData', JSON.stringify(newData_)).catch((error) => {
            console.error('Error saving data:', error);
          });
          newFilteredData = newData_;
        }
    
        return { data: newFilteredData };
      });
    },

    validateBox : async (caja : string)=>{
        try {
     
            const storedData = await AsyncStorage.getItem('boxData');
            if (storedData !== null) {
              let data: box_to_check[] = JSON.parse(storedData);
      
              // Find the index of the factura to update
              const BoxIndex = data.findIndex((box : box_to_check) => box.caja === caja);
      
              if (BoxIndex !== -1) {
                // Update state and hasSing for the found factura
                data[BoxIndex] = {
                  ...data[BoxIndex],
                  is_check: true,
                };
      
                // Save the updated data back to AsyncStorage
                await AsyncStorage.setItem('boxData', JSON.stringify(data));
                console.log('State and hasSing updated successfully:', data[BoxIndex]);
              } else {
                console.error('Factura not found with the given ID:', caja);
              }
            }
          } catch (error) {
            console.error('Error updating state and hasSing:', error);
          }

    },

    toSynchro: async (caja) => {
      try {
     
        const storedData = await AsyncStorage.getItem('boxData');
        if (storedData !== null) {
          let data: box_to_check[] = JSON.parse(storedData);
  
          // Find the index of the factura to update
          const BoxIndex = data.findIndex((box : box_to_check) => box.caja === caja);
  
          if (BoxIndex !== -1) {
            // Update state and hasSing for the found factura
            data[BoxIndex] = {
              ...data[BoxIndex],
              is_synchro : true,
            };
  
            // Save the updated data back to AsyncStorage
            await AsyncStorage.setItem('boxData', JSON.stringify(data));
            console.log('State and hasSing updated successfully:', data[BoxIndex]);
          } else {
            console.error('Factura not found with the given ID:', caja);
          }
        }
      } catch (error) {
        console.error('Error updating state and hasSing:', error);
      }
    },

    getcajasFacts : async (factura : string, id : number) => {
      
      try {
    
        const storedData = await AsyncStorage.getItem('boxData');

        if (storedData !== null) {

          let data: box_to_check[] = JSON.parse(storedData);

          return data.filter( ( item ) => item.factura == factura && item.id_factura === id);

        }else{
          return 'ERROR'
        }
      } catch (err) {
        console.log('error al obtener cajas : ', err);
        return 'ERROR';
      }
      
    },

    closeBoxes : async () => {
      try {
        await AsyncStorage.removeItem('boxData');
        set({ data: [] });
        return true;
      } catch (err) {
        console.log('error al borrar cajas : ', err);
        return false;
      }
    }

}));

export default boxChequerStorage;