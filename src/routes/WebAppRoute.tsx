import { useParams } from 'react-router-dom';
import { WebAppDisplay } from '@/components/web/WebAppDisplay';
import { MainContent } from '@/components/MainContent';

export const WebAppRoute = () => {
  const { id } = useParams();
  return (
    <>
      <MainContent initialPhase="final" />
      {id && <WebAppDisplay webAppId={id} />}
    </>
  );
};