import { AuthContext } from '@/context/authContext'
import { tutorService } from '@/services/tutor.service'
import { TutorFormValues } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TutorRegisterForm from './tutor-register-form'

const Register = () => {
  const user = useContext(AuthContext)
  const navigate = useNavigate()

  const createTutorMutation = useMutation<string, Error, TutorFormValues>({
    mutationFn: (newService) => tutorService.create(newService),
    onSuccess: (successMsg) => {
      toast.success(successMsg)
      navigate('/')
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while creating tutor')
    },
  })

  if (!user) {
    toast.info('Please login to register as a tutor')
    return <Navigate to="/" />
  }

  return (
    <div className="flex-1 p-5 bg-[rgba(0,0,0,0.5)]">
      <h1 className="text-4xl text-center font-heading">Register tutor</h1>
      <div className="mt-8 flex justify-center">
        <TutorRegisterForm
          onSubmit={(values) => createTutorMutation.mutate(values)}
        />
      </div>
    </div>
  )
}

export default Register
