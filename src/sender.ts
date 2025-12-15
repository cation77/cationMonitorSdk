export const sendErrorData = (errorData: Record<string, any>, url:string) => {
  const dataToSend = {
    ...errorData,
    userAgent: navigator.userAgent,
  }
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(dataToSend)], { type: 'application/json' })
    navigator.sendBeacon(url, blob)
  } else {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    }).catch(console.error)
  }
}