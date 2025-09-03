import CatList from '@/components/CatList';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <CatList />
    </Suspense>
  );
}