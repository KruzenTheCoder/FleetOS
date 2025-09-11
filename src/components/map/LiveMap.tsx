import dynamic from 'next/dynamic';
export default dynamic(() => import('./LiveMapInner'), { ssr: false });