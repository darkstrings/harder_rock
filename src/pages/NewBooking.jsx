import { useMemo } from "react";
import { Link } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { addDays, format } from "date-fns";
import { ArrowLeft, Coffee, Receipt } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { PageSpinner } from "../components/ui/Spinner";
import { useCabins } from "../features/cabins/hooks";
import { useCreateBooking, useGuests } from "../features/bookings/hooks";
import { useSettings } from "../features/settings/hooks";
import { calcBookingPrices, nightsBetween } from "../lib/bookings";
import { resolveImage } from "../lib/images";
import { cn, formatCurrency, todayISO } from "../lib/utils";

const iso = (d) => format(d, "yyyy-MM-dd");

function Section({ title, children }) {
  return (
    <fieldset className="card p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-4 font-semibold" aria-hidden="true">
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

export default function NewBooking() {
  const { cabins, isPending: c1 } = useCabins();
  const { guests, isPending: c2 } = useGuests();
  const { settings, isPending: c3 } = useSettings();
  const { createBooking, isPending } = useCreateBooking();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      guestMode: "existing",
      guestId: "",
      cabinId: "",
      startDate: iso(addDays(new Date(), 1)),
      endDate: iso(addDays(new Date(), 4)),
      numGuests: 2,
      hasBreakfast: false,
      isPaid: false,
      observations: "",
      newGuest: { fullName: "", email: "", country: "", nationalId: "" },
    },
  });

  const values = useWatch({ control });

  // Country list (name + code) derived from known guests.
  const countries = useMemo(() => {
    const map = new Map(guests.map((g) => [g.nationality, g.countryCode]));
    return [...map].sort((a, b) => a[0].localeCompare(b[0]));
  }, [guests]);

  if (c1 || c2 || c3) return <PageSpinner />;

  const cabin = cabins.find((c) => String(c.id) === String(values.cabinId));
  const nights = values.startDate && values.endDate ? nightsBetween(values.startDate, values.endDate) : 0;
  const prices =
    cabin && nights > 0
      ? calcBookingPrices({
          startDate: values.startDate,
          endDate: values.endDate,
          cabin,
          numGuests: values.numGuests,
          hasBreakfast: values.hasBreakfast,
          breakfastPrice: settings.breakfastPrice,
        })
      : null;

  function onSubmit(data) {
    const input = {
      cabinId: data.cabinId,
      startDate: data.startDate,
      endDate: data.endDate,
      numGuests: Number(data.numGuests),
      hasBreakfast: data.hasBreakfast,
      isPaid: data.isPaid,
      observations: data.observations,
    };
    if (data.guestMode === "new") {
      const [nationality, countryCode] = data.newGuest.country.split("|");
      input.newGuest = {
        fullName: data.newGuest.fullName.trim(),
        email: data.newGuest.email.trim(),
        nationalId: data.newGuest.nationalId.trim(),
        nationality: nationality ?? "",
        countryCode: countryCode ?? "",
      };
    } else {
      input.guestId = data.guestId;
    }
    createBooking(input);
  }

  const isNewGuest = values.guestMode === "new";

  return (
    <>
      <Button as={Link} to="/bookings" variant="ghost" size="sm" className="mb-4 -ml-3">
        <ArrowLeft /> All bookings
      </Button>
      <PageHeader eyebrow="Front desk" title="New booking" description="Book a cabin for a new or returning guest." />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_20rem]" noValidate>
        <div className="flex flex-col gap-6">
          <Section title="Guest">
            <div className="mb-4 inline-flex rounded-xl border border-border p-1" role="radiogroup" aria-label="Guest">
              {[
                ["existing", "Returning guest"],
                ["new", "New guest"],
              ].map(([v, label]) => (
                <label
                  key={v}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
                    values.guestMode === v ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                  )}>
                  <input type="radio" value={v} className="sr-only" {...register("guestMode")} />
                  {label}
                </label>
              ))}
            </div>

            {isNewGuest ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.newGuest?.fullName?.message}>
                  <input className="field" {...register("newGuest.fullName", { required: isNewGuest && "Required" })} />
                </Field>
                <Field label="Email" error={errors.newGuest?.email?.message}>
                  <input
                    type="email"
                    className="field"
                    {...register("newGuest.email", {
                      required: isNewGuest && "Required",
                      pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                    })}
                  />
                </Field>
                <Field label="Country">
                  <select className="field" {...register("newGuest.country")}>
                    <option value="">Select…</option>
                    {countries.map(([name, code]) => (
                      <option key={name} value={`${name}|${code}`}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="National ID" hint="Optional">
                  <input className="field" {...register("newGuest.nationalId")} />
                </Field>
              </div>
            ) : (
              <Field label="Guest" error={errors.guestId?.message}>
                <select className="field" {...register("guestId", { required: !isNewGuest && "Choose a guest" })}>
                  <option value="">Select a guest…</option>
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} — {g.email}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </Section>

          <Section title="Cabin">
            {errors.cabinId && <p className="mb-3 text-xs font-medium text-danger">{errors.cabinId.message}</p>}
            <input type="hidden" {...register("cabinId", { required: "Choose a cabin" })} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label="Cabin">
              {cabins.map((c) => {
                const selected = String(c.id) === String(values.cabinId);
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setValue("cabinId", String(c.id), { shouldValidate: true })}
                    className={cn(
                      "group overflow-hidden rounded-xl border text-left transition-all",
                      selected
                        ? "border-accent ring-3 ring-accent-soft"
                        : "border-border hover:border-border-strong",
                    )}>
                    <img src={resolveImage(c.image)} alt="" className="aspect-[16/9] w-full object-cover" />
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-muted">
                        Sleeps {c.maxCapacity} · {formatCurrency(c.regularPrice - c.discount)}/night
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Stay">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Check-in" error={errors.startDate?.message}>
                <input
                  type="date"
                  min={todayISO()}
                  className="field"
                  {...register("startDate", { required: "Required" })}
                />
              </Field>
              <Field label="Check-out" error={errors.endDate?.message}>
                <input
                  type="date"
                  min={values.startDate}
                  className="field"
                  {...register("endDate", {
                    required: "Required",
                    validate: (v, all) => v > all.startDate || "Must be after check-in",
                  })}
                />
              </Field>
              <Field
                label="Guests"
                error={errors.numGuests?.message}
                hint={cabin ? `Max ${Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking)}` : undefined}>
                <input
                  type="number"
                  min={1}
                  className="field"
                  {...register("numGuests", {
                    required: "Required",
                    min: { value: 1, message: "At least 1" },
                    validate: (v) =>
                      !cabin || Number(v) <= Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking) || "Too many guests for this cabin",
                  })}
                />
              </Field>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("hasBreakfast")} />
                <Coffee className="size-4 text-accent" aria-hidden="true" /> Add breakfast (
                {formatCurrency(settings.breakfastPrice)} per guest per night)
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("isPaid")} />
                Guest has already paid
              </label>
            </div>
            <Field label="Notes" className="mt-4" hint="Allergies, late arrival, pets…">
              <textarea rows={3} className="field" {...register("observations")} />
            </Field>
          </Section>
        </div>

        {/* Summary */}
        <aside className="card sticky top-24 p-5 sm:p-6" aria-label="Price summary">
          <h2 className="flex items-center gap-2 font-semibold">
            <Receipt className="size-5 text-accent" aria-hidden="true" /> Summary
          </h2>
          {prices ? (
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{cabin.name.replace(/^The /, "")}</dt>
                <dd className="tabular-nums">{formatCurrency(prices.cabinPrice)}</dd>
              </div>
              <div className="flex justify-between text-xs text-subtle">
                <dt>
                  {prices.numNights} nights × {formatCurrency(cabin.regularPrice - cabin.discount)}
                </dt>
              </div>
              {values.hasBreakfast && (
                <div className="flex justify-between">
                  <dt className="text-muted">Breakfast</dt>
                  <dd className="tabular-nums">{formatCurrency(prices.extrasPrice)}</dd>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCurrency(prices.totalPrice)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted">Pick a cabin and dates to see the price.</p>
          )}
          <Button type="submit" size="lg" className="mt-6 w-full" loading={isPending}>
            Create booking
          </Button>
        </aside>
      </form>
    </>
  );
}
