import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

const TextAreaEl = (props: Props, ref: ForwardedRef<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    cols={props.cols || 30}
    rows={props.rows || 6}
    className={`form-control ${props.className}`}
    ref={ref}
  />
)

export const TextArea = forwardRef(TextAreaEl)
