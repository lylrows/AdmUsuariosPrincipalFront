export interface Result {
    stateCode: number;
    messageError: any[];
    //data: any[];
    data: any;
    dataDetail: any;
    lastId: number;
}

export interface BasicEchartLineModel{

    name:string;
    value:number;
}
