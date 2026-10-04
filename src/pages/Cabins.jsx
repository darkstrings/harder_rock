import { useState } from "react";
import { useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Dialog from "../components/ui/Dialog";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Segmented from "../components/ui/Segmented";
import SortSelect from "../components/ui/SortSelect";
import Empty from "../components/ui/Empty";
import { PageSpinner } from "../components/ui/Spinner";
import CabinCard from "../features/cabins/CabinCard";
import CabinForm from "../features/cabins/CabinForm";
import { useCabins, useDeleteCabin, useSaveCabin } from "../features/cabins/hooks";

export default function Cabins() {
  const { cabins, isPending } = useCabins();
  const { deleteCabin, isPending: deleting } = useDeleteCabin();
  const { saveCabin } = useSaveCabin();
  const [searchParams] = useSearchParams();
  const [editing, setEditing] = useState(null); // null | {} (new) | cabin
  const [toDelete, setToDelete] = useState(null);

  const filter = searchParams.get("discount") || "all";
  const [field, dir] = (searchParams.get("sortBy") || "name-asc").split("-");

  const visible = cabins
    .filter((c) => (filter === "all" ? true : filter === "with-discount" ? c.discount > 0 : !c.discount))
    .toSorted((a, b) => {
      const m = dir === "asc" ? 1 : -1;
      return typeof a[field] === "string" ? a[field].localeCompare(b[field]) * m : (a[field] - b[field]) * m;
    });

  return (
    <>
      <PageHeader
        eyebrow="Rooms"
        title="Cabins"
        description="Each cabin is themed after a guitar legend or a band."
        actions={
          <Button onClick={() => setEditing({})}>
            <Plus /> New cabin
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          param="discount"
          label="Filter by discount"
          options={[
            { value: "all", label: "All" },
            { value: "no-discount", label: "No discount" },
            { value: "with-discount", label: "With discount" },
          ]}
        />
        <SortSelect
          options={[
            { value: "name-asc", label: "Name (A–Z)" },
            { value: "name-desc", label: "Name (Z–A)" },
            { value: "regularPrice-asc", label: "Price (low to high)" },
            { value: "regularPrice-desc", label: "Price (high to low)" },
            { value: "maxCapacity-asc", label: "Capacity (low to high)" },
            { value: "maxCapacity-desc", label: "Capacity (high to low)" },
          ]}
        />
      </div>

      {isPending ? (
        <PageSpinner />
      ) : visible.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((cabin) => (
            <CabinCard
              key={cabin.id}
              cabin={cabin}
              onEdit={() => setEditing(cabin)}
              onDuplicate={() =>
                saveCabin({ data: { ...cabin, id: undefined, name: `Copy of ${cabin.name}` } })
              }
              onDelete={() => setToDelete(cabin)}
            />
          ))}
        </div>
      ) : (
        <Empty title="No cabins match" message="Try another filter, or add a new cabin." />
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${editing.name}` : "New cabin"}
        description={editing?.id ? undefined : "Add a cabin to the hotel."}>
        {editing !== null && <CabinForm key={editing.id ?? "new"} cabin={editing} onDone={() => setEditing(null)} />}
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        message="This can't be undone. Cabins with upcoming or active bookings can't be deleted."
        loading={deleting}
        onConfirm={() => deleteCabin(toDelete.id, { onSuccess: () => setToDelete(null) })}
      />
    </>
  );
}
