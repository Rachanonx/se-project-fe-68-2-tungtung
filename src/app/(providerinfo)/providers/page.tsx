import getVenues from "@/libs/getProviders";
import ProviderCatalog from "@/components/ProviderCatalog";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";

export default function Venue() {
  const venues = getVenues();

  return (
    <main className="text-center p-5 mt-15">
      <Suspense fallback={<p>Loading ... <LinearProgress /></p>}>
      <ProviderCatalog providersJson={venues}></ProviderCatalog>
      </Suspense>
    </main>
  );
}
