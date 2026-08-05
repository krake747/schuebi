import { type ReactNode } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

type AttractionsSheetProps = {
    control: { open: boolean; onOpenChange: (open: boolean) => void }
    description: string
    header: ReactNode
    children: ReactNode
}

export function AttractionsSheet({ control, description, header, children }: AttractionsSheetProps) {
    return (
        <Drawer open={control.open} onOpenChange={control.onOpenChange} showSwipeHandle>
            <DrawerContent className="h-[80dvh] max-h-[90dvh]">
                <DrawerClose
                    render={
                        <Button
                            variant="ghost"
                            className="hit-area-x-1 hit-area-y-1 absolute top-4 right-4"
                            size="icon-lg"
                        />
                    }
                >
                    <XIcon />
                    <span className="sr-only">Close</span>
                </DrawerClose>
                <DrawerHeader className="gap-3 pb-3 text-left group-data-[swipe-axis=y]/drawer-popup:text-left">
                    <DrawerTitle className="text-lg">Find a place</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                    {header}
                </DrawerHeader>
                <Separator />
                {children}
            </DrawerContent>
        </Drawer>
    )
}
