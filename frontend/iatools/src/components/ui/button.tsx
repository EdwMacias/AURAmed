import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { buttonVariants } from "./buttonVariants"
import { cn } from "../../lib/utils"
import {  type VariantProps } from "class-variance-authority"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        
      > {children}</Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }