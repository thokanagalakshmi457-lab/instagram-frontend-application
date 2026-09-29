const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const currentUser = {
  username: 'marin',
  name: 'Marin Ellis',
  avatar: photo('photo-1534528741775-53994a69daeb', 160),
  bio: 'Collecting little moments and long weekends.\nBased in Copenhagen.',
  website: 'marinellis.studio',
}

export const users = [
  currentUser,
  { username: 'amelia', name: 'Amelia Hart', avatar: photo('photo-1531123897727-8f129e1688ce', 160), verified: true, bio: 'Light chaser · Copenhagen' },
  { username: 'noah', name: 'Noah Kim', avatar: photo('photo-1500648767791-00dcc994a43e', 160), bio: 'Finding new corners of the world.' },
  { username: 'sofia', name: 'Sofia Laurent', avatar: photo('photo-1524504388940-b1c1722653e1', 160), verified: true, bio: 'Stylist, maker, and slow-living enthusiast.' },
  { username: 'leo', name: 'Leo Bennett', avatar: photo('photo-1506794778202-cad84cf45f1d', 160), bio: 'Mostly outside.' },
  { username: 'aya', name: 'Aya Nakamura', avatar: photo('photo-1534528741775-53994a69daeb', 160), bio: 'Tokyo to everywhere.' },
  { username: 'elliot', name: 'Elliot Park', avatar: photo('photo-1507003211169-0a1dd7228f2d', 160), bio: 'Designing things for the everyday.' },
  { username: 'ines', name: 'Ines Costa', avatar: photo('photo-1529139574466-a303027c1d8b', 160), bio: 'Lisbon, film, and good bread.' },
  { username: 'ravi', name: 'Ravi Shah', avatar: photo('photo-1519085360753-af0119f7cbe7', 160), bio: 'A camera in every bag.' },
  { username: 'clara', name: 'Clara Olsen', avatar: photo('photo-1544005313-94ddf0286df2', 160), bio: 'On the coast when I can be.' },
  { username: 'jules', name: 'Jules Miller', avatar: photo('photo-1508214751196-bcfd4ca60f91', 160), bio: 'Food, friends, repeat.' },
]

const postSources = [
  ['photo-1470252649378-9c29740c9fa8', 'amelia', 'The first light always feels like a little secret.', 'Copenhagen, Denmark', 2841, ['morninglight', 'slowdays']],
  ['photo-1501785888041-af3ef285b470', 'noah', 'Took the long way around. Would do it again.', 'Dolomites, Italy', 1632, ['outsideeveryday', 'italy']],
  ['photo-1518837695005-2083093ee35b', 'sofia', 'Salt in my hair, nowhere to be.', 'Comporta, Portugal', 945, ['seasondonewell']],
  ['photo-1493246507139-91e8fad9978e', 'leo', 'A cabin, a book, and exactly zero plans.', 'British Columbia', 3217, ['weekendnotes']],
  ['photo-1523906834658-6e24ef2386f9', 'aya', 'A little blue hour wandering.', 'Venice, Italy', 1204, ['cityslow']],
  ['photo-1470770841072-f978cf4d019e', 'elliot', 'Somewhere between here and the next stop.', 'Lake Bled, Slovenia', 876, ['ontheroad']],
  ['photo-1519681393784-d120267933ba', 'ines', 'The mountains put everything back in perspective.', 'Swiss Alps', 2532, ['takeahike']],
  ['photo-1500530855697-b586d89ba3ee', 'ravi', 'A view worth missing the train for.', 'Madeira, Portugal', 491, ['islandlife']],
  ['photo-1519608487953-e999c86e7455', 'clara', 'The sky did all the work tonight.', 'Skagen, Denmark', 1877, ['goldenhour']],
  ['photo-1490730141103-6cac27aaab94', 'jules', 'Sunday, in no particular order.', 'Paris, France', 2188, ['littlethings']],
  ['photo-1500534623283-312aade485b7', 'amelia', 'Out of office, very much in spirit.', 'Mallorca, Spain', 3402, ['islandnotes']],
  ['photo-1500534314209-a25ddb2bd429', 'noah', 'One more turn before heading back.', 'Joshua Tree, USA', 762, ['desertdays']],
  ['photo-1441974231531-c6227db76b6e', 'sofia', 'A green kind of afternoon.', 'Sintra, Portugal', 1103, ['forestwalk']],
  ['photo-1500530855697-b586d89ba3ee', 'leo', 'Staying until the last color fades.', 'Lofoten, Norway', 1954, ['northbound']],
  ['photo-1500534623283-312aade485b7', 'aya', 'Soft mornings, strong coffee.', 'Kyoto, Japan', 680, ['daybook']],
]

