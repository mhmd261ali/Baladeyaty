import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "avx2zuog",
  dataset: "complaints",
  token:
    "skuIuGxmkqO7uobWDBcF7jNxDukxZo5pjAm1c78mQgNkY5iwRMEVVpfI2hDysxUkffNlpCYw8Hx5lw0wg1e4WHSbczqFjThhPrIjtkEy039ZWdTfwJGkPtTrNNCL5vJKRjsqgwonvLCBtNl2eDsUOZ634101nUmmVFqYQueIkhLhjDAfIFAI",
  useCdn: true,
});
