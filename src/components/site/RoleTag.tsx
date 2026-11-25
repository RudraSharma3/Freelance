import { DISCIPLINE_COLOR, disciplineById, type DisciplineId } from "@/data/disciplines";
import { cn } from "@/lib/utils";

/** A small "what goes into this" marker: coloured square + short discipline name. */
export default function RoleTag({ id, className }: { id: DisciplineId; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary",
        className
      )}
    >
      <i className="h-2 w-2 rounded-[2px]" style={{ background: DISCIPLINE_COLOR[id] }} aria-hidden />
      {disciplineById(id).short}
    </span>
  );
}
