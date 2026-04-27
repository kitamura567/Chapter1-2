import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {StudyTime} from './StudyTime';

const rootElement =document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <StudyTime />
  </StrictMode>
)