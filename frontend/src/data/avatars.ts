export interface AvatarInfo {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
}

export const AVATARS: AvatarInfo[] = [
  { id: 'avatar-1', name: 'Lightning Fox', emoji: '🦊', bgGradient: 'from-amber-500 to-orange-600', borderColor: 'border-orange-400' },
  { id: 'avatar-2', name: 'Cosmic Cat', emoji: '🐱', bgGradient: 'from-purple-500 to-indigo-600', borderColor: 'border-purple-400' },
  { id: 'avatar-3', name: 'Cyber Panda', emoji: '🐼', bgGradient: 'from-emerald-500 to-teal-700', borderColor: 'border-emerald-400' },
  { id: 'avatar-4', name: 'Pixel Lion', emoji: '🦁', bgGradient: 'from-yellow-400 to-amber-600', borderColor: 'border-yellow-400' },
  { id: 'avatar-5', name: 'Magic Unicorn', emoji: '🦄', bgGradient: 'from-pink-500 to-rose-600', borderColor: 'border-pink-400' },
  { id: 'avatar-6', name: 'Astro Alien', emoji: '👽', bgGradient: 'from-cyan-400 to-blue-600', borderColor: 'border-cyan-300' },
  { id: 'avatar-7', name: 'Ninja Tiger', emoji: '🐯', bgGradient: 'from-red-500 to-orange-600', borderColor: 'border-red-400' },
  { id: 'avatar-8', name: 'Captain Bear', emoji: '🐻', bgGradient: 'from-amber-700 to-orange-900', borderColor: 'border-amber-600' },
  { id: 'avatar-9', name: 'Robo Brain', emoji: '🤖', bgGradient: 'from-slate-400 to-slate-700', borderColor: 'border-slate-300' },
  { id: 'avatar-10', name: 'Fire Dragon', emoji: '🐲', bgGradient: 'from-rose-600 to-red-800', borderColor: 'border-red-500' },
  { id: 'avatar-11', name: 'Party Monkey', emoji: '🐵', bgGradient: 'from-lime-500 to-emerald-600', borderColor: 'border-lime-400' },
  { id: 'avatar-12', name: 'Chill Penguin', emoji: '🐧', bgGradient: 'from-sky-400 to-indigo-600', borderColor: 'border-sky-300' },
  { id: 'avatar-crown', name: 'Master 11', emoji: '👑', bgGradient: 'from-amber-400 to-yellow-500', borderColor: 'border-yellow-300' },
];

export function getAvatarById(id: string): AvatarInfo {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
