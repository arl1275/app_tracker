import { box_to_check } from "../interfaces/box";
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface box_checker {
    data : box_to_check[];
    fetchData_ : (newData_ : box_to_check[]) => void;
    validateBox : (caja : string ) => void;
    toSynchro : ( caja : string ) => void;
    getcajasFacts : (factura : string, id : number) => void;
}

const boxChequerStorage : any = create<box_checker>((set)=>({
    data : [],

    fetchData_ : ( newData_ : box_to_check[]) => {
        set(() => {
          
            let newData: box_to_check[] = [];
            let newFilteredData: box_to_check[] = []
            const { data } = boxChequerStorage.getState();
            const data_ : box_to_check[] = data;

            console.log('/-------------------- CAJAS DE ESTA FACTURA LOCAL-------------------------------/');
            console.table( newData_);

            if (data_.length > 0) {
      
              for (let i = 0; i < data_.length; i++) {
                for (let j = 0; j < newData_.length; j++) {
                  if (data_[i].caja !== newData_[j].caja) {
                    newData.push(newData_[j]);
                    //console.log('CAJA AGREGADA : ', newData_[j])
                  }
                  //console.log('CAJA NO AGREGADA : ', newData_[j])
                }
              }
              
              newFilteredData = [...data, ...newData];
    
              AsyncStorage.setItem('boxData', JSON.stringify(newFilteredData)).catch((error) => {
                console.error('Error saving data:', error);
              });
              console.log('filtered_data_boxes : ', newFilteredData);

            } else {
              //if not exist fill the Async Storage with all data
              AsyncStorage.setItem('boxData', JSON.stringify(newData_)).catch((error) => {
                console.error('Error saving data:', error);
              });
              //console.log('syncro from bk : ' ,AsyncStorage.getItem('boxData'))
      
            }
            return { data: newData_ };
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
          //console.log(' CAJAS OF THIS FACTURA: ',factura, '===>', data.filter( ( item ) => item.factura == factura && item.id_factura === id));
          // console.table(data.map( ( item ) => item))

          return data.filter( ( item ) => item.factura == factura && item.id_factura === id);

        }else{
          return 'ERROR'
        }
      } catch (err) {
        console.log('error al obtener cajas : ', err);
        return 'ERROR';
      }
      
    }

}));

export default boxChequerStorage;