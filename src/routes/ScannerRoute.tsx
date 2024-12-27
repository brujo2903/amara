import { MainContent } from '@/components/MainContent';
import { Scanner } from '@/components/scanner/Scanner';

export const ScannerRoute = () => {
  return (
    <>
      <MainContent initialPhase="final" />
      <Scanner />
    </>
  );
};