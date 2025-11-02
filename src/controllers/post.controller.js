import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const post = await Post.create({
      userId: req.user._id,
      content,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.userId) !== String(req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    post.content = req.body.content || post.content;
    post.updatedAt = Date.now();
    await post.save();

    res.json({ message: "Post updated", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
