export interface Facturas{
    ref_declaracion_envio : number;
    id: number,
    ref_factura: string,
    cliente_nombre: string,
    cant_cajas: number,
    cant_unidades: number,
    lista_empaque: string,
    state_name: string,
    nombre: string,
    placa: string,
    ubicaciones: string,
    fech: string,
    fech_hora_entrega : string,
    hasSing : boolean,
    hasPic : boolean,
    hasId : string,
    nameSing?: string | FormData,
    namePic?: string | FormData,
    state : string,
    is_Sinchro :boolean,            //this is to check is fact is already synchro with the server
    is_check : boolean            // this is for guardia things, that is for to check is the cant of boxes is full
}