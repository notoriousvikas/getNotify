import {apiKeyService} from "../services/apikey.service.js";
import {catchAsync} from "../middleware/error.middleware.js";
import {ApiKey} from "../models/apiKey.model.js"
  
const createApiKey = catchAsync(async (req, res) => {
  const { name, projectId } = req.body;
  const userId = req.user._id;
  const { apiKey, rawKey } = await apiKeyService({ name, projectId, userId });
  const {
    _id,
    name: keyName,
    maskedKey,
    keyPrefix,
    projectId: keyProjectId,
    permissions,
    rateLimit,
    isActive,
    expiresAt,
    createdAt,
  } = apiKey;

  res.status(201).json({
    status: "success",
    data: {
      _id,
      name: keyName,
      maskedKey,
      keyPrefix,
      projectId: keyProjectId,
      permissions,
      rateLimit,
      isActive,
      expiresAt,
      createdAt,
      rawKey,
    },
  });
});

const getApiKeys = catchAsync(async(req,res)=>{
  const { projectId } = req.params;
  const apiKeys = await ApiKey.find({ projectId: projectId })
    .select("name maskedKey keyPrefix projectId permissions rateLimit isActive expiresAt lastUsedAt createdAt updatedAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: apiKeys.length,
    data: apiKeys,
  });
})

export {createApiKey,getApiKeys}