import { useOthers } from '@liveblocks/react/suspense'
import Image from 'next/image';

const ActiveCollaborators = () => {
  const others = useOthers();

  const collaborators = others.map((other) => other.info);

  return (
    <ul className="flex items-center -space-x-3 overflow-hidden">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id} className="relative group">
          <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: color }} />
          {avatar && !avatar.includes('user.svg') ? (
            <Image 
              src={avatar}
              alt={name}
              width={32}
              height={32}
              className='relative z-10 size-8 rounded-full border-2 border-black/50 ring-2 ring-[#020408] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1'
              style={{ borderColor: color }}
            />
          ) : (
            <div 
              className="relative z-10 flex size-8 items-center justify-center rounded-full bg-dark-500 text-[10px] font-black uppercase text-white border-2 border-black/50 ring-2 ring-[#020408] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
              style={{ borderColor: color }}
            >
              {name.charAt(0)}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ActiveCollaborators