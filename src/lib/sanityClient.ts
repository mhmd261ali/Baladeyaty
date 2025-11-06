import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "avx2zuog",
  dataset: "complaints",
  token:
    "sklBNMJzsbY93GY9LMcnH6gzrgfjQrURu3ImeZLKWLNlwksOx5ealG8IC1pSyKOZoYB7kkpOkVP8KNYG7CtpSm62JL4WFJivhhGWrnT6DMVQJ7B7DrxnIlx9MfY3S2vpyEjvrNQmFcu9VuL7H3L7Yb16hZ95YRPDmRo0unL4karLA74yEgfu",
  useCdn: true,
});
