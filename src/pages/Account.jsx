import { useState } from "react";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Avatar from "../components/ui/Avatar";
import { useUpdateUser, useUser } from "../features/auth/hooks";

function ProfileForm({ user }) {
  const { updateUser, isPending } = useUpdateUser();
  const [fullName, setFullName] = useState(user.fullName);
  const [avatarFile, setAvatarFile] = useState(null);
  const preview = avatarFile ? URL.createObjectURL(avatarFile) : user.avatar;

  function onSubmit(e) {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateUser({ fullName: fullName.trim(), avatarFile }, { onSuccess: () => setAvatarFile(null) });
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5 p-5 sm:p-6">
      <h2 className="font-semibold">Profile</h2>
      <div className="flex items-center gap-5">
        <Avatar src={preview} name={fullName} className="size-20 text-lg" />
        <label className="cursor-pointer">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-surface-2">
            <Camera className="size-4" aria-hidden="true" /> Change photo
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input className="field" value={user.email} disabled readOnly />
        </Field>
        <Field label="Full name">
          <input className="field" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={isPending} disabled={fullName === user.fullName && !avatarFile}>
          Save profile
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const { updateUser, isPending } = useUpdateUser();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(({ password }) => updateUser({ password }, { onSuccess: () => reset() }))}
      className="card flex flex-col gap-5 p-5 sm:p-6"
      noValidate>
      <h2 className="font-semibold">Password</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="New password" error={errors.password?.message} hint="At least 8 characters">
          <input
            type="password"
            autoComplete="new-password"
            className="field"
            {...register("password", { required: "Required", minLength: { value: 8, message: "Min. 8 characters" } })}
          />
        </Field>
        <Field label="Confirm password" error={errors.confirm?.message}>
          <input
            type="password"
            autoComplete="new-password"
            className="field"
            {...register("confirm", {
              required: "Required",
              validate: (v) => v === getValues("password") || "Passwords don't match",
            })}
          />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>
          Update password
        </Button>
      </div>
    </form>
  );
}

export default function Account() {
  const { user } = useUser();
  return (
    <>
      <PageHeader eyebrow="You" title="Account" description="Your profile and sign-in details." />
      <div className="flex max-w-3xl flex-col gap-6">
        <ProfileForm key={user.id + user.fullName + user.avatar} user={user} />
        <PasswordForm />
      </div>
    </>
  );
}
