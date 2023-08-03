import {
  EventType,
  ProductCategory,
  ProductType,
  ServiceDomain,
  TutorAvalibility,
  TutorSubject,
} from '@/types'
import { z } from 'zod'

const suggestionSchema = z.object({
  _id: z.string().min(1, { message: 'Required' }),
  name: z.string().min(1, { message: 'Required' }),
})

export const tutorFormSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  contact: z.string().min(1, { message: 'Required' }),
  address: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Required' }),
  city: z.string().min(1, { message: 'Required' }),
  subject: z.nativeEnum(TutorSubject, {
    errorMap: (issue, _ctx) => {
      if (_ctx.data === '') {
        return {
          message: 'Select a subject',
        }
      } else {
        return {
          message: `Subject must be one of ${TutorSubject.Art}, ${TutorSubject.Music}`,
        }
      }
    },
  }),
  availability: z.nativeEnum(TutorAvalibility, {
    errorMap: (issue, _ctx) => {
      if (_ctx.data === '') {
        return {
          message: 'Select tutor availibility',
        }
      } else {
        return {
          message: `Availibility must be one of ${TutorAvalibility['In Person']}, ${TutorAvalibility.Online}`,
        }
      }
    },
  }),
  instrument: z.string().min(1, { message: 'Required' }),
})

export const serviceFormSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  contact: z.string().min(1, { message: 'Required' }),
  address: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Required' }),
  city: z.string().min(1, { message: 'Required' }),
  expert: z.string().min(1, { message: 'Required' }),
  website: z.string().min(1, { message: 'Required' }).url(),
  domain: z.nativeEnum(ServiceDomain, {
    errorMap: (issue, _ctx) => {
      if (_ctx.data === '') {
        return {
          message: 'Select service type',
        }
      } else {
        return {
          message: `Service type must be one of ${ServiceDomain.Art}, ${ServiceDomain.Music}`,
        }
      }
    },
  }),
})

const baseProductSchema = z.object({
  seller: z.string().min(1, { message: 'Required' }),
  contact: z.string().min(1, { message: 'Required' }),
  address: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Required' }),
  city: z.string().min(1, { message: 'Required' }),
  type: z.nativeEnum(ProductType, {
    errorMap: (issue, _ctx) => {
      if (_ctx.data === '') {
        return {
          message: 'Select product type',
        }
      } else {
        return {
          message: `Product type must be one of ${ProductType.Art}, ${ProductType.Music}`,
        }
      }
    },
  }),
})

const instrumentProductSchema = baseProductSchema.extend({
  category: z.literal(ProductCategory.Instrument),
  instrument: z.string().min(1, { message: 'Required' }),
})

export const componentProductSchema = baseProductSchema.extend({
  category: z.literal(ProductCategory.Component),
  instrument: z.string().min(1, { message: 'Required' }),
  component: z.string().min(1, { message: 'Required' }),
})

export const productFormSchema = z.discriminatedUnion(
  'category',
  [instrumentProductSchema, componentProductSchema],
  {
    errorMap: (issue, _ctx) => {
      if (_ctx.data.category === '') {
        return {
          message: 'Select product category',
        }
      } else {
        return {
          message: `Product type must be one of ${ProductType.Art}, ${ProductType.Music}`,
        }
      }
    },
  }
)

export const musicianFormSchema = z.object({
  musician: z.string().min(1, { message: 'Required' }).or(suggestionSchema),
  bio: z.string().min(1, { message: 'Required' }),
  genre: z.string().min(1, { message: 'Required' }),
  address: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Required' }),
  city: z.string().min(1, { message: 'Required' }),
  band: z.string(),
  influences: z.string(),
  website: z.string(),
  phone: z.string(),
  logo: z.instanceof(FileList).optional(),
  gallery: z
    .instanceof(FileList)
    .refine((gallery) => gallery.length <= 5, {
      message: 'Maximum 5 images can be uploaded',
    })
    .optional(),
  songs: z
    .instanceof(FileList)
    .refine((songs) => songs.length <= 3, {
      message: 'Maximum 3 songs can be uploaded',
    })
    .optional(),
})

export const artistFormSchema = z.object({
  artist: z.string().min(1, { message: 'Required' }).or(suggestionSchema),
  bio: z.string().min(1, { message: 'Required' }),
  genre: z.string().min(1, { message: 'Required' }),
  address: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Required' }),
  city: z.string().min(1, { message: 'Required' }),
  influences: z.string(),
  website: z.string(),
  phone: z.string(),
  gallery: z
    .instanceof(FileList)
    .refine((gallery) => gallery.length <= 5, {
      message: 'Maximum 5 images can be uploaded',
    })
    .optional(),
})

export const memberFormSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  role: z.string().min(1, { message: 'Required' }),
  instrument: z.string().min(1, { message: 'Required' }),
})

export const eventFormSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  genre: z.string().min(1, { message: 'Required' }),
  date: z.string().min(1, { message: 'Required' }),
  time: z.string().min(1, { message: 'Required' }),
  venue: suggestionSchema.required().refine((venue) => venue._id, {
    message: 'Select a venue',
  }),
})

export const venueEventFormSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  genre: z.string().min(1, { message: 'Required' }),
  date: z.string().min(1, { message: 'Required' }),
  time: z.string().min(1, { message: 'Required' }),
  artist: suggestionSchema.required().refine((p) => p._id, {
    message: 'Select an artist',
  }),
  type: z.nativeEnum(EventType, {
    errorMap: (issue, _ctx) => {
      if (_ctx.data === '') {
        return {
          message: 'Select event type',
        }
      } else {
        return {
          message: `Type must be one of ${EventType.Art}, ${EventType.Music}`,
        }
      }
    },
  }),
})

export const authFormSchema = z.object({
  email: z.string().email().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
})

export const feedbackFormSchema = z.object({
  email: z.string().email().min(1, { message: 'Required' }),
  feedback: z.string().min(1, { message: 'Required' }),
})

export const venueFormSchema = z.object({
  venue: z.string().min(1, { message: 'Required' }).or(suggestionSchema),
  phone: z.string().min(1, { message: 'Required' }),
  email: z.string().email().min(1, { message: 'Required' }),
  website: z.string().url().min(1, { message: 'Required' }),
  theme: z.string().min(1, { message: 'Required' }),
  details: z.string().min(1, { message: 'Required' }),
  address: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Required' }),
  city: z.string().min(1, { message: 'Required' }),
  contactName: z.string().min(1, { message: 'Required' }),
  contactPhone: z.string().min(1, { message: 'Required' }),
  contactEmail: z.string().email().min(1, { message: 'Required' }),
  gallery: z
    .instanceof(FileList)
    .refine((gallery) => gallery.length <= 5, {
      message: 'Maximum 5 images can be uploaded',
    })
    .optional(),
})

export const strayVenueFormSchema = venueFormSchema
  .pick({
    address: true,
    state: true,
    city: true,
  })
  .extend({
    name: z.string().min(1, { message: 'Required' }),
  })
