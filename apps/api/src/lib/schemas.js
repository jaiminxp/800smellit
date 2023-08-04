const Joi = require('joi')
const {
  userProfileTypes,
  productTypes,
  productCategories,
  tutorAvailabilityTypes,
} = require('../seeds/seedHelpers')

const musicianSchemas = {
  search: Joi.object({
    name: Joi.string().allow(''),
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
    genre: Joi.string().allow(''),
  }),
  create: Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
      address: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
    }).required(),
    genre: Joi.string().required(),
    bio: Joi.string().required(),

    band: Joi.string().allow(''),
    influences: Joi.string().allow(''),
    website: Joi.string().allow(''),
    logo: Joi.string().allow(''),
    gallery: Joi.array().items(Joi.string()),

    members: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        instrument: Joi.string().required(),
        role: Joi.string().required(),
      })
    ),

    events: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        genre: Joi.string().required(),
        date: Joi.date().required(),
        address: Joi.object({
          address: Joi.string().required(),
          state: Joi.string().required(),
          city: Joi.string().required(),
        }).required(),
      })
    ),
  }),
  update: Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
      address: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
    }).required(),
    genre: Joi.string().required(),
    bio: Joi.string().required(),

    band: Joi.string().allow(''),
    influences: Joi.string().allow(''),
    website: Joi.string().allow(''),
    logo: Joi.string().allow(''),
    gallery: Joi.array().items(Joi.string()),

    members: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        instrument: Joi.string().required(),
        role: Joi.string().required(),
      })
    ),
  }),
}

const eventSchemas = {
  search: Joi.object({
    type: Joi.string()
      .valid(...userProfileTypes)
      .required(),
    name: Joi.string().allow(''),
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
    genre: Joi.string().allow(''),
    startDate: Joi.date().allow(''),
    endDate: Joi.date().min(Joi.ref('startDate')).allow(''),
  }),
  create: Joi.object({
    organizerType: Joi.string().required(),
    organizerId: Joi.string().required(),
    venue: Joi.string().required(),
    name: Joi.string().required(),
    genre: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
  }),
  update: Joi.object({
    organizerType: Joi.string().required(),
    organizerId: Joi.string().required(),
    venue: Joi.string().required(),
    name: Joi.string().required(),
    genre: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
  }),
}

const productSchemas = {
  search: Joi.object({
    state: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    type: Joi.string()
      .valid(...productTypes)
      .allow('')
      .optional(),
    category: Joi.string()
      .valid(...productCategories)
      .allow('')
      .optional(),
  }),
  create: Joi.object({
    seller: Joi.string().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid(...productTypes),
    category: Joi.string()
      .required()
      .valid(...productCategories),
    instrument: Joi.string().required(),
    component: Joi.when('category', {
      is: 'component',
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
}

const tutorSchemas = {
  search: Joi.object({
    state: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    instrument: Joi.string().allow('').optional(),
    subject: Joi.string()
      .valid(...productTypes)
      .allow('')
      .optional(),
    availability: Joi.string()
      .valid(...tutorAvailabilityTypes)
      .allow('')
      .optional(),
  }),
  create: Joi.object({
    name: Joi.string().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    instrument: Joi.string().required(),
    subject: Joi.string()
      .required()
      .valid(...productTypes),
    availability: Joi.string()
      .required()
      .valid(...tutorAvailabilityTypes),
  }),
}

const serviceSchemas = {
  search: Joi.object({
    state: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    domain: Joi.string()
      .valid(...productTypes)
      .allow('')
      .optional(),
    name: Joi.string().allow('').optional(),
    expert: Joi.string().allow('').optional(),
  }),
  create: Joi.object({
    name: Joi.string().required(),
    expert: Joi.string().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    domain: Joi.string()
      .required()
      .valid(...productTypes),
    website: Joi.string().uri({ allowRelative: true }).required(),
  }),
}

const venueSchemas = {
  search: Joi.object({
    state: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    name: Joi.string().allow('').optional(),
  }),
  create: Joi.object({
    venue: Joi.string().required(),
  }),
  createStray: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number().required()).length(2),
  }),
}

const adminSchemas = {
  getUsers: Joi.object({
    email: Joi.string().allow('').optional(),
    status: Joi.string().allow('').valid('verified', 'unverified').optional(),
    roles: Joi.string().allow('').optional(),
  }),
  updateStatus: Joi.object({
    action: Joi.string().valid('approve', 'reject'),
  }),
}

module.exports = {
  musicianSchemas,
  eventSchemas,
  productSchemas,
  tutorSchemas,
  serviceSchemas,
  venueSchemas,
  adminSchemas,
}
