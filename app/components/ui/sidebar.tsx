"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "lib/utils"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        defaultOpen?: boolean
        open?: boolean
        onOpenChange?: (open: boolean) => void
    }
>(
    (
        {
            defaultOpen = true,
            open: openProp,
            onOpenChange: setOpenProp,
            className,
            style,
            children,
            ...props
        },
        ref
    ) => {
        const [_open, _setOpen] = React.useState(defaultOpen)
        const open = openProp ?? _open
        const setOpen = React.useCallback(
            (value: boolean | ((value: boolean) => boolean)) => {
                const openState = typeof value === "function" ? value(open) : value
                if (setOpenProp) {
                    setOpenProp(openState)
                } else {
                    _setOpen(openState)
                }
            },
            [setOpenProp, open]
        )

        const isMobile = false // We'll keep it simple for now

        const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed"

        const contextValue = React.useMemo(
            () => ({
                state,
                open,
                setOpen,
                isMobile,
            }),
            [state, open, setOpen, isMobile]
        )

        return (
            <SidebarContext.Provider value={contextValue}>
                <div
                    style={
                        {
                            "--sidebar-width": SIDEBAR_WIDTH,
                            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
                            ...style,
                        } as React.CSSProperties
                    }
                    className={cn(
                        "group/sidebar-wrapper flex min-h-screen w-full",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            </SidebarContext.Provider>
        )
    }
)
SidebarProvider.displayName = "SidebarProvider"

const SidebarContext = React.createContext<{
    state: "expanded" | "collapsed"
    open: boolean
    setOpen: (open: boolean) => void
    isMobile: boolean
} | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }
    return context
}

const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        side?: "left" | "right"
        variant?: "sidebar" | "floating" | "inset"
        collapsible?: "offcanvas" | "icon" | "none"
    }
>(
    (
        {
            side = "left",
            variant = "sidebar",
            collapsible = "none",
            className,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex h-screen w-[--sidebar-width] flex-col border-r bg-background overflow-hidden sticky top-0",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex flex-col gap-2 p-4", className)}
            {...props}
        />
    )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2", className)}
            {...props}
        />
    )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex flex-col gap-1", className)}
            {...props}
        />
    )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
        <Comp
            ref={ref as any}
            className={cn(
                "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground",
                className
            )}
            {...props}
        />
    )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
    />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("list-none", className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
    "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "hover:bg-accent hover:text-accent-foreground",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-9",
                sm: "h-7 text-xs",
                lg: "h-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const SidebarMenuButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & {
        asChild?: boolean
        isActive?: boolean
    } & VariantProps<typeof sidebarMenuButtonVariants>
>(
    (
        { asChild = false, isActive = false, variant = "default", size = "default", className, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"

        return (
            <Comp
                ref={ref as any}
                className={cn(
                    sidebarMenuButtonVariants({ variant, size }),
                    isActive && "bg-accent font-medium text-accent-foreground",
                    className
                )}
                {...props}
            />
        )
    }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuSub = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-col gap-1 border-l ml-3.5 pl-3", className)}
        {...props}
    />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & {
        asChild?: boolean
        size?: "sm" | "md"
        isActive?: boolean
    }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
        <Comp
            ref={ref as any}
            className={cn(
                "flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-none ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                isActive && "bg-accent font-medium text-accent-foreground",
                size === "sm" && "text-xs",
                className
            )}
            {...props}
        />
    )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    useSidebar,
}

