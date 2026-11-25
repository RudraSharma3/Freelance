import { ROLE_COLOR, roleById, type RoleId } from "@/data/team";
import { cn } from "@/lib/utils";

/** A small "who works on this" marker: coloured square + short role name. */
export default function RoleTag({ id, className }: { id: RoleId; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary",
        className
      )}
    >
      <i className="h-2 w-2 rounded-[2px]" style={{ background: ROLE_COLOR[id] }} aria-hidden />
      {roleById(id).short}
    </span>
  );
}
