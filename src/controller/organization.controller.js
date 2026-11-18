import { Organization } from "../models/organizastion.model.js";
import { setCache,getCache } from "../utils/redis/cache.redis.js";
import {User} from "../models/user.model.js"
import { catchAsync, AppError

 } from "../middleware/error.middleware.js";
import Usage from "../models/usage.model.js"

const createOrganization = catchAsync(async (req, res) => {
  const { name, description } = req.body;
     const month =new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    if (!name) {
    throw new AppError("Organization name is required", 400);}
    if(!description){
        throw new AppError("Organization description is required", 400);
    }
    const UserId = req.user._id;
    const organization = await Organization.create({
        name,
        slug:name.toLowerCase().replace(/\s+/g,"-"),
        description,
        owner:UserId,
        plan:"free"
    })

    if(!organization){
        throw new AppError("Failed to create organization", 500);
    }
    await Usage.create({organizationId:organization._id,resetAt:month})
    res.status(201).json({
        status: "success",
        data: organization
    });
});


const updateOrganization = catchAsync(async (req, res) => {
  const { organizationId } = req.params;
  const { name, description, plan } = req.body;
  const formData = {};
  if (name) {
    formData.name = name;
    formData.slug = name.toLowerCase().replace(/\s+/g, "-");
  }
  if (description) {
    formData.description = description;
  }
  if (plan) {
    formData.plan = plan;
  }
  const organization = await Organization.findByIdAndUpdate(
    organizationId,
    formData,
    { new: true, runValidators: true }
  );
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: organization,
  });
});

const getOrganization = catchAsync(async (req, res) => {
  const { organizationId } = req.params;
  const organization = await Organization.findById(organizationId).populate(
    "owner",
    "name email"
  );
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: organization,
  });
});

const getOrganizationByUserId = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const cacheKey= `organisation:${userId}`
  const cached = await getCache(cacheKey);
if(cached){
  return res.status(200).json({
       status: "success",
    results: cached.length,
    data: cached,
  })
}
  const organizations = await Organization.find({ owner: userId }).lean();
  console.log("reaching mongo")
   await setCache(cacheKey,JSON.stringify(organizations),600)
 

  res.status(200).json({
    status: "success",
    results: organizations.length,
    data: organizations,
  });
   
})

export { createOrganization, updateOrganization, getOrganization, getOrganizationByUserId };
