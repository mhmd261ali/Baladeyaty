import { useEffect, useState } from "react";
import { BlogType } from "@/types";
import { client } from "@/lib/sanityClient";

export default function useGetAllBlogs(search: string, selectedTag: string) {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    client
      .fetch(
        `*[_type == "blogs" && title match $search && (category == $selectedTag || $selectedTag == "")]{
          _id,
          title,
          category,
          description,
          "image": image.asset->url,
          date,
          content
        }`,
        {
          search: `*${search}*`,
          selectedTag,
        }
      )
      .then((data) => {
        const blogs = data.map(
          (blog: {
            title: string;
            category: string;
            description: string;
            image: string;
            date: string;
            _id: string;
          }) => ({
            title: blog.title,
            category: blog.category,
            description: blog.description,
            image: blog.image,
            date: blog.date,
            id: blog._id,
          })
        );

        setBlogs(blogs);
        console.log(blogs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blogs");
        setLoading(false);
      });
  }, [search, selectedTag]);

  return { blogs, loading, error };
}
