import { useEffect, useState } from "react";
import { client } from "../lib/sanityClient";

/** ✅ Match your Sanity schema fields */
export type Suggestion = {
  _id: string;
  _type: "Suggestion";
  suggestion?: string;
  suggestion_date?: string; // Sanity "date" is returned as ISO string (YYYY-MM-DD)
  suggestion_category?: string;
  suggestion_description?: string;
  suggestion_person_name?: string;
  suggestion_person_nbr?: string;
  suggestion_person_email?: string;
};

export default function useGetAllSuggestions(
  search: string,
  selectedCategory: string,
) {
  const [suggestionList, setSuggestionList] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    // Build GROQ search safely:
    // - if search is empty => don't filter by search
    // - if selectedCategory is empty => don't filter by category
    const query = `*[
      _type == "Suggestion" &&
      (
        $search == "" ||
        suggestion match $search ||
        suggestion_description match $search ||
        suggestion_person_name match $search ||
        suggestion_person_email match $search
      ) &&
      (
        $selectedCategory == "" ||
        suggestion_category == $selectedCategory
      )
    ]{
      _id,
      _type,
      suggestion,
      suggestion_date,
      suggestion_category,
      suggestion_description,
      suggestion_person_name,
      suggestion_person_nbr,
      suggestion_person_email
    } | order(suggestion_date desc)`;

    const params = {
      // GROQ match uses wildcard patterns like "*term*"
      search: search ? `*${search}*` : "",
      selectedCategory: selectedCategory || "",
    };

    client
      .fetch(query, params)
      .then((data: any[]) => {
        if (cancelled) return;

        const mapped: Suggestion[] = (data || []).map((d) => ({
          _id: d._id,
          _type: "Suggestion",
          suggestion: d.suggestion,
          suggestion_date: d.suggestion_date,
          suggestion_category: d.suggestion_category,
          suggestion_description: d.suggestion_description,
          suggestion_person_name: d.suggestion_person_name,
          suggestion_person_nbr: d.suggestion_person_nbr,
          suggestion_person_email: d.suggestion_person_email,
        }));

        setSuggestionList(mapped);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch suggestions:", err);
        if (cancelled) return;
        setError("Failed to fetch suggestion documents");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, selectedCategory]);

  return { suggestionList, loading, error };
}
