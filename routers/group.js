const express = require("express");
const {
  createGroup,
  addMember,
  removeMember,
} = require("../controllers/group");
const {
  groupSchema,
  manageMemberSchema,
} = require("../utils/validate-schema/group");
const validate = require("../middleware/joi-validate");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE a group
router.post("/groups", auth, validate(groupSchema), createGroup);

// ADD a member to a group
router.post(
  "/groups/add-member",
  auth,
  validate(manageMemberSchema),
  addMember,
);

// REMOVE a member from a group
router.post(
  "/groups/remove-member",
  auth,
  validate(manageMemberSchema),
  removeMember,
);

module.exports = router;
