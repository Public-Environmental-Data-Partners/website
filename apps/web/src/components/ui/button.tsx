import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'
import * as React from 'react'

import {cn} from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        /** Header Donate and light-green marketing CTAs. */
        lightGreen:
          'border-transparent bg-light-green text-dark-green hover:bg-light-green/90 aria-expanded:bg-light-green',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        /** Soft white CTA on warm bands (e.g. What We Do “Learn More”). */
        surface:
          'border-border bg-white text-foreground hover:bg-white/90 aria-expanded:bg-white dark:bg-surface dark:hover:bg-surface/90',
        /** Off-white CTA on light-blue callouts (e.g. Get Involved intro). */
        offWhite:
          'border-transparent bg-off-white text-foreground hover:bg-off-white/90 aria-expanded:bg-off-white',
        /** Light beige CTA (e.g. Tools Development “View Guide”). */
        lightBeige:
          'border-transparent bg-light-beige text-off-black hover:bg-light-beige/90 aria-expanded:bg-light-beige',
        /** Light-blue CTA on dark bands (e.g. Testimonial “Get Involved”). */
        lightBlue:
          'border-transparent bg-light-blue text-dark-blue hover:bg-light-blue/90 aria-expanded:bg-light-blue',
        /** Dark-blue CTA on light bands (e.g. light Testimonial “Get Involved”). */
        darkBlue:
          'border-transparent bg-dark-blue text-light-blue hover:bg-dark-blue/90 aria-expanded:bg-dark-blue',
        /** Charcoal CTA on tool cards (Tools Development). */
        offBlack:
          'border-transparent bg-off-black text-white hover:bg-off-black/90 aria-expanded:bg-off-black',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[4px] px-2 text-xs in-data-[slot=button-group]:rounded-[4px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[4px] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-[4px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        /** Marketing CTA: min-height 65px; long labels wrap instead of overflowing. */
        cta: 'max-w-full min-h-[65px] min-w-[min(13.3125rem,100%)] shrink gap-2 rounded-[10px] px-2 py-4 text-center text-[1.375rem] leading-tight font-semibold whitespace-normal',
        icon: 'size-8 rounded-[4px]',
        'icon-xs':
          "size-6 rounded-[4px] in-data-[slot=button-group]:rounded-[4px] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-[4px] in-data-[slot=button-group]:rounded-[4px]',
        'icon-lg': 'size-9 rounded-[4px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({variant, size, className}))}
      {...props}
    />
  )
}

export {Button, buttonVariants}
