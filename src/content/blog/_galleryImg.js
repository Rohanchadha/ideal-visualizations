// Helpers for blog posts to reference real Drive images by ID.
// Keeps the `src/content/blog/posts/*.jsx` files free of long URLs.

export const driveImg = (id, size = 1200) =>
    `https://lh3.googleusercontent.com/d/${id}=w${size}`;

export const driveThumb = (id) => driveImg(id, 600);
