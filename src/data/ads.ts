// Ad placements and configurations
export interface AdConfig {
  id: string;
  title: string;
  image: string;
  link: string;
  alt: string;
  category?: string;
  type: 'banner' | 'sidebar' | 'inline' | 'sticky';
  priority?: number;
}

// Placeholder fallback ads shown when no advertiser has subscribed to a slot
export const ADS_LIST: AdConfig[] = [
  {
    id: 'placeholder-banner-1',
    title: 'Advertise Here',
    image: '/images/ads/placeholder-970x194.svg',
    link: '/advertise',
    alt: 'Advertise your business here',
    type: 'banner',
    priority: 1,
  },
  {
    id: 'placeholder-sidebar-1',
    title: 'Advertise Here',
    image: '/images/ads/placeholder-300x400.svg',
    link: '/advertise',
    alt: 'Advertise your business here',
    type: 'sidebar',
    priority: 1,
  },
  {
    id: 'placeholder-inline-1',
    title: 'Advertise Here',
    image: '/images/ads/placeholder-800x450.svg',
    link: '/advertise',
    alt: 'Advertise your business here',
    type: 'inline',
    priority: 1,
  },
  {
    id: 'placeholder-sticky-1',
    title: 'Advertise Here',
    image: '/images/ads/placeholder-300x300.svg',
    link: '/advertise',
    alt: 'Advertise your business here',
    type: 'sticky',
    priority: 1,
  },
];

export const getAdsByType = (type: AdConfig['type']): AdConfig[] => {
  return ADS_LIST.filter(ad => ad.type === type).sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

export const getRandomAd = (type?: AdConfig['type']): AdConfig | null => {
  const ads = type ? getAdsByType(type) : ADS_LIST;
  return ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;
};
