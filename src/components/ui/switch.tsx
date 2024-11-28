import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { clsx } from 'clsx';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={clsx(
      'peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      'bg-gray-200 data-[state=checked]:bg-green-500',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={clsx(
        'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
        'data-[state=checked]:translate-x-4 translate-x-0'
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
