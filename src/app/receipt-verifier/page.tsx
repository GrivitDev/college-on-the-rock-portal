'use client';

import { Suspense } from 'react';
import ReceiptVerificationResult from './ReceiptVerificationResult';

export default function Page() {
  return (
    <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <ReceiptVerificationResult />
    </Suspense>
  );
}
