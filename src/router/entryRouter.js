const express = require("express");

//enrutador
const router = express.Router();

//Middlewares
const isUser = require("../middlewares/isUser");
const entryExists = require("../middlewares/entryExists");
const commentExists = require("../middlewares/commentExists");
const canEditEntry = require("../middlewares/canEditEntry");
const canEditComment = require("../middlewares/canEditComment");

//traemos las entries
const {
  addPhoto,
  likeEntry,
  deleteEntry,
  searchPhotoDescr,
  commentEntry,
  editComment,
  deleteComment,
} = require("../controllers/entries");

router.get("/entries/photos/search?", searchPhotoDescr);
router.post("/entries/photos", isUser, addPhoto);
router.post("/entries/:idEntry/votes", isUser, entryExists, likeEntry);
router.post("/entries/:idEntry/comment", isUser, entryExists, commentEntry);
router.put(
  "/entries/:idEntry/comment/:idComment",
  isUser,
  entryExists,
  commentExists,
  canEditComment,
  editComment
);
router.delete(
  "/entries/:idEntry/comment/:idComment",
  isUser,
  entryExists,
  commentExists,
  canEditComment,
  deleteComment
);
router.delete(
  "/entries/:idEntry",
  isUser,
  entryExists,
  canEditEntry,
  deleteEntry
);

module.exports = router;
