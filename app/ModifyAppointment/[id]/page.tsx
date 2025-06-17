"use client";

import { useParams } from "next/navigation";
import ModifyAppointment from "@/components/organisms/ModifyAppointment";

export default function Page() {
  const params = useParams();
  // Asegurarse que es string, ignorar si es undefined o array
  const appointmentId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  return <ModifyAppointment appointmentId={appointmentId} />;
}
