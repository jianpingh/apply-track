import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          // Base styling
          "flex h-11 w-full rounded-lg border-2 bg-background px-4 py-3 text-sm transition-all duration-200",
          // Border and outline styling
          "border-gray-300 hover:border-gray-400",
          // Focus states with enhanced ring effects
          "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          // Enhanced shadow effects
          "shadow-sm hover:shadow-md focus:shadow-lg",
          // Text styling
          "text-gray-700",
          // Disabled states
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 disabled:border-gray-200",
          // Error state (can be added via className)
          "data-[error=true]:border-red-400 data-[error=true]:focus:border-red-500 data-[error=true]:focus:ring-2 data-[error=true]:focus:ring-red-200",
          // Success state (can be added via className)
          "data-[success=true]:border-green-400 data-[success=true]:focus:border-green-500 data-[success=true]:focus:ring-2 data-[success=true]:focus:ring-green-200",
          // Custom appearance for select dropdown
          "appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-[right_16px_center] bg-[length:12px_8px] pr-12",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
