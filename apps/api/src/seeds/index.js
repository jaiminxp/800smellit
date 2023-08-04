require('dotenv').config()

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const {
  domains,
  prefix,
  names,
  cities,
  states,
  bands,
  dates,
  musicGenres,
  artGenres,
  musicInstruments,
  artInstruments,
  phoneNumbers,
  tutorAvailabilityTypes,
  musicServices,
  artServices,
  venueList,
  profileStatuses,
  coordinates,
} = require('./seedHelpers')

// MODEL IMPORTS
const User = require('../models/user')
const { Musician } = require('../models/musician')
const { Artist } = require('../models/artist')
const Event = require('../models/event')
const Product = require('../models/product')
const Tutor = require('../models/tutor')
const Service = require('../models/service')
const { Venue } = require('../models/venue')

const secret = process.env.JWT_SECRET
const { genPassword } = require('../lib/utils')
const { productTypes, productCategories } = require('./seedHelpers')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => {
  console.log('✅ Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const random100 = () => Math.floor(Math.random() * 100 + 1)

const MAX_VENUE_CAPACITY = 150000
const loremParagraph =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla dolorum nobis at laborum suscipit ratione magnam distinctio deleniti quisquam id qui quas, illo voluptatibus reiciendis impedit odio voluptatum praesentium molestiae! Assumenda, aliquam quod voluptates perspiciatis rerum totam dignissimos porro maiores quaerat esse. Ratione praesentium odit maiores exercitationem ex cumque, dolor id ut aut quidem voluptate magni iusto rerum reprehenderit quam.'

const gallery = [
  {
    url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814445/Seeds/musician-gallery-1.jpg',
  },
  {
    url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814444/Seeds/musician-gallery-2.jpg',
  },
  {
    url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814442/Seeds/musician-gallery-3.jpg',
  },
]

const artistGallery = [
  {
    url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814444/Seeds/artist-gallery-1.jpg',
  },
  {
    url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814443/Seeds/artist-gallery-2.jpg',
  },
  {
    url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814442/Seeds/artist-gallery-3.jpg',
  },
]

const users = []
const musicians = []
const artists = []
const events = []
const products = []
const tutors = []
const services = []
const venues = []

function getMembers(n) {
  const members = []

  for (let i = 0; i < n; i += 1) {
    const instrument = sample(Object.keys(musicInstruments))
    const member = {
      name: sample(names),
      role: `${instrument} player`,
      instrument,
    }
    members.push(member)
  }

  return members
}

const seedDB = async () => {
  // empty collections
  await User.deleteMany({})
  await Musician.deleteMany({})
  await Artist.deleteMany({})

  for (let i = 0; i < prefix.length; i += 1) {
    const email = `${sample(prefix)}@${sample(domains)}`
    const password = '800smellit'

    const { salt, hash } = genPassword(password)

    const state = sample(states)
    const band = sample(bands)

    const user = new User({
      email,
      salt,
      hash,
      isEmailVerified: true,
      emailVerificationToken: jwt.sign({ email }, secret),
      roles: ['Musician', 'Artist'],
    })

    const musician = new Musician({
      user,
      profileStatus: sample(profileStatuses),
      name: sample(names),
      genre: sample(musicGenres),
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quos optio explicabo, asperiores eos eaque maxime! Minima voluptas neque illum! Est minima excepturi quidem. Reprehenderit animi rerum perferendis soluta a?',
      band,
      website: `https://${band.replaceAll(' ', '')}.com`,
      phone: sample(phoneNumbers),
      logo: {
        url: 'https://picsum.photos/200',
      },
      gallery,
      songs: [
        {
          url: 'https://res.cloudinary.com/dkvnoimct/video/upload/v1681120834/Seeds/song-1.mp3',
        },
        {
          url: 'https://res.cloudinary.com/dkvnoimct/video/upload/v1681120832/Seeds/song-2.mp3',
        },
        {
          url: 'https://res.cloudinary.com/dkvnoimct/video/upload/v1681120831/Seeds/song-3.mp3',
        },
      ],
      influences: sample(musicGenres),
      address: {
        address: `${random100()}th street`,
        state,
        city: sample(cities[state]),
      },
      members: getMembers(5),
    })

    const name = sample(names)
    const artist = new Artist({
      user,
      profileStatus: sample(profileStatuses),
      name,
      genre: sample(artGenres),
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quos optio explicabo, asperiores eos eaque maxime! Minima voluptas neque illum! Est minima excepturi quidem. Reprehenderit animi rerum perferendis soluta a?',
      website: `https://${name.replaceAll(' ', '')}.com`,
      phone: sample(phoneNumbers),
      gallery: artistGallery,
      influences: sample(artGenres),
      address: {
        address: `${random100()}th street`,
        state,
        city: sample(cities[state]),
      },
    })

    musicians.push(musician)
    artists.push(artist)
    users.push(user)
  }

  // write to db
  await User.insertMany(users)
  await Musician.insertMany(musicians)
  await Artist.insertMany(artists)
}

const seedProducts = async () => {
  await Product.deleteMany({})

  users.forEach((user) => {
    for (let j = 0; j < 5; j += 1) {
      const type = sample(productTypes)
      const category = sample(productCategories)
      const state = sample(states)

      const product = new Product({
        user,
        type,
        category,
        seller: sample(names),
        contact: sample(phoneNumbers),
        address: {
          address: `${random100()}th street`,
          state,
          city: sample(cities[state]),
        },
      })

      if (type === 'music') {
        product.instrument = sample(Object.keys(musicInstruments))

        if (category === 'component') {
          product.component = sample(musicInstruments[product.instrument])
        }
      } else if (type === 'art') {
        product.instrument = sample(Object.keys(artInstruments))

        if (category === 'component') {
          product.component = sample(artInstruments[product.instrument])
        }
      }

      products.push(product)
    }
  })

  await Product.insertMany(products)
}

const seedTutors = async () => {
  await Tutor.deleteMany({})

  users.forEach((user) => {
    for (let j = 0; j < 5; j += 1) {
      const subject = sample(productTypes)
      const state = sample(states)

      const tutor = new Tutor({
        user,
        name: sample(names),
        subject,
        availability: sample(tutorAvailabilityTypes),
        contact: sample(phoneNumbers),
        address: {
          address: `${random100()}th street`,
          state,
          city: sample(cities[state]),
        },
      })

      if (subject === 'music') {
        tutor.instrument = sample(Object.keys(musicInstruments))
      } else if (subject === 'art') {
        tutor.instrument = sample(Object.keys(artInstruments))
      }

      tutors.push(tutor)
    }
  })

  await Tutor.insertMany(tutors)
}

const seedServices = async () => {
  await Service.deleteMany({})

  users.forEach((user) => {
    for (let j = 0; j < 5; j += 1) {
      const domain = sample(productTypes)
      const state = sample(states)
      const expert = sample(names)

      const service = new Service({
        user,
        expert,
        domain,
        website: `https://${expert.replaceAll(' ', '')}.com`,
        contact: sample(phoneNumbers),
        address: {
          address: `${random100()}th street`,
          state,
          city: sample(cities[state]),
        },
      })

      if (domain === 'music') {
        service.name = sample(musicServices)
      } else if (domain === 'art') {
        service.name = sample(artServices)
      }

      services.push(service)
    }
  })

  await Service.insertMany(services)
}

const seedVenues = async () => {
  await Venue.deleteMany({})

  users.forEach((user) => {
    for (let j = 0; j < 5; j += 1) {
      const state = sample(states)

      let capacity = Math.floor(Math.random() * MAX_VENUE_CAPACITY)
      capacity -= capacity % 10 // rounding off

      const venueName = sample(venueList)
      const safeVenueName = venueName.replaceAll(' ', '').toLowerCase()
      const contactName = sample(names)

      const venue = new Venue({
        user,
        gallery,
        name: venueName,
        email: `${safeVenueName}@${sample(domains)}`,
        phone: sample(phoneNumbers),
        theme: sample(sample([artGenres, musicGenres])),
        website: `https://${safeVenueName}.com`,
        contact: {
          name: contactName,
          phone: sample(phoneNumbers),
          email: `${contactName.replaceAll(' ', '').toLowerCase()}@${sample(
            domains
          )}`,
        },
        details: loremParagraph,
        address: {
          address: `${random100()}th street`,
          state,
          city: sample(cities[state]),
        },
        geometry: {
          type: 'Point',
          coordinates: sample(coordinates),
        },
      })

      venues.push(venue)
    }
  })

  await Venue.insertMany(venues)
}

const seedAdmin = async () => {
  const { ADMIN_AUTH_EMAIL, ADMIN_PASSWORD } = process.env

  const { salt, hash } = genPassword(ADMIN_PASSWORD)

  const admin = new User({
    email: ADMIN_AUTH_EMAIL,
    salt,
    hash,
    isEmailVerified: true,
    roles: ['admin'],
  })

  await admin.save()
}

const seedRevisions = async () => {
  const approvedMusicians = await Musician.find({ profileStatus: 'approved' })
  const approvedArtists = await Artist.find({ profileStatus: 'approved' })

  const nextMusicians = approvedMusicians.map(async (musician) => {
    const update = sample([true, false])

    if (update) {
      const band = sample(bands)
      const state = sample(states)

      musician.revision = {
        name: sample(names),
        genre: sample(musicGenres),
        bio: 'Best musician this side of Missisipi',
        band,
        website: `https://${band.replaceAll(' ', '')}.com`,
        phone: sample(phoneNumbers),
        logo: {
          url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684603462/Seeds/revision-band-logo.jpg',
        },
        gallery: [
          {
            url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814445/Seeds/musician-gallery-1.jpg',
          },
        ],
        songs: [
          {
            url: 'https://res.cloudinary.com/dkvnoimct/video/upload/v1681120834/Seeds/song-1.mp3',
          },
        ],
        influences: sample(musicGenres),
        address: {
          address: `${random100()}th street`,
          state,
          city: sample(cities[state]),
        },
        members: getMembers(5),
      }

      await musician.save()
    }
  })

  const nextArtists = approvedArtists.map(async (artist) => {
    const update = sample([true, false])

    if (update) {
      const name = sample(names)
      const state = sample(states)

      artist.revision = {
        name: sample(names),
        genre: sample(artGenres),
        bio: 'Best artist this side of Missisipi',
        website: `https://${name.replaceAll(' ', '')}.com`,
        phone: sample(phoneNumbers),
        gallery: [
          {
            url: 'https://res.cloudinary.com/dkvnoimct/image/upload/v1684814442/Seeds/artist-gallery-3.jpg',
          },
        ],
        influences: sample(artGenres),
        address: {
          address: `${random100()}th street`,
          state,
          city: sample(cities[state]),
        },
      }

      await artist.save()
    }
  })

  await Promise.all(nextMusicians)
  await Promise.all(nextArtists)
}

const seedEvents = async () => {
  let nextVenues = []
  let venueIndex = 0

  await Event.deleteMany({})

  const nextMusicians = musicians.map((musician) => {
    for (let i = 0; i < 5; i += 1) {
      const venue = venues[venueIndex]
      venueIndex = (venueIndex + 1) % venues.length

      const musicEvent = new Event({
        venue,
        organizerType: 'Musician',
        organizerInfo: { organizer: musician, name: musician.name },
        name: `${musician.band} ${musician.genre} Tour`,
        genre: musician.genre,
        date: new Date(sample(dates)),
      })

      events.push(musicEvent)
      venue.events.push(musicEvent)
      nextVenues.push(venue.save())
      musician.events.push(musicEvent)
    }
    return musician.save()
  })

  await Promise.all(nextVenues)
  nextVenues = []

  const nextArtists = artists.map((artist) => {
    for (let i = 0; i < 5; i += 1) {
      const venue = venues[venueIndex]
      venueIndex = (venueIndex + 1) % venues.length

      const artEvent = new Event({
        venue,
        organizerType: 'Artist',
        organizerInfo: { organizer: artist, name: artist.name },
        name: `${artist.genre} gallery`,
        genre: artist.genre,
        date: new Date(sample(dates)),
      })

      events.push(artEvent)
      venue.events.push(artEvent)
      nextVenues.push(venue.save())
      artist.events.push(artEvent)
    }
    return artist.save()
  })

  await Event.insertMany(events)
  await Promise.all(nextVenues)
  await Promise.all(nextMusicians)
  await Promise.all(nextArtists)
}

seedDB().then(async () => {
  await seedRevisions()
  await seedProducts()
  await seedTutors()
  await seedServices()
  await seedVenues()
  await seedEvents()
  await seedAdmin()
  console.log('✅ Data seeding complete')
  mongoose.connection.close()
})
