import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { TreatmentCategory } from "../features/treatments/types/treatments.types";
import { treatmentsApi, CATEGORY_REVERSE } from "../features/treatments/api/treatments.api";

export const NewTreatmentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<TreatmentCategory | "">("");
  const [code, setCode] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState<"min" | "hr">("min");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !price || !code) return;
    setIsSubmitting(true);
    try {
      const durationMinutes = duration
        ? durationUnit === "hr"
          ? Number(duration) * 60
          : Number(duration)
        : undefined;
      await treatmentsApi.create({
        code,
        name,
        category: CATEGORY_REVERSE[category as TreatmentCategory],
        basePrice: Number(price),
        estimatedDurationMinutes: durationMinutes,
        description: description || undefined,
      });
      toast.success("Tratamiento guardado correctamente", {
        description: `El tratamiento ${name} ha sido añadido al catálogo.`,
      });
      navigate("/dashboard/tratamientos");
    } catch {
      toast.error("Error al guardar el tratamiento. Verificá los datos e intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-10">
      <form onSubmit={handleSubmit}>
        {/* Header Section */}
        <div className="mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface mb-2">Nuevo Tratamiento</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Registre un nuevo servicio clínico en el catálogo del sistema. Asegúrese de que los
              detalles de precios y duración sean precisos para la programación automática.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-6 py-2 bg-surface border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors rounded-lg h-[48px] min-w-[120px] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2 bg-primary text-on-primary font-label-md hover:bg-on-primary-fixed-variant transition-colors rounded-lg h-[48px] min-w-[160px] flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {isSubmitting ? "Guardando..." : "Guardar Tratamiento"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Section */}
          <div className="col-span-1 lg:col-span-8">
            <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm">
              <div className="space-y-10">
                {/* Basic Information */}
                <section>
                  <h3 className="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label
                        htmlFor="name"
                        className="font-label-md text-label-md text-on-surface-variant mb-1"
                      >
                        Nombre del Tratamiento
                      </label>
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-12 px-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline text-on-surface"
                        placeholder="Ej. Ortodoncia Invisible"
                        type="text"
                      />
                    </div>
                    <div className="col-span-1 flex flex-col gap-1">
                      <label
                        htmlFor="category"
                        className="font-label-md text-label-md text-on-surface-variant mb-1"
                      >
                        Categoría
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value as TreatmentCategory)}
                          required
                          className="w-full h-12 px-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface appearance-none cursor-pointer"
                        >
                          <option value="" disabled>
                            Seleccione una categoría
                          </option>
                          <option value="Prevención">Prevención</option>
                          <option value="Estética">Estética</option>
                          <option value="Cirugía">Cirugía</option>
                          <option value="Endodoncia">Endodoncia</option>
                          <option value="Periodoncia">Periodoncia</option>
                          <option value="Ortodoncia">Ortodoncia</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                          arrow_drop_down
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-1">
                      <label
                        htmlFor="code"
                        className="font-label-md text-label-md text-on-surface-variant mb-1"
                      >
                        Código de Servicio (Interno)
                      </label>
                      <input
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-12 px-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline"
                        placeholder="TX-000"
                        type="text"
                      />
                    </div>
                  </div>
                </section>

                {/* Financial & Logistics */}
                <section className="pt-6 border-t border-outline-variant/30">
                  <h3 className="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    Costos y Tiempos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="col-span-1 flex flex-col gap-1">
                      <label
                        htmlFor="price"
                        className="font-label-md text-label-md text-on-surface-variant mb-1"
                      >
                        Precio (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                          $
                        </span>
                        <input
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          min="0"
                          step="0.01"
                          className="w-full h-12 pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline"
                          placeholder="0.00"
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-1">
                      <label
                        htmlFor="duration"
                        className="font-label-md text-label-md text-on-surface-variant mb-1"
                      >
                        Duración Estimada
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          min="0"
                          className="w-full h-12 px-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface placeholder:text-outline"
                          placeholder="45"
                          type="number"
                        />
                        <div className="relative w-32 shrink-0">
                          <select
                            value={durationUnit}
                            onChange={(e) => setDurationUnit(e.target.value as "min" | "hr")}
                            className="w-full h-12 px-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface appearance-none cursor-pointer"
                          >
                            <option value="min">min</option>
                            <option value="hr">hr</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                            arrow_drop_down
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Description */}
                <section className="pt-6 border-t border-outline-variant/30">
                  <h3 className="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Descripción del Servicio
                  </h3>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="description"
                      className="font-label-md text-label-md text-on-surface-variant mb-1"
                    >
                      Descripción Detallada
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-on-surface placeholder:text-outline"
                      placeholder="Describa el procedimiento, materiales utilizados y recomendaciones para el paciente..."
                      rows={5}
                    ></textarea>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Side Summary/Visual Panel */}
          <div className="col-span-1 lg:col-span-4 space-y-6 mt-8 lg:mt-0">
            {/* Preview Card */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 overflow-hidden relative shadow-sm">
              <div className="absolute top-0 right-0 p-2">
                <span className="px-2 py-1 bg-secondary-container text-on-secondary-container font-label-sm rounded-sm">
                  NUEVO
                </span>
              </div>
              <h4 className="font-label-md text-outline uppercase tracking-widest mb-6">
                Vista Previa
              </h4>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[32px]">medical_services</span>
                </div>

                <h5 className="font-h2 text-h2 text-on-surface mb-2">
                  {name || "Nombre Tratamiento"}
                </h5>

                <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-medium mb-6">
                  {category || "Sin Categoría"}
                </span>

                <div className="flex justify-center gap-16 w-full border-t border-outline-variant/50 pt-6 mt-2">
                  <div>
                    <p className="text-xs text-outline mb-1">Precio</p>
                    <p className="font-h3 text-h3 text-primary">${price || "0.00"}</p>
                  </div>
                  <div className="border-l border-outline-variant/50 pl-16">
                    <p className="text-xs text-outline mb-1">Tiempo</p>
                    <p className="font-h3 text-h3 text-on-surface">
                      {duration ? `${duration} ${durationUnit}` : "-- min"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Guidelines Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h4 className="font-label-md text-on-surface mb-3 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lightbulb
                </span>
                Guía de Precisión
              </h4>
              <ul className="space-y-3 mt-4">
                <li className="flex gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span>
                    Defina precios competitivos basados en los costos de materiales actuales.
                  </span>
                </li>
                <li className="flex gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span>La duración estimada ayuda a optimizar la agenda de la clínica.</span>
                </li>
                <li className="flex gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span>Use etiquetas claras para facilitar la búsqueda en facturación.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
