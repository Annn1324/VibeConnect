import homeIcon from '../../assets/home-icon.png';
import exploreIcon from '../../assets/explore-icon.png';
import messagesIcon from '../../assets/messages-icon.png';
import notificationsIcon from '../../assets/notifications-icon.png';
import profileIcon from '../../assets/profile-icon.png';

export const navItems = [
  { label: 'Home', active: true, icon: homeIcon },
  { label: 'Explore', active: false, icon: exploreIcon },
  { label: 'Messages', active: false, icon: messagesIcon },
  { label: 'Notifications', active: false, icon: notificationsIcon },
  { label: 'Profile', active: false, icon: profileIcon },
];

export const sampleTrends = [
  { category: 'ARCHITECTURE', tag: '#CyberBrutalism2024', meta: '12.4k vibes this hour' },
  { category: 'WELLNESS', tag: '#MindfulKinetic', meta: '8.2k vibes this hour' },
];

export const sampleMatches = [
  { name: 'Demo Profile 01', meta: 'Shared interest preview', initial: 'D' },
  { name: 'Demo Profile 02', meta: 'Suggested connection preview', initial: 'D' },
];

export const samplePosts = [
  {
    author: 'Demo Creator 01',
    role: 'Sample role',
    time: '2h ago',
    text:
      'Exploring the intersection of kinetic light and brutalist architecture in the heart of the city. The pulse here is unmatched tonight.',
    image: true,
    badges: ['Media', 'Vibe'],
    stats: { pulses: '842', likes: '24', comments: '12' },
  },
  {
    author: 'Demo Creator 02',
    role: 'Sample role',
    time: '5h ago',
    text:
      "Connectivity isn't about the technology we use, it's about the energy we transfer.",
    image: false,
    badges: ['Insight', 'Philosophy'],
    stats: { pulses: '318', likes: '11', comments: '4' },
  },
];
