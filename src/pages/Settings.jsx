import { useForm } from "react-hook-form";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { PageSpinner } from "../components/ui/Spinner";
import ThemeToggle from "../components/layout/ThemeToggle";
import { useResetData, useSettings, useUpdateSettings } from "../features/settings/hooks";
import { IS_DEMO } from "../lib/constants";

function SettingsForm({ settings }) {
  const { updateSettings, isPending } = useUpdateSettings();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
    reset,
  } = useForm({ defaultValues: settings });

  const num = (min, extra = {}) => ({
    required: "Required",
    valueAsNumber: true,
    min: { value: min, message: `At least ${min}` },
    ...extra,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => updateSettings(data, { onSuccess: (s) => reset(s) }))}
      className="card flex flex-col gap-5 p-5 sm:p-6"
      noValidate>
      <h2 className="font-semibold">Booking rules</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Minimum nights per booking" error={errors.minBookingLength?.message}>
          <input type="number" className="field" {...register("minBookingLength", num(1))} />
        </Field>
        <Field label="Maximum nights per booking" error={errors.maxBookingLength?.message}>
          <input
            type="number"
            className="field"
            {...register(
              "maxBookingLength",
              num(1, { validate: (v) => v >= getValues("minBookingLength") || "Must be ≥ the minimum" }),
            )}
          />
        </Field>
        <Field label="Maximum guests per booking" error={errors.maxGuestsPerBooking?.message}>
          <input type="number" className="field" {...register("maxGuestsPerBooking", num(1))} />
        </Field>
        <Field label="Breakfast price (per guest, per night)" error={errors.breakfastPrice?.message}>
          <input type="number" className="field" {...register("breakfastPrice", num(0))} />
        </Field>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => reset(settings)} disabled={!isDirty || isPending}>
          Discard
        </Button>
        <Button type="submit" disabled={!isDirty} loading={isPending}>
          Save settings
        </Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { settings, isPending } = useSettings();
  const { resetData, isPending: resetting } = useResetData();
  const [confirming, setConfirming] = useState(false);

  if (isPending) return <PageSpinner />;

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Settings" description="House rules that apply to every booking." />
      <div className="flex flex-col gap-6">
        <SettingsForm key={JSON.stringify(settings)} settings={settings} />

        <section className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">Appearance</h2>
            <p className="text-sm text-muted">Light, dark, or follow your system.</p>
          </div>
          <ThemeToggle />
        </section>

        <section className="card flex flex-wrap items-center justify-between gap-4 border-dashed p-5 sm:p-6">
          <div className="max-w-xl">
            <h2 className="font-semibold">Sample data</h2>
            <p className="text-sm text-muted">
              {IS_DEMO
                ? "Restore the original cabins, guests and bookings. Your changes in this browser will be replaced."
                : "Replace all cabins, guests and bookings in Firestore with fresh sample data."}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            <RotateCcw /> Reset sample data
          </Button>
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Reset all sample data?"
        message="Cabins, guests, bookings and settings go back to the defaults. Staff accounts are kept."
        confirmLabel="Reset data"
        loading={resetting}
        onConfirm={() => resetData(undefined, { onSuccess: () => setConfirming(false) })}
      />
    </>
  );
}
