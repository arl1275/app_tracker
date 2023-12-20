import React, { useEffect, useState } from "react";
import styles_made from "../../assets/stylescss";
import { Button, FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import axios from 'axios';
import db_dir from "../../config/db";
import { Facturas } from "../../interfaces/facturas";
import { Table, Row, Rows } from 'react-native-table-component';

interface Props {
    facts: Facturas[];
}

function FactsEnPreparacionList({facts} : {facts : Facturas[]}) {
   console.log("este es el tipo de dato: ", typeof(facts))
    console.log("-----------------------")
    
    if(!facts){
        return(<Text>NO ARRAY</Text>)
    }else{
        console.log("arreglo correcto : ", facts);
    }
    
      const renderItem = ({ item }: { item: Facturas }) => (
        <View style={{ padding: 10 }}>
          <Text>Referencia: {item.ref_factura}</Text>
          <Text>Cliente: {item.cliente}</Text>
          <Text>Lista de empaque: {item.lista_empaque}</Text>
          <Text>Nombre: {item.nombre}</Text>
          <Text>Placa: {item.placa}</Text>
          <Text>Ubicaciones: {item.ubicaciones}</Text>
          <Text>Cajas: {item.cant_cajas}</Text>
          <Text>Unidades: {item.cant_unidades}</Text>
        </View>
      );

    if(!facts){
        return(
            <Text>SIN FACTURAS</Text>
        )
    }else{
        //setfactura(facts);
        return(
          <View style={styles_made.full_card}>
            <FlatList
            data={facts}
            renderItem={renderItem}
             keyExtractor={(item) => item.id.toString()}
          />
          </View>
        )
    }
    }
   
    
    export default FactsEnPreparacionList;