export const posts = postSources.map(([image, username, caption, location, likes, tags], index) => ({
  id: `post-${index + 1}`,
  username,
  image: photo(image),
  caption,
  location,
  likes,
  comments: 14 + index * 7,
  timestamp: `${index + 1}h`,
  tags,
}))

export const stories = users.slice(1, 10).map((user, index) => ({
  ...user,
  id: `story-${index + 1}`,
  image: posts[index].image,
  viewed: index === 3 || index === 7,
}))

export const reels = [
  { id: 'reel-1', username: 'ines', image: photo('photo-1518837695005-2083093ee35b', 800), caption: 'The tide has its own timing.', audio: 'Original audio · ines.costa', likes: 12804, comments: 224 },
  { id: 'reel-2', username: 'ravi', image: photo('photo-1470770841072-f978cf4d019e', 800), caption: 'A few seconds from the trail.', audio: 'Soft focus · Kairo', likes: 8902, comments: 108 },
  { id: 'reel-3', username: 'clara', image: photo('photo-1519608487953-e999c86e7455', 800), caption: 'Waiting for the sky to turn.', audio: 'Original audio · clara.olson', likes: 14621, comments: 317 },
  { id: 'reel-4', username: 'noah', image: photo('photo-1501785888041-af3ef285b470', 800), caption: 'POV: you took the scenic route.', audio: 'Somewhere · Juno Lane', likes: 5530, comments: 89 },
  { id: 'reel-5', username: 'aya', image: photo('photo-1523906834658-6e24ef2386f9', 800), caption: 'A city that knows how to pause.', audio: 'Morning walk · aya.n', likes: 9021, comments: 193 },
  { id: 'reel-6', username: 'leo', image: photo('photo-1493246507139-91e8fad9978e', 800), caption: 'Three days with no signal.', audio: 'Original audio · leo.b', likes: 7500, comments: 126 },
  { id: 'reel-7', username: 'amelia', image: photo('photo-1470252649378-9c29740c9fa8', 800), caption: 'Before anyone else is awake.', audio: 'Golden · Elowen', likes: 18902, comments: 480 },
  { id: 'reel-8', username: 'jules', image: photo('photo-1490730141103-6cac27aaab94', 800), caption: 'The recipe is mostly patience.', audio: 'Kitchen radio · Jules', likes: 3990, comments: 77 },
]

export const conversations = users.slice(1, 7).map((user, index) => ({
  ...user,
  id: `conversation-${index + 1}`,
  lastMessage: ['Sent you the little map!', 'That light is unreal', 'Saturday works for me', 'You have to try this place', 'Just got back yesterday', 'I saved you a seat'][index],
  time: ['2m', '18m', '1h', '3h', '1d', '2d'][index],
  unread: index === 0 || index === 2,
  messages: [
    { id: `message-${index}-1`, sender: user.username, text: ['Hey! How have you been?', 'I loved your last post.', 'Are you free this weekend?'][index % 3], time: '10:42' },
    { id: `message-${index}-2`, sender: 'marin', text: ['Really good, just got back from the coast.', 'Thank you! It was such a lovely day.', 'I think so, what did you have in mind?'][index % 3], time: '10:45' },
    { id: `message-${index}-3`, sender: user.username, text: ['Sent you the little map!', 'That light is unreal', 'Saturday works for me'][index % 3], time: '10:47' },
  ],
}))

export const notifications = [
  { id: 'notification-1', type: 'Likes', username: 'amelia', text: 'and 24 others liked your photo.', time: '12m', post: posts[0].image },
  { id: 'notification-2', type: 'Follows', username: 'ravi', text: 'started following you.', time: '1h', follow: true },
  { id: 'notification-3', type: 'Comments', username: 'sofia', text: '“this feels like a deep breath”', time: '3h', post: posts[2].image },
  { id: 'notification-4', type: 'Mentions', username: 'ines', text: 'mentioned you in a comment.', time: '5h', post: posts[6].image },
  { id: 'notification-5', type: 'Likes', username: 'noah', text: 'liked your photo.', time: '1d', post: posts[1].image },
  { id: 'notification-6', type: 'Follows', username: 'clara', text: 'started following you.', time: '1d', follow: true },
  { id: 'notification-7', type: 'Comments', username: 'leo', text: '“adding this to the list”', time: '2d', post: posts[3].image },
  { id: 'notification-8', type: 'Mentions', username: 'aya', text: 'mentioned you in a story.', time: '3d', post: posts[4].image },
]