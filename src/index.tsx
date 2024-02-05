import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { EntregadorIndexView } from './pages/entregador/EntregadorMain.view';
import { MainGuardView } from './components/GuardComponents/GuardMainView';
import { LoginPage } from './pages/login.page';
import UserStorage from './storage/user';


function IndexPage() {
  const {fetchData, setUser} = UserStorage();
  const [page, setPage] = useState("");
  const [user, setUser_] = useState({
    id_user : 0,
    nombre : '',
    cod_empleado : '',
    qr : '',
    type_ : 0,
    active : true
});

  const handleUser = (prop : any) => {
    setUser_(prop);
  }

   useEffect(()=>{
       if(user.type_=== 3){
         setPage( "ENTREGADOR");
         console.log('usuario a guardar', user);
         setUser(user);
       }else if(user.type_=== 2){
         setPage("GUARDIA");
     }else{
       setPage("");
     }
   }, [user, page])

  return (
    <View style={{ display: 'flex', backgroundColor: 'white' }}>
      <View style={{ width: '100%', height: '100%', alignSelf: 'center' }}>
        {page === "GUARDIA" && <MainGuardView closeSession={handleUser} /> }
        {page === "ENTREGADOR" ? <EntregadorIndexView closeSession={handleUser} /> : null}
        {page === "" && <LoginPage props={handleUser} />}
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