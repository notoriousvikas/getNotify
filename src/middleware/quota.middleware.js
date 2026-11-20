import { tryCatch } from "bullmq";
import { Organization } from "../models/organizastion.model.js";
import {Project} from "../models/project.model.js"
export const  checkingOrganisation = async(req,res,next)=>{
try {
        const User = req.user._id;
    if(!User){
       throw new Error("please make login first");
    }
    const organisation = await Organization.exists({owner:User})
      console.log(organisation)
      console.log("organisation length",organisation.length)
    if(organisation.length){
     return res
        .status(403)
        .json({ message: "You can't create more than 1 organization" });
    }
   next();
} catch (error) {
    next(error)
}
}

export const checkProject = async (req,res,next)=>{
  try {
         const maxProject = 3;

    const userId = req.user?._id;

     const organizationId = req.params.organizationId || req.body.organizationId;
    console.log(organizationId)

    if (!userId) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    // Verify organization ownership
    const organization = await Organization.exists({
      _id: organizationId,
      owner: userId,
    });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // Count existing projects
    const projectCount = await Project.countDocuments({
      organizationId,
    });

    if (projectCount >= maxProject) {
      return res.status(403).json({
        message: `You can't create more than ${maxProject} projects`,
      });
    }
 next()
  } catch (error) {
    next(error)
  }

}

