import { Clock, MapPin, X } from "lucide-react";
import { useState } from "react";

import { beautifyLabel, hasDescription, hasPhoto, type Attraction } from "@/data/attractions";
import { cn } from "@/lib/utils";
import { AttractionIconView, getAttractionCircleColor } from "@/components/attraction-icon";
import { BottomCard } from "@/components/bottom-card";
import { Button } from "@/components/ui/button";

type AttractionPreviewProps = {
  attraction: Attraction;
  onMeetHere: (attraction: Attraction) => void;
  onClose: () => void;
};

export function AttractionPreview({ attraction, onMeetHere, onClose }: AttractionPreviewProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = hasPhoto(attraction) && !imageFailed;

  return (
    <BottomCard>
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-card/95 shadow-2xl backdrop-blur">
        {showPhoto && (
          <div className="aspect-16/10 overflow-hidden bg-muted">
            <img
              src={attraction.photo}
              alt={attraction.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <AttractionIconView
              attraction={attraction}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-5",
                getAttractionCircleColor(attraction),
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {attraction.category}
              </p>
              <h2 className="text-base leading-tight font-semibold">{attraction.name}</h2>
              {attraction.hours !== undefined && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 shrink-0" aria-hidden />
                  {attraction.hours}
                </p>
              )}
              {attraction.group !== undefined && (
                <span className="text-2xs mt-1 inline-block rounded-full bg-muted px-2 py-px font-medium text-muted-foreground">
                  {beautifyLabel(attraction.group)}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-lg"
              className="hit-area-[2px]"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="mt-3 space-y-4">
            {hasDescription(attraction) && (
              <p className="text-sm text-muted-foreground">{attraction.description}</p>
            )}
            <Button className="w-full" onClick={() => onMeetHere(attraction)}>
              <MapPin className="size-4" aria-hidden />
              Meet here
            </Button>
          </div>
        </div>
      </div>
    </BottomCard>
  );
}
