const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const resourceController = require("../controllers/resourceController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  resourceController.uploadResource
);

router.get("/trending", resourceController.getTrendingResources);
router.get("/my", authMiddleware, resourceController.getMyResources);

router.get("/bookmarks", authMiddleware, resourceController.getBookmarkedResources);
router.get("/admin/all", adminMiddleware, resourceController.getResources);
router.get("/search", resourceController.searchResources);
router.get("/smart-search", resourceController.smartSearchResources);
router.get("/download/:id", resourceController.downloadResource);
router.get("/comment/:id", resourceController.getComments);
router.get("/", resourceController.getResources);

router.post("/like/:id", resourceController.likeResource);
router.post("/bookmark/:id", authMiddleware, resourceController.bookmarkResource);
router.post("/comment/:id", resourceController.addComment);
router.get("/comments/:id", resourceController.getComments);


router.delete("/bookmark/:id", authMiddleware, resourceController.removeBookmark);
router.delete("/:id", resourceController.deleteResource);
router.put("/:id", authMiddleware, resourceController.editResource);
router.get("/ai-search", resourceController.aiSearch);
router.get("/recommendations", authMiddleware, resourceController.getRecommendations);
router.get("/summary/:id", resourceController.summarizeResource);
router.get("/ai-search", resourceController.aiSearchResources);


router.delete("/:id", async (req, res) => {

  try {

    const Resource = require("../models/Resource");

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: "Error deleting resource" });

  }

});


module.exports = router;