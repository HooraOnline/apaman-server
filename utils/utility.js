const logger = require('./winstonLogger');

function setSqlPublicParam(sqlReq,params,userId, BigInt) {
    if(params.CallerUnitID =='null') {
        params.CallerUnitID =null;
    }
    if(params.CallerFormID && params.CallerFormID!='null'){
        sqlReq.input('CallerFormID', BigInt, params.CallerFormID);
    }
    if(params.CallerBuildingID ){
        sqlReq.input('CallerBuildingID', BigInt, eval(params.CallerBuildingID));
    }
    if(params.CallerUnitID){
        sqlReq.input('CallerUnitID', BigInt,eval(params.CallerUnitID));
    }

    sqlReq.input('CallerRoleID', BigInt, params.CallerRoleID);
    sqlReq.input('CallerUserID',BigInt, userId);
}

module.exports = setSqlPublicParam;


