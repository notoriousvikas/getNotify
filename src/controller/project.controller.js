import { Project } from "../models/project.model.js";
import { Organization } from "../models/organizastion.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";

// Helper to generate a URL-safe slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


const createProject = catchAsync(async (req, res) => {
  const organizationId = req.params.organizationId || req.body.organizationId;
  const { name, slug, description, setting, status } = req.body;

  if (!organizationId) {
    throw new AppError("Organization ID is required", 400);
  }

  if (!name) {
    throw new AppError("Project name is required", 400);
  }

  // Verify that the organization exists
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  // Derive or sanitize slug
  const projectSlug = slug ? generateSlug(slug) : generateSlug(name);

  // Check if a project with the same slug already exists in this organization
  const existingProject = await Project.findOne({
    organizationId,
    slug: projectSlug,
  });

  if (existingProject) {
    throw new AppError(
      "A project with this slug already exists in this organization",
      400
    );
  }

  const project = await Project.create({
    name,
    slug: projectSlug,
    organizationId,
    description,
    setting,
    status: "active",
  });

  res.status(201).json({
    status: "success",
    data: project,
  });
});


const updateProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { name, slug, description, setting, status } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (slug !== undefined) {
    const formattedSlug = generateSlug(slug);
    // Ensure slug doesn't conflict with another project in the same organization
    const conflict = await Project.findOne({
      organizationId: project.organizationId,
      slug: formattedSlug,
      _id: { $ne: projectId },
    });
    if (conflict) {
      throw new AppError(
        "A project with this slug already exists in this organization",
        400
      );
    }
    updateData.slug = formattedSlug;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (setting !== undefined) {
    updateData.setting = setting;
  }

  // Update status field ("active" | "inactive")
  if (status !== undefined) {
    if (!["active", "inactive"].includes(status)) {
      throw new AppError("Status must be either 'active' or 'inactive'", 400);
    }
    updateData.status = status;
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedProject,
  });
});

// @desc    Get all projects for an organization
// @route   GET /api/organizations/:organizationId/projects
const getProjectsByOrganization = catchAsync(async (req, res) => {
  const { organizationId } = req.params;

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const projects = await Project.find({ organizationId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: projects,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).populate(
    "organizationId",
    "name slug plan"
  );

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: project,
  });
});


const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Project deleted successfully",
  });
});

export {
  createProject,
  updateProject,
  getProjectsByOrganization,
  getProjectById,
  deleteProject,
};
