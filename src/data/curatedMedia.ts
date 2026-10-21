import { MediaDetails, MediaItem } from '../types/tmdb';

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE_SM = 'w342';
export const POSTER_SIZE_MD = 'w500';
export const POSTER_SIZE_LG = 'w780';
export const BACKDROP_SIZE_MD = 'w780';
export const BACKDROP_SIZE_LG = 'w1280';
export const BACKDROP_SIZE_ORIG = 'original';

export function getPosterUrl(path: string | null | undefined, size: string = POSTER_SIZE_MD): string {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null | undefined, size: string = BACKDROP_SIZE_ORIG): string {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null | undefined): string {
  if (!path) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/w185${path}`;
}

// Curated authentic movie catalog with official YouTube trailer keys and metadata
export const CURATED_MOVIES: MediaDetails[] = [
  {
    id: 693134,
    media_type: 'movie',
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s52002f.jpg',
    vote_average: 8.2,
    vote_count: 5310,
    release_date: '2024-03-01',
    runtime: 166,
    status: 'Released',
    budget: 190000000,
    revenue: 711844358,
    genres: [
      { id: 878, name: 'Science Fiction' },
      { id: 12, name: 'Adventure' },
    ],
    trailer_key: 'Way9Dexny3w',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: '/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
        { id: 505710, name: 'Zendaya', character: 'Chani', profile_path: '/tyl4f52w0mFv3h8f1LqZ9J0d5gD.jpg' },
        { id: 934, name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', profile_path: '/4Z54oUuhs2c5F4N54P6q9f0d7eX.jpg' },
        { id: 1373737, name: 'Florence Pugh', character: 'Princess Irulan', profile_path: '/75UQyW29W3QJkYt52Kq4s1H.jpg' },
        { id: 71580, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: '/bS3Q5yP2u1KjE7o0Q2G9u8v7h1r.jpg' },
      ],
      crew: [
        { id: 137427, name: 'Denis Villeneuve', job: 'Director', department: 'Directing' },
        { id: 947, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' },
        { id: 7454, name: 'Greig Fraser', job: 'Director of Photography', department: 'Camera' },
      ],
    },
    videos: {
      results: [
        { id: 'v1', key: 'Way9Dexny3w', name: 'Official Trailer 3', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
        { id: 'v2', key: 'U2Qp5pL38e8', name: 'Official Trailer 1', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 872585,
    media_type: 'movie',
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, examining the moral, political, and personal consequences of unearthing quantum power.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    vote_average: 8.1,
    vote_count: 8640,
    release_date: '2023-07-21',
    runtime: 181,
    status: 'Released',
    budget: 100000000,
    revenue: 957000000,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 36, name: 'History' },
    ],
    trailer_key: 'uYPbbksJxIg',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    credits: {
      cast: [
        { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: '/dm6Vb6V2Vv3g7k9d7e5d8a9b0c1.jpg' },
        { id: 5081, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profile_path: '/nPJdtQRiqbe6025d2b7e9a8f4c2.jpg' },
        { id: 1892, name: 'Matt Damon', character: 'Leslie Groves', profile_path: '/elzaU6jbs592f6d8a7c9b0e1d2f.jpg' },
        { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: '/1YjdSym1j5d8a9c0b2e3f4g5h6i.jpg' },
      ],
      crew: [
        { id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
        { id: 74164, name: 'Ludwig Göransson', job: 'Original Music Composer', department: 'Sound' },
      ],
    },
    videos: {
      results: [
        { id: 'v10', key: 'uYPbbksJxIg', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 157336,
    media_type: 'movie',
    title: 'Interstellar',
    original_title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTsqBk79NvlHgVfHjJpZflkQ.jpg',
    vote_average: 8.4,
    vote_count: 34500,
    release_date: '2014-11-05',
    runtime: 169,
    status: 'Released',
    budget: 165000000,
    revenue: 773867645,
    genres: [
      { id: 12, name: 'Adventure' },
      { id: 18, name: 'Drama' },
      { id: 878, name: 'Science Fiction' },
    ],
    trailer_key: 'zSWdZVtXT7E',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 10297, name: 'Matthew McConaughey', character: 'Joseph Cooper', profile_path: '/sY2waY06vm0e6f7d8a9b0c1.jpg' },
        { id: 1813, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profile_path: '/tL6nxIvpm6b7e8d9a0c1b2.jpg' },
        { id: 83002, name: 'Jessica Chastain', character: 'Murphy Cooper', profile_path: '/vOw3d3P5y0e1f2a3b4c5d6.jpg' },
        { id: 3895, name: 'Michael Caine', character: 'Professor John Brand', profile_path: '/klP3r5m0e1f2a3b4c5.jpg' },
      ],
      crew: [
        { id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
        { id: 947, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' },
      ],
    },
    videos: {
      results: [
        { id: 'v20', key: 'zSWdZVtXT7E', name: 'Official Trailer 3', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 569094,
    media_type: 'movie',
    title: 'Spider-Man: Across the Spider-Verse',
    original_title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It’s how you wear the mask that matters.',
    overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    vote_average: 8.3,
    vote_count: 6700,
    release_date: '2023-06-02',
    runtime: 140,
    status: 'Released',
    budget: 100000000,
    revenue: 690516673,
    genres: [
      { id: 16, name: 'Animation' },
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 878, name: 'Science Fiction' },
    ],
    trailer_key: 'cqGjhVJWtEg',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    credits: {
      cast: [
        { id: 587506, name: 'Shameik Moore', character: 'Miles Morales (voice)', profile_path: '/7m3w4k5.jpg' },
        { id: 54693, name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)', profile_path: '/2m3w4k5.jpg' },
        { id: 1373737, name: 'Daniel Kaluuya', character: 'Hobart "Hobie" Brown / Spider-Punk (voice)', profile_path: '/3m3w4k5.jpg' },
        { id: 224513, name: 'Oscar Isaac', character: 'Miguel O\'Hara / Spider-Man 2099 (voice)', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 1089200, name: 'Joaquim Dos Santos', job: 'Director', department: 'Directing' },
        { id: 1089201, name: 'Kemp Powers', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v30', key: 'cqGjhVJWtEg', name: 'Official Trailer 2', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 335984,
    media_type: 'movie',
    title: 'Blade Runner 2049',
    original_title: 'Blade Runner 2049',
    tagline: 'There\'s still a page left.',
    overview: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos.',
    poster_path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: '/sAtoMqDVhNDQBc3QJL3RF6hlxGq.jpg',
    vote_average: 8.0,
    vote_count: 13200,
    release_date: '2017-10-06',
    runtime: 164,
    status: 'Released',
    budget: 150000000,
    revenue: 267700000,
    genres: [
      { id: 878, name: 'Science Fiction' },
      { id: 18, name: 'Drama' },
      { id: 9648, name: 'Mystery' },
    ],
    trailer_key: 'gCcx85zbxz4',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 30614, name: 'Ryan Gosling', character: 'Officer K', profile_path: '/7m3w4k5.jpg' },
        { id: 3, name: 'Harrison Ford', character: 'Rick Deckard', profile_path: '/2m3w4k5.jpg' },
        { id: 224194, name: 'Ana de Armas', character: 'Joi', profile_path: '/3m3w4k5.jpg' },
        { id: 94098, name: 'Sylvia Hoeks', character: 'Luv', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 137427, name: 'Denis Villeneuve', job: 'Director', department: 'Directing' },
        { id: 947, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' },
      ],
    },
    videos: {
      results: [
        { id: 'v40', key: 'gCcx85zbxz4', name: 'Official Trailer 2', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 27205,
    media_type: 'movie',
    title: 'Inception',
    original_title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: inception.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    vote_average: 8.4,
    vote_count: 36000,
    release_date: '2010-07-16',
    runtime: 148,
    status: 'Released',
    budget: 160000000,
    revenue: 836836967,
    genres: [
      { id: 28, name: 'Action' },
      { id: 878, name: 'Science Fiction' },
      { id: 12, name: 'Adventure' },
    ],
    trailer_key: 'YoHD9XEInc0',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    credits: {
      cast: [
        { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/1m3w4k5.jpg' },
        { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: '/2m3w4k5.jpg' },
        { id: 27578, name: 'Elliot Page', character: 'Ariadne', profile_path: '/3m3w4k5.jpg' },
        { id: 2524, name: 'Tom Hardy', character: 'Eames', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v50', key: 'YoHD9XEInc0', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 155,
    media_type: 'movie',
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    tagline: 'Why so serious?',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    vote_average: 8.5,
    vote_count: 32000,
    release_date: '2008-07-18',
    runtime: 152,
    status: 'Released',
    budget: 185000000,
    revenue: 1004558444,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 28, name: 'Action' },
      { id: 80, name: 'Crime' },
      { id: 53, name: 'Thriller' },
    ],
    trailer_key: 'EXeTwQWrcwY',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profile_path: '/1m3w4k5.jpg' },
        { id: 1810, name: 'Heath Ledger', character: 'Joker', profile_path: '/2m3w4k5.jpg' },
        { id: 3895, name: 'Michael Caine', character: 'Alfred Pennyworth', profile_path: '/3m3w4k5.jpg' },
        { id: 64, name: 'Gary Oldman', character: 'James Gordon', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v60', key: 'EXeTwQWrcwY', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 545611,
    media_type: 'movie',
    title: 'Everything Everywhere All at Once',
    original_title: 'Everything Everywhere All at Once',
    tagline: 'The universe is so much bigger than you realize.',
    overview: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what\'s important to her by connecting with the lives she could have led in other universes.',
    poster_path: '/w3LxiVYPqrlexP02048T9rT5L15.jpg',
    backdrop_path: '/7zNWp7hH9H3y8m1Fj3v4n5p6q7r.jpg',
    vote_average: 7.9,
    vote_count: 6100,
    release_date: '2022-03-24',
    runtime: 139,
    status: 'Released',
    budget: 25000000,
    revenue: 141200000,
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 878, name: 'Science Fiction' },
    ],
    trailer_key: 'wxN1T1uxQ2g',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    credits: {
      cast: [
        { id: 1620, name: 'Michelle Yeoh', character: 'Evelyn Wang', profile_path: '/1m3w4k5.jpg' },
        { id: 569, name: 'Ke Huy Quan', character: 'Waymond Wang', profile_path: '/2m3w4k5.jpg' },
        { id: 142104, name: 'Stephanie Hsu', character: 'Joy Wang / Jobu Tupaki', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 1089202, name: 'Daniel Kwan', job: 'Director', department: 'Directing' },
        { id: 1089203, name: 'Daniel Scheinert', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v70', key: 'wxN1T1uxQ2g', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 763215,
    media_type: 'movie',
    title: 'Civil War',
    original_title: 'Civil War',
    tagline: 'Welcome to the frontline.',
    overview: 'In a dystopian future America, a team of military-embedded journalists races across the United States during a rapidly escalating second American Civil War that has engulfed the entire nation.',
    poster_path: '/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
    backdrop_path: '/z121mtFTqkW9zZlyENENq596q9f.jpg',
    vote_average: 7.0,
    vote_count: 2400,
    release_date: '2024-04-12',
    runtime: 109,
    status: 'Released',
    budget: 50000000,
    revenue: 122500000,
    genres: [
      { id: 28, name: 'Action' },
      { id: 18, name: 'Drama' },
      { id: 10752, name: 'War' },
    ],
    trailer_key: 'aDyQxtg0V2w',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 205, name: 'Kirsten Dunst', character: 'Lee Smith', profile_path: '/1m3w4k5.jpg' },
        { id: 1545693, name: 'Cailee Spaeny', character: 'Jessie Cullen', profile_path: '/2m3w4k5.jpg' },
        { id: 10993, name: 'Wagner Moura', character: 'Joel', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 11516, name: 'Alex Garland', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v80', key: 'aDyQxtg0V2w', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 414906,
    media_type: 'movie',
    title: 'The Batman',
    original_title: 'The Batman',
    tagline: 'Unmask the truth.',
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop_path: '/5P8SmMzSNYikXpxil6BYzG16611.jpg',
    vote_average: 7.7,
    vote_count: 9800,
    release_date: '2022-03-04',
    runtime: 176,
    status: 'Released',
    budget: 200000000,
    revenue: 772000000,
    genres: [
      { id: 80, name: 'Crime' },
      { id: 9648, name: 'Mystery' },
      { id: 53, name: 'Thriller' },
    ],
    trailer_key: 'mqqft2x_Aa4',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    credits: {
      cast: [
        { id: 11288, name: 'Robert Pattinson', character: 'Bruce Wayne / Batman', profile_path: '/1m3w4k5.jpg' },
        { id: 37153, name: 'Zoë Kravitz', character: 'Selina Kyle / Catwoman', profile_path: '/2m3w4k5.jpg' },
        { id: 8447, name: 'Paul Dano', character: 'Edward Nashton / Riddler', profile_path: '/3m3w4k5.jpg' },
        { id: 133, name: 'Colin Farrell', character: 'Oswald Cobblepot / Penguin', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 1776, name: 'Matt Reeves', job: 'Director', department: 'Directing' },
        { id: 153, name: 'Michael Giacchino', job: 'Original Music Composer', department: 'Sound' },
      ],
    },
    videos: {
      results: [
        { id: 'v90', key: 'mqqft2x_Aa4', name: 'Main Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 129,
    media_type: 'movie',
    title: 'Spirited Away',
    original_title: '千と千尋の神隠し',
    tagline: 'The tunnel led to a mysterious world.',
    overview: 'A young girl, Chihiro, becomes trapped in a strange world of spirits. After her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free herself and her family.',
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
    vote_average: 8.5,
    vote_count: 16400,
    release_date: '2001-07-20',
    runtime: 125,
    status: 'Released',
    budget: 19000000,
    revenue: 395580000,
    genres: [
      { id: 16, name: 'Animation' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
    ],
    trailer_key: 'ByXuk9QqQkk',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    credits: {
      cast: [
        { id: 19588, name: 'Rumi Hiiragi', character: 'Chihiro Ogino (voice)', profile_path: '/1m3w4k5.jpg' },
        { id: 19589, name: 'Miyu Irino', character: 'Haku (voice)', profile_path: '/2m3w4k5.jpg' },
      ],
      crew: [
        { id: 608, name: 'Hayao Miyazaki', job: 'Director', department: 'Directing' },
        { id: 609, name: 'Joe Hisaishi', job: 'Original Music Composer', department: 'Sound' },
      ],
    },
    videos: {
      results: [
        { id: 'v100', key: 'ByXuk9QqQkk', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 278,
    media_type: 'movie',
    title: 'The Shawshank Redemption',
    original_title: 'The Shawshank Redemption',
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
    overview: 'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.',
    poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    vote_average: 8.7,
    vote_count: 27100,
    release_date: '1994-09-23',
    runtime: 142,
    status: 'Released',
    budget: 25000000,
    revenue: 28341469,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
    trailer_key: 'PLl99DlL6b4',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 504, name: 'Tim Robbins', character: 'Andy Dufresne', profile_path: '/1m3w4k5.jpg' },
        { id: 192, name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding', profile_path: '/2m3w4k5.jpg' },
      ],
      crew: [
        { id: 4027, name: 'Frank Darabont', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v110', key: 'PLl99DlL6b4', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 969681,
    media_type: 'movie',
    title: 'Spider-Man: Brand New Day',
    original_title: 'Spider-Man: Brand New Day',
    tagline: 'A brand new day starts now.',
    overview: 'Fighting crime full-time as Spider-Man in a world that doesn\'t remember him—and the pressure of seeing his friends move on with their lives—Peter Parker faces thrilling new adversaries and the weight of his chosen destiny.',
    poster_path: '/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    backdrop_path: '/4tjxYg2AbOzzG9G1YuiT2NzYhlH.jpg',
    vote_average: 8.5,
    vote_count: 3200,
    release_date: '2026-07-29',
    runtime: 145,
    status: 'In Production',
    budget: 200000000,
    revenue: 0,
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 878, name: 'Science Fiction' },
    ],
    trailer_key: 'ITv7MbH9mTc',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 1136406, name: 'Tom Holland', character: 'Peter Parker / Spider-Man', profile_path: '/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg' },
        { id: 505710, name: 'Zendaya', character: 'MJ', profile_path: '/tyl4f52w0mFv3h8f1LqZ9J0d5gD.jpg' },
        { id: 124747, name: 'Jacob Batalon', character: 'Ned Leeds', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 137427, name: 'Destin Daniel Cretton', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_sp1', key: 'ITv7MbH9mTc', name: 'SPIDER-MAN: BRAND NEW DAY - Extended Preview', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
        { id: 'v_sp2', key: 'CPzqXzpH-p8', name: 'Brand New Day - Fans Unite Worldwide', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 1339713,
    media_type: 'movie',
    title: 'Obsession',
    original_title: 'Obsession',
    tagline: 'Be careful who you wish for…',
    overview:
      'After breaking the mysterious "One Wish Willow" to win his crush\'s heart, a hopeless romantic finds himself getting exactly what he asked for but soon discovers that some desires come at a dark, sinister price.',
    poster_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg',
    backdrop_path: '/5lTZyuBTNOfawsfPT8Q0cIg6qAF.jpg',
    vote_average: 8.2,
    vote_count: 6100,
    release_date: '2026-05-13',
    runtime: 104,
    status: 'Released',
    budget: 15000000,
    revenue: 45000000,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 53, name: 'Thriller' },
      { id: 9648, name: 'Mystery' },
    ],
    trailer_key: 'gMC8kkwbIQQ',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    imdb_id: 'tt37287335',
    credits: {
      cast: [
        { id: 13391, name: 'Michael Johnston', character: 'Bear', profile_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg' },
        { id: 13392, name: 'Inde Navarrette', character: 'Nikki', profile_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg' },
        { id: 13393, name: 'Cooper Tomlinson', character: 'Josh', profile_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg' },
        { id: 13394, name: 'Megan Lawless', character: 'Chloe', profile_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg' },
        { id: 13395, name: 'Andy Richter', character: 'Professor Collins', profile_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg' },
      ],
      crew: [
        { id: 13396, name: 'Curry Barker', job: 'Director & Writer', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_obs2026_1', key: 'gMC8kkwbIQQ', name: 'Official Trailer (2026)', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 1400837,
    media_type: 'movie',
    title: 'Other Mommy',
    original_title: 'Other Mommy',
    tagline: "Your mommy won't save you.",
    overview:
      'Young Bela forms a relationship with a sinister entity in her home that looks uncannily like her own mother, drawing her into a terrifying and increasingly dark world.',
    poster_path: '/fGRNCssTRrhYZxNzykGGCoMsAVq.jpg',
    backdrop_path: '/ncm7djsVTHQQMX2HEbEVxMUFchG.jpg',
    vote_average: 6.8,
    vote_count: 1420,
    release_date: '2026-10-07',
    runtime: 93,
    status: 'Released',
    budget: 18000000,
    revenue: 58779544,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 53, name: 'Thriller' },
    ],
    trailer_key: 'Bh2FpiLSneU',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    imdb_id: 'tt36586020',
    credits: {
      cast: [
        { id: 14001, name: 'Bella Thorne', character: 'Mother / Entity', profile_path: '/fGRNCssTRrhYZxNzykGGCoMsAVq.jpg' },
        { id: 14002, name: 'Brooklynn Prince', character: 'Bela', profile_path: '/ncm7djsVTHQQMX2HEbEVxMUFchG.jpg' },
      ],
      crew: [
        { id: 14003, name: 'Bryce McGuire', job: 'Director & Writer', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_om2026_1', key: 'Bh2FpiLSneU', name: 'Official Teaser Trailer (2026)', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
];

// Curated authentic TV series catalog with real episodes and trailers
export const CURATED_TV: MediaDetails[] = [
  {
    id: 126308,
    media_type: 'tv',
    name: 'Shōgun',
    original_name: 'Shōgun',
    tagline: 'Dawn of a new dynasty.',
    overview: 'When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power and devastate his formidable enemies in feudal Japan.',
    poster_path: '/7O4iVfOMQmdCSxhOg1WNzG1AgYT.jpg',
    backdrop_path: '/jWXrQstj7p9Wxd89wms8RLBMvm4.jpg',
    vote_average: 8.5,
    vote_count: 1450,
    first_air_date: '2024-02-27',
    number_of_seasons: 1,
    number_of_episodes: 10,
    episode_run_time: [60],
    status: 'Returning Series',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 10768, name: 'War & Politics' },
    ],
    trailer_key: 'yKfMc69Ecu8',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 12519, name: 'Hiroyuki Sanada', character: 'Lord Yoshii Toranaga', profile_path: '/1m3w4k5.jpg' },
        { id: 2011707, name: 'Cosmo Jarvis', character: 'John Blackthorne', profile_path: '/2m3w4k5.jpg' },
        { id: 2542457, name: 'Anna Sawai', character: 'Toda Mariko', profile_path: '/3m3w4k5.jpg' },
        { id: 13324, name: 'Tadanobu Asano', character: 'Kashigi Yabushige', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 93245, name: 'Rachel Kondo', job: 'Creator', department: 'Writing' },
        { id: 93246, name: 'Justin Marks', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v201', key: 'yKfMc69Ecu8', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 196884,
        season_number: 1,
        name: 'Season 1',
        overview: 'In 1600 Japan, Lord Toranaga fights for his life against political adversaries on the Council of Regents while an English pilot washes ashore.',
        poster_path: '/7O4iVfOMQmdCSxhOg1WNzG1AgYT.jpg',
        episode_count: 10,
        episodes: [
          {
            id: 48901,
            episode_number: 1,
            season_number: 1,
            name: 'Chapter One: Anjin',
            overview: 'Destinies converge in Japan when an English barbarian ship arrives in the territory of warlord Toranaga.',
            air_date: '2024-02-27',
            still_path: '/jWXrQstj7p9Wxd89wms8RLBMvm4.jpg',
            vote_average: 8.6,
            runtime: 60,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
          {
            id: 48902,
            episode_number: 2,
            season_number: 1,
            name: 'Chapter Two: Servants of Two Masters',
            overview: 'Blackthorne\'s arrival in Osaka pits Toranaga against the Council of Regents.',
            air_date: '2024-02-27',
            still_path: '/7O4iVfOMQmdCSxhOg1WNzG1AgYT.jpg',
            vote_average: 8.7,
            runtime: 58,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            id: 48903,
            episode_number: 3,
            season_number: 1,
            name: 'Chapter Three: Tomorrow is Tomorrow',
            overview: 'Toranaga orchestrates a perilous escape from Osaka Castle as enemies surround him.',
            air_date: '2024-03-05',
            still_path: '/jWXrQstj7p9Wxd89wms8RLBMvm4.jpg',
            vote_average: 8.9,
            runtime: 56,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 95396,
    media_type: 'tv',
    name: 'Severance',
    original_name: 'Severance',
    tagline: 'Please try to enjoy each fact equally.',
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    poster_path: '/7msa97Jz7h771f825227kL.jpg',
    backdrop_path: '/4H56f8f4a7c8b9d0e1f2.jpg',
    vote_average: 8.4,
    vote_count: 1950,
    first_air_date: '2022-02-18',
    number_of_seasons: 2,
    number_of_episodes: 19,
    episode_run_time: [55],
    status: 'Returning Series',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 9648, name: 'Mystery' },
    ],
    trailer_key: 'xEQP4VVuyrY',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 36801, name: 'Adam Scott', character: 'Mark Scout', profile_path: '/1m3w4k5.jpg' },
        { id: 82187, name: 'Zach Cherry', character: 'Dylan George', profile_path: '/2m3w4k5.jpg' },
        { id: 114425, name: 'Britt Lower', character: 'Helly Riggs', profile_path: '/3m3w4k5.jpg' },
        { id: 1899, name: 'Patricia Arquette', character: 'Harmony Cobel', profile_path: '/4m3w4k5.jpg' },
        { id: 1230, name: 'John Turturro', character: 'Irving Bailiff', profile_path: '/5m3w4k5.jpg' },
        { id: 65, name: 'Christopher Walken', character: 'Burt Goodman', profile_path: '/6m3w4k5.jpg' },
      ],
      crew: [
        { id: 7399, name: 'Dan Erickson', job: 'Creator', department: 'Writing' },
        { id: 73421, name: 'Ben Stiller', job: 'Director & Executive Producer', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v210', key: 'xEQP4VVuyrY', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 135912,
        season_number: 1,
        name: 'Season 1',
        overview: 'Mark Scout leads a team at Lumon Industries whose employees undergo a severance procedure.',
        poster_path: '/7msa97Jz7h771f825227kL.jpg',
        episode_count: 9,
        episodes: [
          {
            id: 3491,
            episode_number: 1,
            season_number: 1,
            name: 'Good News About Hell',
            overview: 'Mark Scout is promoted to Macrodata Refinement lead after Petey is unexpectedly terminated.',
            air_date: '2022-02-18',
            still_path: '/4H56f8f4a7c8b9d0e1f2.jpg',
            vote_average: 8.5,
            runtime: 57,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
          {
            id: 3492,
            episode_number: 2,
            season_number: 1,
            name: 'Half Loop',
            overview: 'The team trains Helly on macrodata refinement as Petey contacts Mark on the outside.',
            air_date: '2022-02-18',
            still_path: '/7msa97Jz7h771f825227kL.jpg',
            vote_average: 8.4,
            runtime: 53,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 94605,
    media_type: 'tv',
    name: 'Arcane',
    original_name: 'Arcane',
    tagline: 'Every legend has a beginning.',
    overview: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.',
    poster_path: '/fq2Wf3bLgZ8b4d8A4f7a.jpg',
    backdrop_path: '/uDgy6hyPd82kOHh6I95fltLialP.jpg',
    vote_average: 8.9,
    vote_count: 4200,
    first_air_date: '2021-11-06',
    number_of_seasons: 2,
    number_of_episodes: 18,
    episode_run_time: [42],
    status: 'Ended',
    genres: [
      { id: 16, name: 'Animation' },
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 10759, name: 'Action & Adventure' },
    ],
    trailer_key: 'fXmAurh012s',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    credits: {
      cast: [
        { id: 54693, name: 'Hailee Steinfeld', character: 'Vi (voice)', profile_path: '/1m3w4k5.jpg' },
        { id: 1106516, name: 'Ella Purnell', character: 'Jinx / Powder (voice)', profile_path: '/2m3w4k5.jpg' },
        { id: 124747, name: 'Kevin Alejandro', character: 'Jayce Talis (voice)', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 3267562, name: 'Christian Linke', job: 'Creator', department: 'Writing' },
        { id: 3267563, name: 'Alex Yee', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v220', key: 'fXmAurh012s', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 134187,
        season_number: 1,
        name: 'Season 1',
        overview: 'Sisters Vi and Powder find themselves in a violent revolution in the underground city of Zaun.',
        poster_path: '/fq2Wf3bLgZ8b4d8A4f7a.jpg',
        episode_count: 9,
        episodes: [
          {
            id: 28411,
            episode_number: 1,
            season_number: 1,
            name: 'Welcome to the Playground',
            overview: 'Orphan sisters Vi and Powder venture to Piltover to rob a collector\'s lab.',
            air_date: '2021-11-06',
            still_path: '/uDgy6hyPd82kOHh6I95fltLialP.jpg',
            vote_average: 9.1,
            runtime: 43,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 100088,
    media_type: 'tv',
    name: 'The Last of Us',
    original_name: 'The Last of Us',
    tagline: 'When you\'re lost in the darkness, look for the light.',
    overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.',
    poster_path: '/uKvVjHNqB5VmOrdxqAt2V7J78ED.jpg',
    backdrop_path: '/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    vote_average: 8.6,
    vote_count: 5100,
    first_air_date: '2023-01-15',
    number_of_seasons: 2,
    number_of_episodes: 16,
    episode_run_time: [58],
    status: 'Returning Series',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 10759, name: 'Action & Adventure' },
    ],
    trailer_key: 'uLtkt8BonwM',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 1253360, name: 'Pedro Pascal', character: 'Joel Miller', profile_path: '/1m3w4k5.jpg' },
        { id: 2056070, name: 'Bella Ramsey', character: 'Ellie Williams', profile_path: '/2m3w4k5.jpg' },
        { id: 135756, name: 'Gabriel Luna', character: 'Tommy Miller', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 54271, name: 'Craig Mazin', job: 'Creator', department: 'Writing' },
        { id: 1289566, name: 'Neil Druckmann', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v230', key: 'uLtkt8BonwM', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 144572,
        season_number: 1,
        name: 'Season 1',
        overview: 'Joel and Ellie travel across a devastated post-pandemic United States.',
        poster_path: '/uKvVjHNqB5VmOrdxqAt2V7J78ED.jpg',
        episode_count: 9,
        episodes: [
          {
            id: 2981,
            episode_number: 1,
            season_number: 1,
            name: 'When You\'re Lost in the Darkness',
            overview: 'Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with a mission.',
            air_date: '2023-01-15',
            still_path: '/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
            vote_average: 8.8,
            runtime: 81,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 1396,
    media_type: 'tv',
    name: 'Breaking Bad',
    original_name: 'Breaking Bad',
    tagline: 'Change the equation.',
    overview: 'Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years to live. He chooses to enter the dangerous world of drugs and crime with ex-student Jesse Pinkman.',
    poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    vote_average: 8.9,
    vote_count: 14200,
    first_air_date: '2008-01-20',
    number_of_seasons: 5,
    number_of_episodes: 62,
    episode_run_time: [47],
    status: 'Ended',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
    trailer_key: 'HhesaQXLuRY',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    credits: {
      cast: [
        { id: 17419, name: 'Bryan Cranston', character: 'Walter White', profile_path: '/1m3w4k5.jpg' },
        { id: 84497, name: 'Aaron Paul', character: 'Jesse Pinkman', profile_path: '/2m3w4k5.jpg' },
        { id: 134531, name: 'Anna Gunn', character: 'Skyler White', profile_path: '/3m3w4k5.jpg' },
        { id: 2954, name: 'Giancarlo Esposito', character: 'Gustavo Fring', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 66633, name: 'Vince Gilligan', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v240', key: 'HhesaQXLuRY', name: 'Series Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 3572,
        season_number: 1,
        name: 'Season 1',
        overview: 'High school chemistry teacher Walter White begins manufacturing methamphetamine.',
        poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
        episode_count: 7,
        episodes: [
          {
            id: 62085,
            episode_number: 1,
            season_number: 1,
            name: 'Pilot',
            overview: 'When an unassuming high school chemistry teacher discovers he has terminal lung cancer, he resorts to extreme measures.',
            air_date: '2008-01-20',
            still_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
            vote_average: 8.8,
            runtime: 58,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 136283,
    media_type: 'tv',
    name: 'The Bear',
    original_name: 'The Bear',
    tagline: 'Every second counts.',
    overview: 'A young chef from the fine dining world comes home to Chicago to run his family Italian beef sandwich shop after a heartbreaking death in his family.',
    poster_path: '/x4G7uT4w8w72l3p8y9d0e1f2.jpg',
    backdrop_path: '/4w72l3p8y9d0e1f2a3b4c5.jpg',
    vote_average: 8.4,
    vote_count: 2200,
    first_air_date: '2022-06-23',
    number_of_seasons: 3,
    number_of_episodes: 28,
    episode_run_time: [35],
    status: 'Returning Series',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 35, name: 'Comedy' },
    ],
    trailer_key: 'y-c1a7N1bU0',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 1253361, name: 'Jeremy Allen White', character: 'Carmen "Carmy" Berzatto', profile_path: '/1m3w4k5.jpg' },
        { id: 134532, name: 'Ebon Moss-Bachrach', character: 'Richard "Richie" Jerimovich', profile_path: '/2m3w4k5.jpg' },
        { id: 245678, name: 'Ayo Edebiri', character: 'Sydney Adamu', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 1253362, name: 'Christopher Storer', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v250', key: 'y-c1a7N1bU0', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 94997,
    media_type: 'tv',
    name: 'House of the Dragon',
    original_name: 'House of the Dragon',
    tagline: 'Fire and blood.',
    overview: 'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne.',
    poster_path: '/t9Xke5724fqtpZ1W12x8d.jpg',
    backdrop_path: '/etj8E2o0ej9jNuP9Xs9VfK5q4YF.jpg',
    vote_average: 8.4,
    vote_count: 4800,
    first_air_date: '2022-08-21',
    number_of_seasons: 2,
    number_of_episodes: 18,
    episode_run_time: [60],
    status: 'Returning Series',
    genres: [
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 18, name: 'Drama' },
      { id: 10759, name: 'Action & Adventure' },
    ],
    trailer_key: 'DotnJ7tTA34',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 135757, name: 'Emma D\'Arcy', character: 'Queen Rhaenyra Targaryen', profile_path: '/1m3w4k5.jpg' },
        { id: 1253363, name: 'Matt Smith', character: 'Prince Daemon Targaryen', profile_path: '/2m3w4k5.jpg' },
        { id: 135758, name: 'Olivia Cooke', character: 'Queen Alicent Hightower', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 98124, name: 'Ryan J. Condal', job: 'Creator', department: 'Writing' },
        { id: 98125, name: 'George R.R. Martin', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v260', key: 'DotnJ7tTA34', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 106379,
    media_type: 'tv',
    name: 'Fallout',
    original_name: 'Fallout',
    tagline: 'The end was just the beginning.',
    overview: 'The story of haves and have-nots in a world in which there’s almost nothing left to have. 200 years after the apocalypse, the gentle denizens of luxury fallout shelters are forced to return to the irradiated hellscape their ancestors left behind.',
    poster_path: '/AnsSKR9LuK0T9bKoCq9.jpg',
    backdrop_path: '/5q8B3qN7pL4e7yX.jpg',
    vote_average: 8.3,
    vote_count: 2100,
    first_air_date: '2024-04-10',
    number_of_seasons: 2,
    number_of_episodes: 16,
    episode_run_time: [55],
    status: 'Returning Series',
    genres: [
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 10759, name: 'Action & Adventure' },
    ],
    trailer_key: 'V-mugKDQDlg',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    credits: {
      cast: [
        { id: 1106516, name: 'Ella Purnell', character: 'Lucy MacLean', profile_path: '/1m3w4k5.jpg' },
        { id: 11959, name: 'Walton Goggins', character: 'The Ghoul / Cooper Howard', profile_path: '/2m3w4k5.jpg' },
        { id: 142105, name: 'Aaron Moten', character: 'Maximus', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 15277, name: 'Jonathan Nolan', job: 'Creator & Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v270', key: 'V-mugKDQDlg', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
  },
  {
    id: 223313,
    media_type: 'tv',
    name: 'Obsession',
    original_name: 'Obsession',
    tagline: 'Obsession comes at a cost.',
    overview: 'A respected London surgeon\'s affair with his son\'s fiancée turns into an erotic infatuation that threatens to change their lives forever.',
    poster_path: '/8nQmxCYvidrCMxYCPdhuls94cl9.jpg',
    backdrop_path: '/dpaaxgmIe0cCId6CVIAOfNqkYm4.jpg',
    vote_average: 6.5,
    vote_count: 512,
    first_air_date: '2023-04-13',
    number_of_seasons: 1,
    number_of_episodes: 4,
    episode_run_time: [45],
    status: 'Ended',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 9648, name: 'Mystery' },
    ],
    trailer_key: 'QparPBLUeEI',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 25424, name: 'Richard Armitage', character: 'William Farrow', profile_path: '/1m3w4k5.jpg' },
        { id: 123456, name: 'Charlie Murphy', character: 'Anna Barton', profile_path: '/2m3w4k5.jpg' },
        { id: 45678, name: 'Indira Varma', character: 'Ingrid Farrow', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 99112, name: 'Glenn Leyburn', job: 'Director', department: 'Directing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_obs1', key: 'QparPBLUeEI', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 334559,
        season_number: 1,
        name: 'Limited Series',
        overview: 'A respected London surgeon embarks on an affair with his son\'s fiancée, putting his career and family on the line.',
        poster_path: '/8nQmxCYvidrCMxYCPdhuls94cl9.jpg',
        episode_count: 4,
        episodes: [
          {
            id: 1001,
            episode_number: 1,
            season_number: 1,
            name: 'Episode 1',
            overview: 'At a political gala, high-flying surgeon William meets his son Martyn\'s enigmatic fiancée Anna, triggering an immediate and dangerous attraction.',
            air_date: '2023-04-13',
            still_path: '/dpaaxgmIe0cCId6CVIAOfNqkYm4.jpg',
            vote_average: 6.8,
            runtime: 42,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            id: 1002,
            episode_number: 2,
            season_number: 1,
            name: 'Episode 2',
            overview: 'William and Anna establish secretive ground rules for their illicit encounters in Paris.',
            air_date: '2023-04-13',
            still_path: '/dpaaxgmIe0cCId6CVIAOfNqkYm4.jpg',
            vote_average: 6.6,
            runtime: 38,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 66732,
    media_type: 'tv',
    name: 'Stranger Things',
    original_name: 'Stranger Things',
    tagline: 'It only gets stranger...',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    poster_path: '/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
    backdrop_path: '/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    vote_average: 8.6,
    vote_count: 17400,
    first_air_date: '2016-07-15',
    number_of_seasons: 4,
    number_of_episodes: 34,
    episode_run_time: [50],
    status: 'Returning Series',
    genres: [
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 9648, name: 'Mystery' },
      { id: 18, name: 'Drama' },
    ],
    trailer_key: 'b9EkMc79ZSU',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 135651, name: 'Millie Bobby Brown', character: 'Eleven', profile_path: '/1m3w4k5.jpg' },
        { id: 1253361, name: 'Finn Wolfhard', character: 'Mike Wheeler', profile_path: '/2m3w4k5.jpg' },
        { id: 135652, name: 'Winona Ryder', character: 'Joyce Byers', profile_path: '/3m3w4k5.jpg' },
        { id: 35316, name: 'David Harbour', character: 'Jim Hopper', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 1253362, name: 'The Duffer Brothers', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_st1', key: 'b9EkMc79ZSU', name: 'Official Final Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 77680,
        season_number: 1,
        name: 'Season 1',
        overview: 'A young boy vanishes into thin air, and a mysterious girl with telekinetic powers arrives in Hawkins.',
        poster_path: '/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
        episode_count: 8,
        episodes: [
          {
            id: 2001,
            episode_number: 1,
            season_number: 1,
            name: 'Chapter One: The Vanishing of Will Byers',
            overview: 'On his way home from a friend\'s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.',
            air_date: '2016-07-15',
            still_path: '/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
            vote_average: 8.8,
            runtime: 49,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
          {
            id: 2002,
            episode_number: 2,
            season_number: 1,
            name: 'Chapter Two: The Weirdo on Maple Street',
            overview: 'Lucas, Mike, and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about a bizarre phone call.',
            air_date: '2016-07-15',
            still_path: '/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
            vote_average: 8.7,
            runtime: 56,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 124364,
    media_type: 'tv',
    name: 'FROM',
    original_name: 'FROM',
    tagline: 'The question is not where. It is why.',
    overview: 'Unravel the mystery of a nightmarish town in middle America that traps all those who enter. As the unwilling residents fight to keep a sense of normalcy and search for a way out, they must also survive the threats of the surrounding forest – including the terrifying creatures that come out when the sun goes down.',
    poster_path: '/pRtJagIxpfODzzb0T0NAvZSzErC.jpg',
    backdrop_path: '/m7eiSGHFzr584zFmetGqkqaU6BN.jpg',
    vote_average: 8.5,
    vote_count: 1650,
    first_air_date: '2022-02-20',
    number_of_seasons: 3,
    number_of_episodes: 30,
    episode_run_time: [52],
    status: 'Returning Series',
    genres: [
      { id: 9648, name: 'Mystery' },
      { id: 18, name: 'Drama' },
      { id: 10765, name: 'Sci-Fi & Fantasy' },
    ],
    trailer_key: 'qHItJdOsslw',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 12436, name: 'Harold Perrineau', character: 'Boyd Stevens', profile_path: '/1m3w4k5.jpg' },
        { id: 12437, name: 'Catalina Sandino Moreno', character: 'Tabitha Matthews', profile_path: '/2m3w4k5.jpg' },
        { id: 12438, name: 'Eion Bailey', character: 'Jim Matthews', profile_path: '/3m3w4k5.jpg' },
      ],
      crew: [
        { id: 12439, name: 'John Griffin', job: 'Creator', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_from1', key: 'qHItJdOsslw', name: 'Series Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 192632,
        season_number: 1,
        name: 'Season 1',
        overview: 'The Matthews family encounters a fallen tree in the road, trapping them in a bizarre, inescapable town plagued by nocturnal terrors.',
        poster_path: '/pRtJagIxpfODzzb0T0NAvZSzErC.jpg',
        episode_count: 10,
        episodes: [
          {
            id: 3001,
            episode_number: 1,
            season_number: 1,
            name: 'Long Day\'s Journey Into Night',
            overview: 'The Matthews family is trapped in a mysterious town whose residents must barricade their homes before nightfall.',
            air_date: '2022-02-20',
            still_path: '/m7eiSGHFzr584zFmetGqkqaU6BN.jpg',
            vote_average: 8.6,
            runtime: 53,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 70523,
    media_type: 'tv',
    name: 'Dark',
    original_name: 'Dark',
    tagline: 'Everything is connected.',
    overview: 'A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.',
    poster_path: '/wSXJHO9WHLb0aCwvQrtco7vOmWA.jpg',
    backdrop_path: '/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg',
    vote_average: 8.5,
    vote_count: 7200,
    first_air_date: '2017-12-01',
    number_of_seasons: 3,
    number_of_episodes: 26,
    episode_run_time: [60],
    status: 'Ended',
    genres: [
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 9648, name: 'Mystery' },
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
    trailer_key: 'rrwycJ08PSA',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    credits: {
      cast: [
        { id: 70524, name: 'Louis Hofmann', character: 'Jonas Kahnwald', profile_path: '/1m3w4k5.jpg' },
        { id: 70525, name: 'Oliver Masucci', character: 'Ulrich Nielsen', profile_path: '/2m3w4k5.jpg' },
        { id: 70526, name: 'Jördis Triebel', character: 'Katharina Nielsen', profile_path: '/3m3w4k5.jpg' },
        { id: 70527, name: 'Maja Schöne', character: 'Hannah Kahnwald', profile_path: '/4m3w4k5.jpg' },
      ],
      crew: [
        { id: 70528, name: 'Baran bo Odar', job: 'Creator & Director', department: 'Directing' },
        { id: 70529, name: 'Jantje Friese', job: 'Creator & Writer', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_dark1', key: 'rrwycJ08PSA', name: 'Official Trailer', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 85712,
        season_number: 1,
        name: 'Season 1',
        overview: 'In 2019, a local boy\'s disappearance stokes fear in the residents of Winden, a small German town with a tragic history.',
        poster_path: '/wSXJHO9WHLb0aCwvQrtco7vOmWA.jpg',
        episode_count: 10,
        episodes: [
          {
            id: 4001,
            episode_number: 1,
            season_number: 1,
            name: 'Secrets',
            overview: 'In 2019, a local boy\'s disappearance stokes fear in the residents of Winden, a small German town with a tragic and perplexing history.',
            air_date: '2017-12-01',
            still_path: '/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg',
            vote_average: 8.7,
            runtime: 51,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 285838,
    media_type: 'tv',
    name: 'If Wishes Could Kill',
    original_name: '기리고',
    tagline: 'Got a wish worth dying for?',
    overview:
      'A mysterious app promises wishes — then starts a deadly countdown to death. As a group of high school friends becomes entangled, they must uncover the app’s sinister origins and break the deadly chain to survive.',
    poster_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg',
    backdrop_path: '/5BzfcAW5ZI2m7QypeJBbYNjBuR0.jpg',
    vote_average: 8.6,
    vote_count: 3410,
    first_air_date: '2026-04-24',
    number_of_seasons: 1,
    number_of_episodes: 8,
    episode_run_time: [50],
    status: 'Returning Series',
    genres: [
      { id: 9648, name: 'Mystery' },
      { id: 18, name: 'Drama' },
      { id: 10765, name: 'Sci-Fi & Fantasy' },
    ],
    trailer_key: 'OJsERPNI3D0',
    legitimate_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    credits: {
      cast: [
        { id: 285801, name: 'Jeon So-young', character: 'Yoo Se-ah', profile_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg' },
        { id: 285802, name: 'Baek Sun-ho', character: 'Kim Gun-woo', profile_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg' },
        { id: 285803, name: 'Kang Mi-na', character: 'Im Na-ri', profile_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg' },
        { id: 285804, name: 'Hyun Woo-seok', character: 'Kang Ha-joon', profile_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg' },
        { id: 285805, name: 'Lee Hyo-je', character: 'Choi Hyeong-wook', profile_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg' },
      ],
      crew: [
        { id: 285810, name: 'Park Youn-seo', job: 'Director', department: 'Directing' },
        { id: 285811, name: 'Park Joong-seop', job: 'Screenplay', department: 'Writing' },
      ],
    },
    videos: {
      results: [
        { id: 'v_iwck1', key: 'OJsERPNI3D0', name: 'Official Trailer [ENG SUB]', site: 'YouTube', size: 1080, type: 'Trailer', official: true },
      ],
    },
    seasons: [
      {
        id: 285820,
        season_number: 1,
        name: 'Season 1',
        overview:
          'Five high school friends discover Girigo, a wish-granting app that starts a 24-hour death countdown for every wish granted.',
        poster_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg',
        episode_count: 8,
        episodes: [
          {
            id: 285821,
            episode_number: 1,
            season_number: 1,
            name: 'The App Named Girigo',
            overview:
              'A strange application installs itself on Yoo Se-ah’s phone, offering the fulfillment of any desire at an unthinkable cost.',
            air_date: '2026-04-24',
            still_path: '/erDGFY3r8vvF6H7JhjyfpLfHRIU.jpg',
            vote_average: 8.6,
            runtime: 50,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
          {
            id: 285822,
            episode_number: 2,
            season_number: 1,
            name: '24 Hours to Live',
            overview:
              'When the first consequence strikes, the group scrambles to understand the rules of the deadly countdown.',
            air_date: '2026-04-24',
            still_path: '/wJBaYdqgVRSKz72EasSJUGK5pYo.jpg',
            vote_average: 8.5,
            runtime: 52,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        ],
      },
    ],
  },
];

// The 5 Hero Spotlight items explicitly requested by user:
// 1. Breaking Bad
// 2. 2026 Obsession
// 3. Stranger Things
// 4. If Wishes Could Kill
// 5. Dark
export const HERO_SPOTLIGHT_ITEMS: MediaItem[] = [
  {
    id: 1396,
    media_type: 'tv',
    title: 'Breaking Bad',
    name: 'Breaking Bad',
    original_name: 'Breaking Bad',
    tagline: 'Change the equation.',
    overview:
      'Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years to live. He chooses to enter the dangerous world of drugs and crime with ex-student Jesse Pinkman to secure his family’s financial future.',
    poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    vote_average: 8.9,
    vote_count: 18835,
    first_air_date: '2008-01-20',
    genre_ids: [18, 80],
    trailer_key: 'HhesaQXLuRY',
  },
  {
    id: 1339713,
    media_type: 'movie',
    title: 'Obsession',
    name: 'Obsession',
    original_title: 'Obsession',
    tagline: 'Be careful who you wish for…',
    overview:
      'After breaking the mysterious "One Wish Willow" to win his crush\'s heart, a hopeless romantic finds himself getting exactly what he asked for but soon discovers that some desires come at a dark, sinister price.',
    poster_path: '/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg',
    backdrop_path: '/5lTZyuBTNOfawsfPT8Q0cIg6qAF.jpg',
    vote_average: 8.2,
    vote_count: 6100,
    release_date: '2026-05-13',
    genre_ids: [27, 53],
    trailer_key: 'gMC8kkwbIQQ',
  },
  {
    id: 66732,
    media_type: 'tv',
    title: 'Stranger Things',
    name: 'Stranger Things',
    original_name: 'Stranger Things',
    tagline: 'It only gets stranger...',
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    poster_path: '/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
    backdrop_path: '/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    vote_average: 8.6,
    vote_count: 17400,
    first_air_date: '2016-07-15',
    genre_ids: [10765, 9648, 18],
    trailer_key: 'b9EkMc79ZSU',
  },
  {
    id: 285838,
    media_type: 'tv',
    title: 'If Wishes Could Kill',
    name: 'If Wishes Could Kill',
    original_name: '기리고',
    tagline: 'Got a wish worth dying for?',
    overview:
      'A mysterious app promises wishes — then starts a deadly countdown to death. As a group of high school friends becomes entangled, they must uncover the app’s sinister origins and break the deadly chain to survive.',
    poster_path: '/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg',
    backdrop_path: '/5BzfcAW5ZI2m7QypeJBbYNjBuR0.jpg',
    vote_average: 8.6,
    vote_count: 3410,
    first_air_date: '2026-04-24',
    genre_ids: [9648, 18, 10765],
    trailer_key: 'OJsERPNI3D0',
  },
  {
    id: 70523,
    media_type: 'tv',
    title: 'Dark',
    name: 'Dark',
    original_name: 'Dark',
    tagline: 'Everything is connected.',
    overview:
      'A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.',
    poster_path: '/wSXJHO9WHLb0aCwvQrtco7vOmWA.jpg',
    backdrop_path: '/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg',
    vote_average: 8.5,
    vote_count: 7200,
    first_air_date: '2017-12-01',
    genre_ids: [10765, 9648, 18, 80],
    trailer_key: 'rrwycJ08PSA',
  },
];

// Helper to find any media item by ID and media_type
export function findCuratedItem(id: number | string, type?: string): MediaDetails | undefined {
  const numId = Number(id);
  const all = [...CURATED_MOVIES, ...CURATED_TV];
  if (type) {
    return all.find((item) => item.id === numId && item.media_type === type);
  }
  return all.find((item) => item.id === numId);
}

// Helpers for grouped rows
export const ALL_CURATED_MEDIA: MediaItem[] = [...CURATED_MOVIES, ...CURATED_TV];

export const TRENDING_MOVIES: MediaItem[] = [
  CURATED_MOVIES[0], // Dune 2
  CURATED_MOVIES[1], // Oppenheimer
  CURATED_MOVIES[3], // Spider-Verse
  CURATED_MOVIES[8], // Civil War
  CURATED_MOVIES[4], // Blade Runner 2049
  CURATED_MOVIES[9], // The Batman
];

export const POPULAR_MOVIES: MediaItem[] = [
  CURATED_MOVIES[5], // Inception
  CURATED_MOVIES[6], // The Dark Knight
  CURATED_MOVIES[2], // Interstellar
  CURATED_MOVIES[7], // Everything Everywhere
  CURATED_MOVIES[0], // Dune 2
  CURATED_MOVIES[10], // Spirited Away
];

export const TOP_RATED_MOVIES: MediaItem[] = [
  CURATED_MOVIES[11], // Shawshank
  CURATED_MOVIES[6], // Dark Knight
  CURATED_MOVIES[10], // Spirited Away
  CURATED_MOVIES[2], // Interstellar
  CURATED_MOVIES[5], // Inception
  CURATED_MOVIES[3], // Spider-Verse
];

export const NOW_PLAYING_MOVIES: MediaItem[] = [
  CURATED_MOVIES[0], // Dune 2
  CURATED_MOVIES[8], // Civil War
  CURATED_MOVIES[1], // Oppenheimer
  CURATED_MOVIES[3], // Spider-Verse
];

export const UPCOMING_MOVIES: MediaItem[] = [
  CURATED_MOVIES[4], // Blade Runner 2049
  CURATED_MOVIES[9], // The Batman
  CURATED_MOVIES[7], // Everything Everywhere
];

export const POPULAR_TV: MediaItem[] = [
  CURATED_TV[0], // Shogun
  CURATED_TV[1], // Severance
  CURATED_TV[2], // Arcane
  CURATED_TV[3], // The Last of Us
  CURATED_TV[4], // Breaking Bad
  CURATED_TV[5], // The Bear
  CURATED_TV[6], // House of the Dragon
  CURATED_TV[7], // Fallout
];

export const AIRING_TODAY_TV: MediaItem[] = [
  CURATED_TV[0], // Shogun
  CURATED_TV[5], // The Bear
  CURATED_TV[7], // Fallout
];

export const ON_THE_AIR_TV: MediaItem[] = [
  CURATED_TV[1], // Severance
  CURATED_TV[6], // House of the Dragon
  CURATED_TV[3], // The Last of Us
];

export const CRITICALLY_ACCLAIMED: MediaItem[] = [
  CURATED_MOVIES[11], // Shawshank
  CURATED_TV[4], // Breaking Bad
  CURATED_TV[2], // Arcane
  CURATED_MOVIES[6], // Dark Knight
  CURATED_TV[0], // Shogun
  CURATED_MOVIES[1], // Oppenheimer
];

export const ACTION_COLLECTION: MediaItem[] = [
  CURATED_MOVIES[6],
  CURATED_MOVIES[5],
  CURATED_MOVIES[8],
  CURATED_MOVIES[9],
  CURATED_TV[2],
  CURATED_TV[7],
];

export const COMEDY_COLLECTION: MediaItem[] = [
  CURATED_TV[5], // The Bear
  CURATED_MOVIES[7], // Everything Everywhere
  CURATED_MOVIES[3], // Spider-Verse
];

export const THRILLER_COLLECTION: MediaItem[] = [
  CURATED_MOVIES[9], // The Batman
  CURATED_MOVIES[6], // Dark Knight
  CURATED_TV[1], // Severance
  CURATED_MOVIES[11], // Shawshank
  CURATED_TV[4], // Breaking Bad
];

export const SCIFI_COLLECTION: MediaItem[] = [
  CURATED_MOVIES[0], // Dune 2
  CURATED_MOVIES[2], // Interstellar
  CURATED_MOVIES[4], // Blade Runner
  CURATED_TV[1], // Severance
  CURATED_TV[7], // Fallout
  CURATED_MOVIES[3], // Spider-Verse
];

export const ANIMATION_COLLECTION: MediaItem[] = [
  CURATED_MOVIES[3], // Spider-Verse
  CURATED_TV[2], // Arcane
  CURATED_MOVIES[10], // Spirited Away
];
