import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

const InputEl = (props: Props, ref: ForwardedRef<HTMLInputElement>) => (
  <input
    type={props.type || 'text'}
    {...props}
    className={`form-control ${props.className}`}
    ref={ref}
  />
)

export const Input = forwardRef(InputEl)
