import { useEffect, useState } from "react";
import { client } from "../lib/sanityClient";

/** ✅ Match your Sanity schema fields */
export type Complaint = {
  _id: string;
  _type: "Complaints";
  complaint?: string;
  priority?: string;
  complaint_status?: string;
  complaint_date?: string; // ISO date string: YYYY-MM-DD
  complaint_category?: string;
  complaint_place?: string;
  complaint_description?: string;
  complaint_name?: string;
  complaint_person_nbr?: string;

  complaint_images?: Array<{
    _type: "image";
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
    // any other image fields you added later
  }>;

  // convenience: list of image URLs for UI
  imageUrls?: string[];
};

export default function useGetAllComplaints(
  search: string,
  selectedCategory: string,
) {
  const [complaintList, setComplaintList] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const query = `*[
      _type == "Complaints" &&
      (
        $search == "" ||
        complaint match $search ||
        complaint_description match $search ||
        complaint_name match $search ||
        complaint_place match $search ||
        complaint_person_nbr match $search
      ) &&
      (
        $selectedCategory == "" ||
        complaint_category == $selectedCategory
      )
    ]{
      _id,
      _type,
      complaint,
      priority,
      complaint_status,
      complaint_date,
      complaint_category,
      complaint_place,
      complaint_description,
      complaint_name,
      complaint_person_nbr,
      complaint_images[]{
        _type,
        alt,
        asset->{
          _id,
          url
        }
      }
    } | order(complaint_date desc)`;

    const params = {
      search: search ? `*${search}*` : "",
      selectedCategory: selectedCategory || "",
    };

    client
      .fetch(query, params)
      .then((data: any[]) => {
        if (cancelled) return;

        const mapped: Complaint[] = (data || []).map((d) => {
          const urls: string[] =
            d.complaint_images
              ?.map((img: any) => img?.asset?.url)
              .filter(Boolean) || [];

          return {
            _id: d._id,
            _type: "Complaints",
            complaint: d.complaint,
            priority: d.priority,
            complaint_status: d.complaint_status,
            complaint_date: d.complaint_date,
            complaint_category: d.complaint_category,
            complaint_place: d.complaint_place,
            complaint_description: d.complaint_description,
            complaint_name: d.complaint_name,
            complaint_person_nbr: d.complaint_person_nbr,
            complaint_images: d.complaint_images,
            imageUrls: urls,
          };
        });

        setComplaintList(mapped);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch complaints:", err);
        if (cancelled) return;
        setError("Failed to fetch complaint documents");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, selectedCategory]);

  return { complaintList, loading, error };
}
