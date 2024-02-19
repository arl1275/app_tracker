export interface Facturas{
    id_dec_env : number,
    declaracionenvio : number,
    factura_id : number,
    factura: string,
    clientenombre: string,
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
    is_Sinchro : boolean,               //this is to check is fact is already synchro with the server
    is_check : boolean                  // this is for guardia things, that is for to check is the cant of boxes is full
}