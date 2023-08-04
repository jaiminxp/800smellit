import { MenuOptionGroup, MenuOptionGroupProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Control, Controller } from 'react-hook-form'

interface IProps extends MenuOptionGroupProps {
  name: string
  control: Control<any>
  children: ReactNode
}

export default function MenuOptionGroupController({
  name,
  type,
  control,
  children,
}: IProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <MenuOptionGroup type={type} onChange={onChange}>
          {children}
        </MenuOptionGroup>
      )}
    />
  )
}
