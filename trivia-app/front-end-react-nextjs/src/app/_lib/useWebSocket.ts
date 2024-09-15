
import { useState, useEffect, useRef} from 'react';
export const useWebSocket = (endpoint: string) => {
  const [connected, setConnected] = useState(false);
  // could add type safety on the messages that are coming in
  const [message, setMessage] = useState<any>(null);
  const connection = useRef<WebSocket>(null!);

  useEffect(() => {
    const ws = new WebSocket(endpoint);
    connection.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onmessage = (evt) => setMessage(JSON.parse(evt.data));
    ws.onclose = () => setConnected(false);
    return ws.close
  }, [endpoint]);

  return { connected, message, send: (msg: string) => connection.current?.send(msg) };
};