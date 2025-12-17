import type { MonitorData } from './types';

export default function request(data: MonitorData | MonitorData[], url: string) {
  console.log('request', data, url);
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(console.error);
  }
}
