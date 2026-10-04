import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import { useSignup, useUser, useUsers } from "../features/auth/hooks";
import { IS_DEMO } from "../lib/constants";

function NewStaffForm() {
  const { signup, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit((data) => signup(data, { onSuccess: () => reset() }))}
      className="card flex flex-col gap-4 p-5 sm:p-6"
      noValidate>
      <h2 className="flex items-center gap-2 font-semibold">
        <UserPlus className="size-5 text-accent" aria-hidden="true" /> Add a staff member
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <input className="field" disabled={isPending} {...register("fullName", { required: "Required" })} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            className="field"
            disabled={isPending}
            {...register("email", {
              required: "Required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
            })}
          />
        </Field>
        <Field label="Password" error={errors.password?.message} hint="At least 8 characters">
          <input
            type="password"
            autoComplete="new-password"
            className="field"
            disabled={isPending}
            {...register("password", { required: "Required", minLength: { value: 8, message: "Min. 8 characters" } })}
          />
        </Field>
        <Field label="Repeat password" error={errors.passwordConfirm?.message}>
          <input
            type="password"
            autoComplete="new-password"
            className="field"
            disabled={isPending}
            {...register("passwordConfirm", {
              required: "Required",
              validate: (v) => v === getValues("password") || "Passwords don't match",
            })}
          />
        </Field>
      </div>
      {!IS_DEMO && (
        <p className="text-xs text-muted">Note: with Firebase, creating a user signs you in as that user.</p>
      )}
      <div className="flex justify-end gap-3">
        <Button type="reset" variant="secondary" onClick={() => reset()} disabled={isPending}>
          Clear
        </Button>
        <Button type="submit" loading={isPending}>
          Create user
        </Button>
      </div>
    </form>
  );
}

export default function Users() {
  const { users, isPending } = useUsers();
  const { user: me } = useUser();

  return (
    <>
      <PageHeader eyebrow="Team" title="Staff" description="Everyone who can sign in to the dashboard." />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <NewStaffForm />
        <section className="card p-5 sm:p-6" aria-labelledby="crew-title">
          <h2 id="crew-title" className="font-semibold">
            The crew
          </h2>
          {isPending ? (
            <div className="grid place-items-center py-8 text-muted">
              <Spinner />
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {users.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  <Avatar src={u.avatar} name={u.fullName} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {u.fullName} {String(u.id) === String(me?.id) && <span className="text-xs text-accent">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-muted">{u.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
