import WebSocket from 'ws';
import { IChannelResponse } from './helpers';

const ws = new WebSocket('wss://api.dydx.exchange/v3/ws');
let map: { [id: string]: Number } = {};

ws.on('open', () => {
  console.log('Connecting');

  const sub_msg = {
    type: "subscribe",
    channel: "v3_markets"
  };

  ws.send(JSON.stringify(sub_msg));
});

ws.on('message', (message: string) => {
  const response = JSON.parse(message);

  switch (response.type) {
    case 'connected':
      console.log('Connected');
      break;

    case 'subscribed':
      console.log('Subscribed');
      break;

    case 'channel_data':
      Object.entries(response.contents as IChannelResponse[]).forEach(([symbol, value]: [string, IChannelResponse]) => {
        if (value.indexPrice) {
          map[symbol] = value.indexPrice;
        }
      })
      //console.table(map);
      break;

    default:
      console.log(response);
  }
});

ws.on('close', () => {
  console.log('Disconnected from server');
});

ws.on('ping', () => {
    ws.pong();
})