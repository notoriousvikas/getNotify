import mongoose from "mongoose";
import { Organization } from "../models/organizastion.model.js";
import { Project } from "../models/project.model.js";
import { Provider } from "../models/provider.model.js";
import { AppError, catchAsync } from "./error.middleware.js";

/**
 * Helper to resolve organizationId from organizationId, projectId, or providerId in the request
 */
const resolveOrganizationId = async (req) => {
  let organizationId =
    req.params.organizationId ||
    req.body.organizationId ||
    req.query.organizationId ||
    req.headers["x-organization-id"];

  if (organizationId) return organizationId;

  // Check if projectId is available
  let projectId =
    req.params.projectId || req.body.projectId || req.query.projectId;

  // Check if id/providerId in params corresponds to a Provider
  const targetId = req.params.providerId || req.params.id;
  if (!projectId && targetId && mongoose.Types.ObjectId.isValid(targetId)) {
    const provider = await Provider.findById(targetId);
    if (provider && provider.projectId) {
      projectId = provider.projectId;
      req.provider = provider;
    }
  }

  // Resolve organizationId from Project
  if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
    const project = await Project.findById(projectId);
    if (project) {
      req.project = project;
      return project.organizationId;
    }
  }

  return null;
};

/**
 * Middleware to verify that the authenticated user belongs to the target organization
 */
export const verifyOrganizationMember = catchAsync(async (req, res, next) => {
  const userId = req.user?._id || req.id;
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const organizationId = await resolveOrganizationId(req);

  if (!organizationId) {
    throw new AppError("Organization or Project reference is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    throw new AppError("Invalid Organization ID format", 400);
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const isOwner = organization.owner?.toString() === userId.toString();
  const isMember = organization.members?.some(
    (member) => (member.user?.toString() || member.toString()) === userId.toString()
  );

  if (!isOwner && !isMember) {
    throw new AppError("You do not have access to this organization", 403);
  }

  req.organization = organization;
  req.isOrgOwner = isOwner;

  next();
});

/**
 * Middleware to restrict access only to the organization owner
 */
export const verifyOrganizationOwner = catchAsync(async (req, res, next) => {
  const userId = req.user?._id || req.id;
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }
  
  const organizationId = await resolveOrganizationId(req);

  if (!organizationId) {
    throw new AppError("Organization or Project reference is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    throw new AppError("Invalid Organization ID format", 400);
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (organization.owner?.toString() !== userId.toString()) {
    throw new AppError("Only the organization owner can perform this action", 403);
  }

  req.organization = organization;
  req.isOrgOwner = true;

  next();
});

// Aliases
export const checkOrganizationAccess = verifyOrganizationMember;
export default verifyOrganizationMember;
