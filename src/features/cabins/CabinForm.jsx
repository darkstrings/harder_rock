import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { resolveImage } from "../../lib/images";
import { useSaveCabin } from "./hooks";

export default function CabinForm({ cabin, onDone }) {
  const isEdit = Boolean(cabin?.id);
  const { saveCabin, isPending } = useSaveCabin();
  const [preview, setPreview] = useState(resolveImage(cabin?.image));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: cabin?.name ?? "",
      maxCapacity: cabin?.maxCapacity ?? 2,
      regularPrice: cabin?.regularPrice ?? 300,
      discount: cabin?.discount ?? 0,
      description: cabin?.description ?? "",
    },
  });

  function onSubmit(values) {
    const file = values.image?.[0];
    const data = { ...values, image: file ?? cabin?.image ?? null };
    saveCabin({ data, id: isEdit ? cabin.id : undefined }, { onSuccess: () => onDone?.() });
  }

  const imageField = register("image", {
    validate: (files) => (files?.length || cabin?.image ? true : "Add a photo of the cabin"),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Field label="Cabin name" error={errors.name?.message}>
        <input className="field" disabled={isPending} {...register("name", { required: "Name is required" })} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Max guests" error={errors.maxCapacity?.message}>
          <input
            type="number"
            className="field"
            disabled={isPending}
            {...register("maxCapacity", {
              required: "Required",
              min: { value: 1, message: "At least 1" },
              valueAsNumber: true,
            })}
          />
        </Field>
        <Field label="Price / night" error={errors.regularPrice?.message}>
          <input
            type="number"
            className="field"
            disabled={isPending}
            {...register("regularPrice", {
              required: "Required",
              min: { value: 1, message: "At least $1" },
              valueAsNumber: true,
            })}
          />
        </Field>
        <Field label="Discount" error={errors.discount?.message}>
          <input
            type="number"
            className="field"
            disabled={isPending}
            {...register("discount", {
              valueAsNumber: true,
              min: { value: 0, message: "Can't be negative" },
              validate: (v) => !v || v < getValues("regularPrice") || "Must be less than the price",
            })}
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <textarea
          rows={3}
          className="field"
          disabled={isPending}
          {...register("description", { required: "Description is required" })}
        />
      </Field>

      <Field label="Photo" error={errors.image?.message}>
        <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-border-strong p-3 transition-colors hover:border-accent">
          {preview ? (
            <img src={preview} alt="" className="h-16 w-24 rounded-lg object-cover" />
          ) : (
            <span className="grid h-16 w-24 place-items-center rounded-lg bg-surface-2">
              <ImagePlus className="size-6 text-muted" aria-hidden="true" />
            </span>
          )}
          <span className="text-sm">
            <span className="font-semibold text-accent">{preview ? "Replace photo" : "Upload a photo"}</span>
            <span className="block text-xs text-muted">JPG, PNG or WebP</span>
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isPending}
            {...imageField}
            onChange={(e) => {
              imageField.onChange(e);
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </label>
      </Field>

      <div className="mt-2 flex justify-end gap-3">
        <Button variant="secondary" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          {isEdit ? "Save changes" : "Create cabin"}
        </Button>
      </div>
    </form>
  );
}
