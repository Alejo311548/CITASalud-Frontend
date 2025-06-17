import React, { Suspense } from "react";
import ModifyAppointmentClient from "@/components/organisms/ModifyAppointment";

export default function ModifyAppointmentPage() {
  return (
    // Envuelves el Client Component en Suspense para evitar el warning
    <Suspense fallback={<p>Cargando formulario de modificación…</p>}>
      <ModifyAppointmentClient />
    </Suspense>
  );
}
