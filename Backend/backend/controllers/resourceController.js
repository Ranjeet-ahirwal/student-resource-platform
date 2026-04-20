const Resource = require("../models/Resource");
const { generateEmbedding, cosineSimilarity } = require("../utils/embedding");

exports.uploadResource = async (req, res) => {
  try {
    const textForEmbedding = `${req.body.title || ""}. ${req.body.description || ""}`;
    const embedding = await generateEmbedding(textForEmbedding);

    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      file: req.file.filename,
      userId: req.user.id,
      embedding
    });

    await resource.save();

    res.json({
      message: "Resource uploaded successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
//const Resource = require("../models/Resource");

exports.getResources = async (req, res) => {

  try {

    const resources = await Resource.find();

    res.json(resources);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


//

exports.searchResources = async (req, res) => {
  try {

    const query = req.query.query;

    const resources = await Resource.find({
      title: { $regex: query, $options: "i" }
    });

    res.json(resources);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


//

exports.deleteResource = async (req, res) => {

  try {

    const Resource = require("../models/Resource");

    const resource = await Resource.findById(req.params.id);

    if (resource.userId.toString() !== req.user.id) {

      return res.status(403).json({
        message: "You can delete only your resources"
      });

    }

    await resource.deleteOne();

    res.json({
      message: "Resource deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

//
exports.myResources = async (req, res) => {

  try {

    const Resource = require("../models/Resource");

    const resources = await Resource.find({
      user: req.user.id
    });

    res.json(resources);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// 

exports.downloadResource = async (req, res) => {
  try {
    const Resource = require("../models/Resource");
    const path = require("path");

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.downloads = (resource.downloads || 0) + 1;
    await resource.save();

    const filePath = path.join(__dirname, "..", "uploads", resource.file);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//

exports.likeResource = async (req, res) => {

  try {

    const Resource = require("../models/Resource");

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.likes = (resource.likes || 0) + 1;

    await resource.save();

    res.json(resource);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

//

exports.addComment = async (req, res) => {

  try {

    const Comment = require("../models/Comment");

    const comment = new Comment({
      resourceId: req.params.id,
      text: req.body.text
    });

    await comment.save();

    res.json(comment);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getComments = async (req, res) => {

  try {

    const Comment = require("../models/Comment");

    const comments = await Comment.find({
      resourceId: req.params.id
    });

    res.json(comments);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

//

exports.bookmarkResource = async (req, res) => {

  try {

    const User = require("../models/User");

    const user = await User.findById(req.user.id);

    user.bookmarks.push(req.params.id);

    await user.save();

    res.json({
      message: "Resource bookmarked"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

//

exports.bookmarkResource = async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.id);

    if (!user.bookmarks.includes(req.params.id)) {
      user.bookmarks.push(req.params.id);
      await user.save();
    }

    res.json({ message: "Resource bookmarked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//

exports.getTrendingResources = async (req, res) => {

  try {

    const Resource = require("../models/Resource");

    const resources = await Resource.find();

    const trending = resources.sort((a, b) => {

      const scoreA = (a.likes || 0) + (a.downloads || 0);
      const scoreB = (b.likes || 0) + (b.downloads || 0);

      return scoreB - scoreA;

    });

    res.json(trending.slice(0,5));

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

//

exports.smartSearchResources = async (req, res) => {
  try {
    const Resource = require("../models/Resource");
    const Comment = require("../models/Comment");

    const query = (req.query.query || "").trim();

    if (!query) {
      return res.json([]);
    }

    const resourceMatches = await Resource.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });

    const commentMatches = await Comment.find({
      text: { $regex: query, $options: "i" }
    });

    const commentResourceIds = commentMatches.map(c => c.resourceId.toString());

    const extraResources = await Resource.find({
      _id: { $in: commentResourceIds }
    });

    const combined = [...resourceMatches, ...extraResources];

    const uniqueResources = combined.filter(
      (resource, index, self) =>
        index === self.findIndex(r => r._id.toString() === resource._id.toString())
    );

    res.json(uniqueResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//

exports.getBookmarkedResources = async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.id).populate("bookmarks");

    res.json(user.bookmarks || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//

exports.getMyResources = async (req, res) => {
  try {
    const Resource = require("../models/Resource");

    console.log("REQ USER ID:", req.user.id);

    const resources = await Resource.find({ userId: req.user.id });

    console.log("MY RESOURCES:", resources);

    const totalLikes = resources.reduce((sum, r) => sum + (r.likes || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

    res.json({
      totalUploads: resources.length,
      totalLikes,
      totalDownloads,
      resources
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
//

exports.removeBookmark = async (req, res) => {

  try {

    const User = require("../models/User");

    const user = await User.findById(req.user.id);

    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "Bookmark removed" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

//

exports.editResource = async (req, res) => {
  try {
    const Resource = require("../models/Resource");

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can edit only your own resources"
      });
    }

    resource.title = req.body.title || resource.title;
    resource.description = req.body.description || resource.description;

    await resource.save();

    res.json({
      message: "Resource updated successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//

exports.getComments = async (req, res) => {

  try {

    const Resource = require("../models/Resource");

    const resource = await Resource.findById(req.params.id);

    res.json(resource.comments || []);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

//

exports.removeBookmark = async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.id);

    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      message: "Bookmark removed"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//
exports.smartSearchResources = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.json([]);
    }

    const resources = await Resource.find();

    const results = resources.map((r) => {
      const text = (r.title + " " + r.description).toLowerCase();

      const score = query
        .toLowerCase()
        .split(" ")
        .reduce((acc, word) => {
          if (text.includes(word)) return acc + 1;
          return acc;
        }, 0);

      return { ...r._doc, score };
    });

    const filtered = results
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//

exports.aiSearch = async (req, res) => {
  try {
    const query = req.query.query;

    const queryEmbeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query
    });

    const queryEmbedding = queryEmbeddingRes.data[0].embedding;

    const resources = await Resource.find();

    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (magA * magB);
    };

    const scored = resources.map(r => ({
      ...r._doc,
      score: cosineSimilarity(queryEmbedding, r.embedding || [])
    }));

    const sorted = scored.sort((a, b) => b.score - a.score);

    res.json(sorted.slice(0, 10));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResources = await Resource.find({ userId });

    if (userResources.length === 0) {
      const random = await Resource.find().limit(6);
      return res.json(random);
    }

    const keywords = userResources
      .map(r => (r.title + " " + r.description).toLowerCase())
      .join(" ")
      .split(" ");

    const resources = await Resource.find();

    const scored = resources.map(r => {
      const text = (r.title + " " + r.description).toLowerCase();

      let score = 0;
      keywords.forEach(word => {
        if (text.includes(word)) score++;
      });

      return { ...r._doc, score };
    });

    const sorted = scored
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    res.json(sorted.slice(0, 6));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

exports.summarizeResource = async (req, res) => {
  try {
    const Resource = require("../models/Resource");
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        summary: "Resource not found"
      });
    }

    const title = resource.title || "";
    const description = resource.description || "";
    const text = `${title}. ${description}`.toLowerCase();

    let summary = "";

    if (text.includes("dsa")) {
      summary =
        `This resource is about ${resource.title}. It mainly focuses on Data Structures and Algorithms, which are important for coding interviews and efficient problem solving. You should focus on concepts like arrays, linked lists, stacks, queues, trees, graphs, and time complexity.`;
    } else if (text.includes("java")) {
      summary =
        `This resource is about ${resource.title}. It mainly covers Java programming concepts such as object-oriented programming, classes, objects, inheritance, polymorphism, exception handling, and collections. It is useful for building a strong programming foundation.`;
    } else if (text.includes("dbms")) {
      summary =
        `This resource is about ${resource.title}. It focuses on DBMS concepts like database design, normalization, SQL, keys, relationships, transactions, and indexing. It is helpful for understanding how structured data is stored and managed.`;
    } else if (text.includes("react")) {
      summary =
        `This resource is about ${resource.title}. It mainly covers React concepts such as components, props, state, hooks, routing, and reusable UI development. It is useful for building modern frontend applications.`;
    } else if (text.includes("os") || text.includes("operating system")) {
      summary =
        `This resource is about ${resource.title}. It focuses on Operating System concepts like process management, memory management, CPU scheduling, deadlocks, and file systems. These are important for system-level understanding and interviews.`;
    } else if (text.includes("cn") || text.includes("network")) {
      summary =
        `This resource is about ${resource.title}. It covers Computer Networks concepts such as protocols, IP addressing, routing, switching, layers, and communication models. It is useful for understanding network communication fundamentals.`;
    } else {
      summary =
        `This resource is titled "${resource.title}". ${resource.description}. It appears to contain useful study material, and you should focus on the main concepts, definitions, and practical examples described in it.`;
    }

    res.json({ summary });
  } catch (error) {
    console.error("SUMMARY ERROR:", error);
    res.status(500).json({
      summary: "Could not generate summary"
    });
  }
};

//
exports.aiSearchResources = async (req, res) => {
  try {
    const query = (req.query.query || "").trim();

    if (!query) {
      const resources = await Resource.find();
      return res.json(resources);
    }

    const queryEmbedding = await generateEmbedding(query);
    const resources = await Resource.find();

    const scored = resources.map((r) => {
      const score = cosineSimilarity(queryEmbedding, r.embedding || []);
      return {
        ...r._doc,
        score
      };
    });

    const filtered = scored
      .filter((r) => r.score > 0.2)
      .sort((a, b) => b.score - a.score);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};