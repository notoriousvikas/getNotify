import {Project} from "../models/project.model.js"
import {ApiKey} from "../models/apiKey.model.js"
export const verifyProjectApiKey = async(req,res,next)=>{
    try {
        const apiKey = req.headers['x-api-key'];
        if(!apiKey){
            return res.status(401).json({message:"API key is required"})
        }

        const keyHash= ApiKey.hashKey(apiKey)
        
        const apiKeyDoc = await ApiKey.findOne({keyHash:keyHash});
   
        if(!apiKeyDoc){
            return res.status(401).json({message:"Invalid API key"})
        }
             if(apiKeyDoc.isValid()===false){
             return res.status(401).json({message:"Api key is expired"})
        }
 
        req.projectId = apiKeyDoc.projectId;
        next();

    } catch (error) {
        console.error("Error verifying API key:", error);
        next(error)
    }
}