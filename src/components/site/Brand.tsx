import { SITE } from "@/data/config";

/** The company name, with its ampersand in the accent colour. */
export default function Brand({ className }: { className?: string }) {
  const parts = SITE.name.split("&");
  return (
    <span className={className}>
      {parts.length === 2 ? (
        <>
          {parts[0]}
          <span className="text-accent">&amp;</span>
          {parts[1]}
        </>
      ) : (
        SITE.name
      )}
    </span>
  );
}
