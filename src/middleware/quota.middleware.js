import { Organization } from "../models/organizastion.model.js";
import {Project} from "../models/project.model.js"
export const  checkingOrganisation = async(req,res,next)=>{
    const User = req.user._id;
    if(!User){
       throw new Error("please make login first");
    }
    const organisation = await Organization.find({owner})
    if(organisation===1){
        throw new Error("you can't make more otganisation then 1")
    }
   next();
}

export const checkProject = async (req,res,next)=>{
    const maxproject =3;
    const User = req.user._id;
    const orgaisationId = req.params.orgaisationId
    if(!User){
       throw new Error("please make login first");
    }
    const project  = await Project.find({orgaisationId})
   

}

