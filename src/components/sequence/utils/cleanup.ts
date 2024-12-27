export function createCleanup() {
  const timeouts: number[] = [];

  const setTimeout = (callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timeouts.push(id);
    return id;
  };

  const cleanup = () => {
    timeouts.forEach(window.clearTimeout);
    timeouts.length = 0;
  };

  return {
    setTimeout,
    cleanup,
  };
}