import {
  ForwardedRef,
  OptionHTMLAttributes,
  SelectHTMLAttributes,
  forwardRef,
} from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>
type OptionProps = OptionHTMLAttributes<HTMLOptionElement>

const SelectEl = (props: SelectProps, ref: ForwardedRef<HTMLSelectElement>) => (
  <select {...props} className={`form-control ${props.className}`} ref={ref} />
)

const OptionEl = (props: OptionProps, ref: ForwardedRef<HTMLOptionElement>) => (
  <option {...props} className={`text-black ${props.className}`} ref={ref} />
)

const Select = forwardRef<HTMLSelectElement, SelectProps>(SelectEl)
const Option = forwardRef<HTMLOptionElement, OptionProps>(OptionEl)

export { Select, Option }
