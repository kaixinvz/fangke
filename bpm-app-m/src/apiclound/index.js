/**
 * method  apiClound 
 * @param { String } [ type ] - 引用参数
 * @param { String } [ isApi ] - 调用方法
 * @param { Boolean } [ parramsStatus ] - 是否存在对象参数
 * @param { Object } [ params ] - 对象   选填
 * @param { Function } [ params ] - 回调函数 返回结果 
 */

export default function apiClound({type,isApi,parramsStatus,params},callback) {
    const  isType = api.require(type); 
   isType[isApi](parramsStatus?params:callback,callback);
}