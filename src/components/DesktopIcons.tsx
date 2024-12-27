import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopIcon } from '@/components/shared/DesktopIcon';
import { TrashDialog } from '@/components/trash/TrashDialog';
import { ChatDialog } from '@/components/chat/ChatDialog';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Entity {
  id: string;
  name: string;
}

interface DesktopIconsProps {
  show: boolean;
}

export const DesktopIcons: FC<DesktopIconsProps> = ({ show }) => {
  const [isTrashDialogOpen, setIsTrashDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntities = async () => {
      const { data } = await supabase
        .from('entities')
        .select('id, name')
        .order('created_at', { ascending: false });
      
      if (data) {
        setEntities(data);
      }
    };

    fetchEntities();

    const subscription = supabase
      .channel('public:entities')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'entities' 
      }, fetchEntities)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const icons = [
    {
      src: 'https://imgur.com/gtr9zZ6.jpg',
      label: 'Trash Bin',
      onClick: () => setIsTrashDialogOpen(true)
    },
    {
      src: 'https://imgur.com/DxVLlbK.jpg',
      label: 'X',
      href: 'https://x.com/amarascc'
    },
    {
      src: 'https://imgur.com/Nuyc9zI.jpg',
      label: 'Telegram',
      href: 'https://t.me/MorvakEntity'
    },
    {
      src: 'https://imgur.com/nyy0JzP.jpg',
      label: 'Docs',
      href: 'https://morvak.gitbook.io/morvak-ai'
    },
    {
      src: 'https://imgur.com/sJOMIIb.jpg',
      label: 'Hello',
      onClick: () => setIsChatDialogOpen(true)
    },
    ...entities.map(entity => ({
      src: 'https://imgur.com/WhxEDvs.jpg',
      label: entity.name,
      onClick: () => navigate(`/entity/${entity.id}`)
    }))
  ];

  return (
    <>
      <div className={cn(
        "fixed left-8 top-8 z-50 transition-opacity duration-500",
        "overflow-y-auto pr-4",
        "desktop-icons-grid scrollbar-custom",
        show ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="space-y-4 min-h-full">
          {icons.map((icon, index) => (
            <DesktopIcon
              key={`${icon.label}-${index}`}
              {...icon}
            />
          ))}
        </div>
      </div>
      <TrashDialog
        open={isTrashDialogOpen}
        onOpenChange={setIsTrashDialogOpen}
      />
      <ChatDialog
        open={isChatDialogOpen}
        onOpenChange={setIsChatDialogOpen}
      />
    </>
  );
};