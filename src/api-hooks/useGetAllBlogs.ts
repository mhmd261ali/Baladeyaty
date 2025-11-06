import { useEffect, useState } from "react";
import { Info } from "../types";
import { client } from "../lib/sanityClient";

export default function useGetAllInfo(
  search: string,
  selectedCategory: string
) {
  const [infoList, setInfoList] = useState<Info[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    client
      .fetch(
        `*[
          _type == "Info" &&
          title match $search &&
          (info_category == $selectedCategory || $selectedCategory == "")
        ]{
          _id,
          _type,
          title,
          description,
          info_category,
          info_status,
          info_date,
          image{
            alt,
            asset->{
              url
            }
          },
          document{
            asset->{
              url
            }
          }
        } | order(info_date desc)`,
        {
          search: `*${search}*`,
          selectedCategory,
        }
      )
      .then((data: any[]) => {
        const mapped: Info[] = data.map((d) => ({
          _id: d._id,
          _type: "Info",
          title: d.title,
          description: d.description,
          info_category: d.info_category,
          info_status: d.info_status,
          info_date: d.info_date,
          // keep raw structured fields (useful if you later use @sanity/image-url)
          image: d.image?.asset?._ref
            ? {
                _type: "image",
                asset: { _ref: d.image.asset._ref, _type: "reference" },
                alt: d.image?.alt,
              }
            : undefined,
          document: d.document?.asset?._ref
            ? {
                _type: "file",
                asset: { _ref: d.document.asset._ref, _type: "reference" },
              }
            : undefined,
          // convenience URLs for the UI
          imageUrl: d.image?.asset?.url,
          imageAlt: d.image?.alt,
          documentUrl: d.document?.asset?.url,
        }));

        setInfoList(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch info documents");
        setLoading(false);
      });
  }, [search, selectedCategory]);

  return { infoList, loading, error };
}
