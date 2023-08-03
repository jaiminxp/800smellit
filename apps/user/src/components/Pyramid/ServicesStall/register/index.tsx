import { AuthContext } from '@/context/authContext'
import { serviceService } from '@/services'
import { ServiceFormValues } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ServiceRegisterForm from './service-register-form'

const Register = () => {
  const user = useContext(AuthContext)

  const navigate = useNavigate()

  const createServiceMutation = useMutation<string, Error, ServiceFormValues>({
    mutationFn: (newService) => serviceService.create(newService),
    onSuccess: (successMsg) => {
      toast.success(successMsg)
      navigate('/')
    },
    onError: (error) => {
      toast.error(
        error.message || 'Something went wrong while creating service'
      )
    },
  })

  if (!user) {
    toast.info('Please login to register a service')
    return <Navigate to="/" />
  }

  return (
    <div className="flex-1 p-5 bg-[rgba(0,0,0,0.5)]">
      <h1 className="text-4xl text-center font-heading">Register Service</h1>
      <div className="mt-8 flex justify-center">
        <ServiceRegisterForm
          onSubmit={(values) => createServiceMutation.mutate(values)}
        />
      </div>
    </div>
  )
}

export default Register
