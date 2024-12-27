import { Route, Navigate } from 'react-router-dom';
import { EntityRoute } from './EntityRoute';
import { WebAppRoute } from './WebAppRoute';
import { ScanningRoute } from './ScanningRoute';
import { ScannerRoute } from './ScannerRoute';
import { HomeRoute } from './HomeRoute';

export const AppRoutes = [
  <Route key="home" path="/home" element={<HomeRoute />} />,
  <Route key="entity" path="/entity/:id" element={<EntityRoute />} />,
  <Route key="webapp" path="/webapp/:id" element={<WebAppRoute />} />,
  <Route key="scanning" path="/scanning" element={<ScanningRoute />} />,
  <Route key="scanner" path="/scanner" element={<ScannerRoute />} />,
  <Route key="catch-all" path="*" element={<Navigate to="/" replace />} />
];