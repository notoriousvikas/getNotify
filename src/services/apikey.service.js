import { AppError } from "../middleware/error.middleware.js"
import {Project} from "../models/project.model.js";
import {Organization} from "../models/organizastion.model.js"
import {ApiKey} from "../models/apiKey.model.js";

export const apiKeyService = async ({ name, projectId, userId }) => {
  if (!name || !projectId || !userId) { 
    throw new AppError("name, projectId and user are required", 400);
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  
  const organization = await Organization.findOne({
    _id: project.organizationId,
    owner: userId,
  });
  if (!organization) {
    throw new AppError("User is not the owner of the project", 403);
  }

  const { rawKey, keyHash, maskedKey, keyPrefix } = ApiKey.generateApiKey();
  const apiKey = await ApiKey.create({
    name,
    projectId,
    user: userId,
    keyHash,
    maskedKey,
    keyPrefix,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { apiKey, rawKey };
};