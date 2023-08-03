import { AuthContext } from '@/context/authContext'
import { productService } from '@/services'
import { ProductFormValues } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductRegisterForm from './product-register-form'

const Sell = () => {
  const user = useContext(AuthContext)
  const navigate = useNavigate()

  const createProductMutation = useMutation<string, Error, ProductFormValues>({
    mutationFn: (newProduct) => productService.create(newProduct),
    onSuccess: (successMsg) => {
      toast.success(successMsg)
      navigate('/')
    },
    onError: (error) => {
      toast.error(
        error.message || 'Something went wrong while creating product'
      )
    },
  })

  if (!user) {
    toast.info('Please login to sell a product')
    return <Navigate to="/" />
  }

  return (
    <div className="flex-1 p-5 bg-[rgba(0,0,0,0.5)]">
      <h1 className="text-4xl text-center">Sell</h1>
      <div className="mt-8 flex justify-center">
        <ProductRegisterForm
          onSubmit={(values) => createProductMutation.mutate(values)}
        />
      </div>
    </div>
  )
}

export default Sell
