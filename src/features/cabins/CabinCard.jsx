import { Copy, Pencil, Trash2, Users } from "lucide-react";
import Menu from "../../components/ui/Menu";
import Badge from "../../components/ui/Badge";
import { resolveImage } from "../../lib/images";
import { formatCurrency } from "../../lib/utils";

export default function CabinCard({ cabin, onEdit, onDuplicate, onDelete }) {
  const price = cabin.regularPrice - (cabin.discount || 0);
  return (
    <article className="card group flex flex-col overflow-visible">
      <div className="relative overflow-hidden rounded-t-card">
        <img
          src={resolveImage(cabin.image)}
          alt={`Inside ${cabin.name}`}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        {cabin.discount > 0 && (
          <Badge tone="solid" className="absolute top-3 left-3 shadow-lg">
            Save {formatCurrency(cabin.discount)}
          </Badge>
        )}
        <p className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-semibold text-white">
          <Users className="size-3.5" aria-hidden="true" /> Sleeps {cabin.maxCapacity}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-2xl leading-tight tracking-wide">{cabin.name}</h3>
          <Menu
            label={`Actions for ${cabin.name}`}
            items={[
              { label: "Edit", icon: Pencil, onClick: onEdit },
              { label: "Duplicate", icon: Copy, onClick: onDuplicate },
              { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
            ]}
          />
        </div>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{cabin.description}</p>
        <p className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold tabular-nums">{formatCurrency(price)}</span>
          <span className="text-xs text-muted">/ night</span>
          {cabin.discount > 0 && (
            <span className="text-xs text-subtle line-through">{formatCurrency(cabin.regularPrice)}</span>
          )}
        </p>
      </div>
    </article>
  );
}
