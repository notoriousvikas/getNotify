import {Queue} from "bullmq"
import { redisConnection } from "../connection.js"

const dlqueue = new Queue('queue',{connection:redisConnection});

export const addTodlq = async(job,error)=>{
    return await dlqueue.add(
        "failed-emails",{
           originalJob:{
            id:job.id,
            name:job.name,
            data:job.data,

           },
           failures:{
            reason:error.message,
             stacktrace: job.stacktrace,
             attempts:job.attempts,
             failedAt: new Date().toISOString(),
           }
        }
    )
}