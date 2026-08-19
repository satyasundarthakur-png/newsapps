export function timeAgoOdia(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime()) || date.getTime() === 0) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "ବର୍ତ୍ତମାନ";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ମିନିଟ ପୂର୍ବେ`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ଘଣ୍ଟା ପୂର୍ବେ`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ଦିନ ପୂର୍ବେ`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
