import {redis} from "../../config/rediscache.js";
import { AppError } from "../../middleware/error.middleware.js";
export const setCache=async(key, data, ttl=3600)=>{
    console.log(
        "setting cache"
    )
    if(!key || !data){
        throw new AppError("data is required for seting cache",400);
    }
    const setcache = await redis.set(key,data,{ex:ttl});
    if(!setcache){
        throw new AppError("set cache cannot be done",500)
    }
    return setcache;
}

export const getCache = async(key)=>{
    console.log("getcache")
    if(!key){
        throw new AppError("key is required in getting cache")
    }
    const getcache = await redis.get(key)

    return getcache;
}