const AppError = require("../utils/AppError");
const Group = require("../model/group");

// CREATE GROUP
const createGroup = async (req, res, next) => {
  const { name } = req.body;
  const user = req.user;

  // The creator automatically becomes an admin and member of the group
  const group = await Group.create({
    name,
    admins: [user._id],
    members: [user._id],
  });

  res.status(201).json({ message: "Group created successfully", group });
};

// ADD MEMBER TO GROUP
const addMember = async (req, res, next) => {
  const { groupId, userId } = req.body;
  const group = await Group.findById(groupId);

  if (!group) throw new AppError("Group not found", 404);

  // Business Logic: Only group admins manage users, Super admin overrides
  const isAdmin = group.admins.includes(req.user._id);
  if (!isAdmin && req.user.role !== "superAdmin") {
    throw new AppError("Only group admins can add members", 403);
  }

  if (group.members.includes(userId)) {
    throw new AppError("User is already a member", 400);
  }

  group.members.push(userId);
  await group.save();

  res.status(200).json({ message: "Member added successfully", group });
};

// REMOVE MEMBER FROM GROUP
const removeMember = async (req, res, next) => {
  const { groupId, userId } = req.body;
  const group = await Group.findById(groupId);

  if (!group) throw new AppError("Group not found", 404);

  // Business Logic: Only group admins manage users, Super admin overrides
  const isAdmin = group.admins.includes(req.user._id);
  if (!isAdmin && req.user.role !== "superAdmin") {
    throw new AppError("Only group admins can remove members", 403);
  }

  // Filter out the user from both members and admins arrays
  group.members = group.members.filter(
    (id) => id.toString() !== userId.toString(),
  );
  group.admins = group.admins.filter(
    (id) => id.toString() !== userId.toString(),
  );

  await group.save();

  res.status(200).json({ message: "Member removed successfully", group });
};

module.exports = { createGroup, addMember, removeMember };
