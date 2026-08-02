import { useState } from "react";

import { beautifyLabel, hasDescription, hasPhoto, type Attraction } from "@/data/attractions";
import { cn } from "@/lib/utils";
import { AttractionIconView, getAttractionCircleColor } from "@/components/attraction-icon";

type AttractionListItemProps = {
  attraction: Attraction;
  active: boolean;
  onSelect: (id: string) => void;
  onGroupFilter: ((group: string) => void) | undefined;
};

export function AttractionListItem({
  attraction,
  active,
  onSelect,
  onGroupFilter,
}: AttractionListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(attraction.id)}
      aria-current={active}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/70",
        active && "bg-accent",
      )}
    >
      <AttractionThumbnail attraction={attraction} />
      <span className="min-w-0 py-0.5">
        <span className="block truncate text-sm font-medium">{attraction.name}</span>
        {hasDescription(attraction) && (
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
            {attraction.description}
          </span>
        )}
        {attraction.group !== undefined && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onGroupFilter !== undefined) onGroupFilter(attraction.group!);
            }}
            className={cn(
              "text-2xs hit-area-3 mt-0.5 inline-block rounded-full px-2 py-px font-medium transition-colors",
              "bg-muted/70 text-muted-foreground hover:bg-muted",
            )}
          >
            {beautifyLabel(attraction.group)}
          </button>
        )}
      </span>
    </button>
  );
}

function AttractionThumbnail({ attraction }: { attraction: Attraction }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = hasPhoto(attraction) && !failed;

  if (!showPhoto) {
    return (
      <AttractionIconView
        attraction={attraction}
        className={cn(
          "mt-0.5 flex size-14 shrink-0 items-center justify-center rounded-xl [&_svg]:size-6",
          getAttractionCircleColor(attraction),
        )}
      />
    );
  }

  return (
    <span className="mt-0.5 size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
      <img
        src={attraction.photo}
        alt={attraction.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-14 object-cover motion-safe:transition-opacity motion-safe:duration-300"
      />
    </span>
  );
}
