"use client";

import { useSearchParams } from "next/navigation";
import ModifyAppointment from "@/components/organisms/ModifyAppointment";

export default function Page() {
  const searchParams = useSearchParams();
  const citaId = searchParams.get("citaId") ?? "";

  if (!citaId) return <div>ID de cita no especificado</div>;

  return <ModifyAppointment citaId={citaId} />;
}
