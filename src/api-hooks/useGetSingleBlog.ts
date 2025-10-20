import { useEffect, useState } from "react";
import { BlogType } from "@/types";
import { client } from "@/lib/sanityClient";

export default function useGetSingleBlog(id: string) {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    client
      .fetch(
        `*[_type == "blogs" && _id == $id][0]{
          _id,
          title,
          category,
          description,
          "image": image.asset->url,
          date,
          content
        }`,
        { id }
      )
      .then((data) => {
        const blog = {
          title: data.title,
          category: data.category,
          description: data.description,
          image: data.image,
          date: data.date,
          content: data.content, // Content comes as an array of blocks
          id: data._id,
        };

        setBlog(blog);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blog");
        setLoading(false);
      });
  }, [id]);

  return { blog, loading, error };
}
