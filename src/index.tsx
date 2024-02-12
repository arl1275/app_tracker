// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { EntregadorIndexView } from './pages/entregador/EntregadorMain.view';
// import { MainGuardView } from './components/GuardComponents/GuardMainView';
// import { LoginPage } from './pages/login.page';
// import isConnectedToInternet from './utils/network_conn';
// import UserStorage from './storage/user';

// function IndexPage() {
//   const { data, fetchData, getUser, getType } = UserStorage();
//   const [page, setPage] = useState<string>('');
//   const [local_u, setLocalU] = useState<number | null>(null);
//   const [isconn, setIsconn] = useState<boolean>();

//   useEffect(()=>{
//     validate_local_user();
//  });

//  const validate_local_user = async () => {
//      if(!isconn && data.type_ == 2){
//          setPage( await getType());
//      }
//  }

//   const openSessionHandler = async () => {
//       if(local_u == 3 ){
//         setPage("ENTREGADOR");
//       }else if(local_u == 2){
//         setPage("GUARDIA");
//       }else if(local_u == 0){
//         setPage('');
//       }
//   }

//   const setpage_ = ( value : number) => {
//     setLocalU(value);
//   }
  
//   useEffect(() => {
//     fetchData();
//     if(isconn){
//       openSessionHandler()
//     }else{
//      if(local_u == 3){
//       setPage("ENTREGADOR")
//      }
//     }
    
//   }, [local_u, isconn]); 

//   useEffect( ()=>{
//     val_entregador();
//   })

//   const val_entregador = async () => {
//     setIsconn( await isConnectedToInternet());
//   }

//   return (
//     <View style={{ display: 'flex', backgroundColor: 'white' }}>
//       <View style={{ width: '100%', height: '100%', alignSelf: 'center' }}>
//         {page === "GUARDIA" && <MainGuardView setpage={setpage_}/>}
//         {page === "ENTREGADOR" && <EntregadorIndexView setpage={setpage_}/> }
//         {page === '' && <LoginPage setpage={setpage_}/>}
//       </View>
//     </View>
//   );
// }

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { EntregadorIndexView } from './pages/entregador/EntregadorMain.view';
import { MainGuardView } from './components/GuardComponents/GuardMainView';
import { LoginPage } from './pages/login.page';
import isConnectedToInternet from './utils/network_conn';
import UserStorage from './storage/user';

function IndexPage() {
  const { data, fetchData, getUser, getType } = UserStorage();
  const [page, setPage] = useState<string>('');
  const [local_u, setLocalU] = useState<number | null>(null);
  const [isconn, setIsconn] = useState<boolean>();

  useEffect(() => {
    fetchData();
    val_entregador();
  }, []);

  const openSessionHandler = async () => {
    if (!isconn) {
      setIsconn(await isConnectedToInternet());
    }

    if (!isconn && data.type_ === 3) {
      setPage('ENTREGADOR');
    } else {
      if (local_u === 3) {
        setPage("ENTREGADOR");
      } else if (local_u === 2) {
        setPage("GUARDIA");
      } else if (local_u === 0) {
        setPage('');
      }
    }
  };

  useEffect(() => {
    openSessionHandler();
  }, [local_u, isconn]);

  const setpage_ = (value: number) => {
    setLocalU(value);
  };

  const val_entregador = async () => {
    setIsconn(await isConnectedToInternet());
  };

  return (
    <View style={{ display: 'flex', backgroundColor: 'white' }}>
      <View style={{ width: '100%', height: '100%', alignSelf: 'center' }}>
        {page === "GUARDIA" && <MainGuardView setpage={setpage_} />}
        {page === "ENTREGADOR" && <EntregadorIndexView setpage={setpage_} />}
        {page === '' && <LoginPage setpage={setpage_} />}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  navItems: {
    marginHorizontal: 10,
  },
  navLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue', // You can set your desired text color here
  },
});

export default IndexPage;