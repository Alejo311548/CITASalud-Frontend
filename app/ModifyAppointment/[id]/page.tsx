// app/ModifyAppointment/[id]/page.tsx
"use client";

import ModifyAppointment from "@/components/organisms/ModifyAppointment";

export default function Page({ params }: { params: { id: string } }) {
  return <ModifyAppointment appointmentId={params.id} />;
}
