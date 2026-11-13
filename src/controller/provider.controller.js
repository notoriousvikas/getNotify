import mongoose from "mongoose";
import { Provider } from "../models/provider.model.js";
import { Project } from "../models/project.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";

const ALLOWED_CHANNELS = ["email", "sms", "push", "in_app"];


export const createProvider = catchAsync(async (req, res) => {
  const {
    projectId,
    provider,
    channel,
    type = "custom",
    apiKey,
    config,
    isActive = true,
    isDefault = false,
  } = req.body;

  if (!provider) {
    throw new AppError("Provider name is required (e.g. 'resend', 'smtp', 'twilio')", 400);
  }

  if (!channel) {
    throw new AppError("Notification channel is required", 400);
  }

  if (!ALLOWED_CHANNELS.includes(channel)) {
    throw new AppError(
      `Invalid channel. Allowed channels: ${ALLOWED_CHANNELS.join(", ")}`,
      400
    );
  }

  if (type && !["system", "custom"].includes(type)) {
    throw new AppError("Type must be either 'system' or 'custom'", 400);
  }

  // Validate projectId if provided
  if (projectId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError("Invalid Project ID format", 400);
    }
    const project = await Project.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", 404);
    }
  }


  if (type === "custom") {
    const isSmtp = provider.toLowerCase() === "smtp";
    if (isSmtp && (!config || !config.host)) {
      throw new AppError("SMTP provider requires host configuration in 'config'", 400);
    }
    if (!isSmtp && !apiKey) {
      throw new AppError(`API key is required for provider '${provider}'`, 400);
    }
  }

  // If this provider is marked as default, unset any existing default for this project & channel
  if (isDefault) {
    await Provider.updateMany(
      {
        projectId: projectId || null,
        channel,
        isDefault: true,
      },
      { isDefault: false }
    );
  }

  const newProvider = await Provider.create({
    projectId: projectId || null,
    provider: provider.toLowerCase(),
    channel,
    type,
    apiKey,
    config,
    isActive,
    isDefault,
  });

  res.status(201).json({
    status: "success",
    data: newProvider,
  });
});

export const getProviders = catchAsync(async (req, res) => {
  const projectId = req.query.projectId || req.params.projectId;
  const channel = req.query.channel;

  const filter = {};

  if (projectId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError("Invalid Project ID format", 400);
    }
    // Include both project-specific providers and global system providers
    filter.$or = [{ projectId }, { projectId: null, type: "system" }];
  }

  if (channel) {
    if (!ALLOWED_CHANNELS.includes(channel)) {
      throw new AppError(
        `Invalid channel filter. Allowed channels: ${ALLOWED_CHANNELS.join(", ")}`,
        400
      );
    }
    filter.channel = channel;
  }

  const providers = await Provider.find(filter).sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: providers.length,
    data: providers,
  });
});

export const getProviderById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Provider ID format", 400);
  }

  const provider = await Provider.findById(id);

  if (!provider) {
    throw new AppError("Provider not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: provider,
  });
});


export const updateProvider = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { apiKey, config, isActive, isDefault, provider, channel } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Provider ID format", 400);
  }

  const existingProvider = await Provider.findById(id);
  if (!existingProvider) {
    throw new AppError("Provider not found", 404);
  }

  const targetChannel = channel || existingProvider.channel;
  const targetProjectId = existingProvider.projectId;

  // If setting as default, unset any other default provider for this project & channel
  if (isDefault === true) {
    await Provider.updateMany(
      {
        _id: { $ne: id },
        projectId: targetProjectId,
        channel: targetChannel,
        isDefault: true,
      },
      { isDefault: false }
    );
  }

  const updateFields = {};
  if (apiKey !== undefined) updateFields.apiKey = apiKey;
  if (config !== undefined) updateFields.config = { ...existingProvider.config, ...config };
  if (isActive !== undefined) updateFields.isActive = isActive;
  if (isDefault !== undefined) updateFields.isDefault = isDefault;
  if (provider !== undefined) updateFields.provider = provider.toLowerCase();
  if (channel !== undefined) {
    if (!ALLOWED_CHANNELS.includes(channel)) {
      throw new AppError(`Invalid channel: ${channel}`, 400);
    }
    updateFields.channel = channel;
  }

  const updatedProvider = await Provider.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedProvider,
  });
});


export const setDefaultProvider = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Provider ID format", 400);
  }

  const provider = await Provider.findById(id);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }


  await Provider.updateMany(
    {
      _id: { $ne: id },
      projectId: provider.projectId,
      channel: provider.channel,
      isDefault: true,
    },
    { isDefault: false }
  );

  provider.isDefault = true;
  provider.isActive = true;
  await provider.save();

  res.status(200).json({
    status: "success",
    message: `Provider '${provider.provider}' is now the default for '${provider.channel}'`,
    data: provider,
  });
});

// @desc    Delete a provider
// @route   DELETE /api/v1/providers/:id
export const deleteProvider = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Provider ID format", 400);
  }

  const provider = await Provider.findByIdAndDelete(id);

  if (!provider) {
    throw new AppError("Provider not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Provider deleted successfully",
  });
});
