'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });

      if(room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button 
      type="submit" 
      onClick={addDocumentHandler} 
      className="gradient-blue flex items-center gap-2 px-6 py-6 rounded-2xl text-sm font-bold shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all active:scale-95"
    >
      <Image 
        src="/assets/icons/add.svg" alt="add" width={20} height={20}
      />
      <p className="hidden sm:block">Start Creating</p>
    </Button>
  )
}

export default AddDocumentBtn