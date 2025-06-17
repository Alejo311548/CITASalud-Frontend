import React, { Suspense } from "react";
import ModifyAppointment from "@/components/organisms/ModifyAppointment";

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando componente...</p>}>
      <ModifyAppointment />
    </Suspense>
  );
}
