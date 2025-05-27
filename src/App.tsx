import {AiChat} from '@nlux/react';
import {useChatAdapter} from '@nlux/nlbridge-react';
import '@nlux/themes/nova.css';

export const App = () => {
    const nlbridgeAdapter = useChatAdapter({
    url: 'http://localhost:8080/chat-api',
  });

    return (
        <AiChat
            adapter={nlbridgeAdapter}
            composerOptions={{
                placeholder: 'How can I help you today?'
            }}
        />
    );
};

export default App;