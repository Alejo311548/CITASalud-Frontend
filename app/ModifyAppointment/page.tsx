// app/ModifyAppointment/[citaId]/page.tsx
import React from "react";
import ModifyAppointment from "@/components/organisms/ModifyAppointment";

export default function Page({
  params,
}: {
  params: { citaId: string };
}) {
  // Server Component: recibe params.citaId de Next.js
  return <ModifyAppointment citaId={params.citaId} />;
}
