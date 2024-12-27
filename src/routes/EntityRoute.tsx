import { useParams } from 'react-router-dom';
import { EntityDisplay } from '@/components/entity/EntityDisplay';
import { MainContent } from '@/components/MainContent';

export const EntityRoute = () => {
  const { id } = useParams();
  return (
    <>
      <MainContent initialPhase="final" />
      {id && <EntityDisplay entityId={id} />}
    </>
  );
};