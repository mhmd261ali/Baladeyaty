import { useEffect, useState } from "react";
import { ProjectTagType, ProjectType } from "@/types";
import { client } from "@/lib/sanityClient";

export default function useGetAllProjects(selectedTags: ProjectTagType[] = []) {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Construct the GROQ query
    const query =
      selectedTags.length === 0
        ? `*[_type == "project"]{
          _id,
          title,
          tags,
          description,
          "imageUrl": imageUrl.asset->url,
          projectUrl
        }`
        : `*[_type == "project" && count(tags[@ in $selectedTags]) > 0]{
          _id,
          title,
          tags,
          description,
          "imageUrl": imageUrl.asset->url,
          projectUrl
        }`;

    // Fetch projects from Sanity
    client
      .fetch(query, { selectedTags })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch projects");
        setLoading(false);
      });
  }, [selectedTags]);

  return { projects, loading, error };
}
