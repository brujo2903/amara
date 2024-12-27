import { type FC, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DesktopIcon } from '@/components/shared/DesktopIcon';
import { ChatDialog } from '@/components/chat/ChatDialog';
import { ComingSoonOverlay } from '@/components/web/ComingSoonOverlay';
import { cn } from '@/lib/utils';
import { useFeatureChat } from '@/hooks/use-feature-chat';
import type { WebApp } from '@/types/webapp';

interface Entity {
  id: string;
  name: string;
}

interface WebAppIcon {
  id: string;
  name: string;
  type: 'webapp';
}

interface EntityIcon {
  id: string;
  name: string;
  type: 'entity';
}

type AppIcon = WebAppIcon | EntityIcon;

interface DesktopIconsProps {
  show: boolean;
}

export const DesktopIcons: FC<DesktopIconsProps> = ({ show }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [webApps, setWebApps] = useState<WebApp[]>([]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { isChatDialogOpen, setIsChatDialogOpen, showFeatureMessage } = useFeatureChat();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntities = async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Failed to fetch entities:', error);
        return;
      }
      
      if (data) {
        setEntities(data);
      }
    };

    const fetchWebApps = async () => {
      const { data, error } = await supabase
        .from('web_apps')
        .select('id, name, original_name, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Failed to fetch web apps:', error);
        return;
      }
      
      if (data) {
        setWebApps(data);
      }
    };

    fetchEntities();
    fetchWebApps();

    // Subscribe to entity changes
    const subscription = supabase
      .channel('entities-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'entities'
      }, () => {
        fetchEntities();
      })
      .subscribe();

    // Subscribe to web app changes  
    const webAppSubscription = supabase
      .channel('web-apps-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'web_apps'
      }, () => {
        fetchWebApps();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      webAppSubscription.unsubscribe();
    };
  }, []);

  // Memoize the combined and sorted app icons to prevent re-shuffling
  const appIcons = useMemo(() => {
    const entityIcons: AppIcon[] = entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: 'entity'
    }));

    const webAppIcons: AppIcon[] = webApps.map(app => ({
      id: app.id,
      name: app.original_name || app.name,
      type: 'webapp'
    }));

    return [...entityIcons, ...webAppIcons].sort((a, b) => {
      const aItem = a.type === 'entity' 
        ? entities.find(e => e.id === a.id)
        : webApps.find(w => w.id === a.id);
      const bItem = b.type === 'entity'
        ? entities.find(e => e.id === b.id)
        : webApps.find(w => w.id === b.id);
        
      return (bItem?.created_at || '').localeCompare(aItem?.created_at || '');
    });
  }, [entities, webApps]);

  const handleEntityClick = useCallback((entityId: string) => {
    navigate(`/entity/${entityId}`);
  }, [navigate]);
  
  const handleWebAppClick = useCallback((webAppId: string) => {
    navigate(`/webapp/${webAppId}`);
  }, [navigate]);

  const mainIcons = [
    {
      src: 'https://imgur.com/DxVLlbK.jpg',
      label: 'X',
      href: 'https://x.com/amarascc'
    },
    {
      src: 'https://imgur.com/0gO2Lgj.jpg',
      label: 'Hello',
      onClick: () => setIsChatDialogOpen(true)
    },
    {
      src: 'https://imgur.com/OWHZ0QN.jpg',
      label: 'Scanner',
      onClick: () => navigate('/scanning')
    },
    {
      src: 'https://imgur.com/ywJzoII.jpg',
      label: 'Trade',
      onClick: () => setShowComingSoon(true)
    },
    {
      src: 'https://imgur.com/DiuR5HC.jpg',
      label: 'Wallet',
      onClick: () => setShowComingSoon(true)
    }
  ];

  return (
    <>
      <ComingSoonOverlay 
        show={showComingSoon} 
        onComplete={() => setShowComingSoon(false)} 
      />
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className={cn(
          "fixed left-6 top-6 flex flex-col gap-4 z-50 pointer-events-auto",
          "animate-fade-in"
        )}>
          {mainIcons.map((icon, index) => (
            <DesktopIcon key={`main-${index}`} {...icon} />
          ))}
        </div>

        <div className={cn(
          "fixed left-36 top-8 right-8 z-40",
          "h-[calc(100vh-4rem)] overflow-y-auto",
          "transition-opacity duration-500 pointer-events-auto",
          show ? 'opacity-100' : 'opacity-0'
        )}>
          <div className="grid grid-cols-6 gap-6 auto-rows-min pb-8 pr-4">
            {appIcons.map(app => (
              <DesktopIcon
                key={`${app.type}-${app.id}`}
                src={app.type === 'webapp' ? 'https://imgur.com/gvLT5ad.jpg' : 'https://imgur.com/jerpfFs.jpg'}
                label={app.name}
                onClick={() => app.type === 'webapp' ? handleWebAppClick(app.id) : handleEntityClick(app.id)}
                className="transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]"
              />
            ))}
          </div>
        </div>
      </div>

      <ChatDialog
        open={isChatDialogOpen}
        onOpenChange={setIsChatDialogOpen}
      />
    </>
  );
};