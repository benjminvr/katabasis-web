import { useState, useEffect } from 'react';
import { useAsyncError, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 2px solid #4a9eff;
`;
const DeleteButton = styled.button<{ disabled?: boolean }>`
    background: #ff4a4a;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #d43d3d;
        transform: scale(1.02);
    }

    &:disabled {
        background: #666;
        cursor: not-allowed;
    }
`;
const ConfimationModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`

const ModalContent = styled.div`
    background: rgba(0,0,20,0.95);
    padding: 2rem;
    border-radius: 8px;
    border: 4px solid #ff4a4a;
    max-width: 400px;
    width: 90%;
    text-align: center;
`

const ModalTitle = styled.h2`
    color: #ff4a4a;
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
    margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
`;

const ModalButton = styled.button<{ isCancel?: boolean}>`
    padding: 0.5rem 1rem;
    background: ${props => props.isCancel ? '#4a9eff' : '#ff4a4a'};
    border: none;
    border-radius: 4px;
    color: white;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: scale(1.02);
        background: ${props => props.isCancel ? "#357abd" : "#d43d3d"}
    }
`;

const ChatContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/images/underwater-fantasy-preview.png') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const ChatBox = styled.div`
  background: rgba(0, 0, 20, 0.8);
  border-radius: 8px;
  border: 4px solid #4a9eff;
  box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
  backdrop-filter: blur(4px);
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 2px solid #4a9eff;
  color: #4a9eff;
  font-family: 'Press Start 2P', cursive;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 0.8rem;
  border-radius: 8px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? '#4a9eff' : '#2a2a4a'};
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  line-height: 1.4;
  word-wrap: break-word;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 2px solid #4a9eff;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  background: #000;
  border: 2px solid #4a9eff;
  border-radius: 4px;
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
  }
`;

const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #4a9eff;
  border: none;
  border-radius: 4px;
  color: white;
  font-family: 'Press Start 2P', cursive;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #357abd;
    transform: scale(1.02);
  }

  &:disabled {
    background: #2a2a4a;
    cursor: not-allowed;
  }
`;

interface Message{
    id: number;
    content: string;
    isUser: boolean;
}

const Chat = () => {
    const [messages,setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token){
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!inputMessage.trim() || isLoading) return;

        const newUserMessage: Message = {
            id: Date.now(),
            content: inputMessage,
            isUser: true,
        }
        
        //Takes the previous messages and copy the new one
        setMessages(prev => [...prev,newUserMessage])
        setInputMessage('')
        setIsLoading(true);

        try{
            const response = await fetch('http://localhost:8000/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    message: inputMessage,
                    npc_name: 'guide',
                }),
            });

            if(response.ok) {
                const data = await response.json();
                console.log("NPC response: ", data)
                const npcResponse: Message = {
                    id: Date.now() + 1,
                    content: data.response,
                    isUser: false,
                };
                setMessages(prev => [...prev,npcResponse])
            } else if(response.status === 404){
                navigate('/login')
            } else{
                throw new Error('Failed to get response');
            }
        } catch(error) {
            console.error('Chat eror:', error);
            alert('Failed to send message. Please try again. ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async() => {
        setIsDeleting(true);
        try {
            const response = await fetch('http://localhost:8000/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok){
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to kill you');
            } 
        }catch (error) {
            console.error('Dying error: ', error);
            alert('Failed to delete account. Please try again.');
        }finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <ChatContainer>
            <ChatBox>
                <ChatHeader>WELCOME TO YOUR KATABASIS</ChatHeader>
                    <DeleteButton onClick={() => setShowDeleteModal(true)}
                        disabled={isDeleting}
                        >
                            DIE
                    </DeleteButton>
                    <MessagesContainer>
                        {messages.length === 0 ? (
                            <div style={{ 
                            color: '#4a9eff', 
                            textAlign: 'center', 
                            fontFamily: 'Press Start 2P', 
                            fontSize: '0.8rem',
                            padding: '2rem' 
                            }}>
                            Start your conversation with your other self...
                            </div>
                        ) : (
                            messages.map(message => (
                            <MessageBubble key={message.id} isUser={message.isUser}>
                                {message.content}
                            </MessageBubble>
                            ))
                        )}
                    </MessagesContainer>
                <InputContainer onSubmit={handleSubmit}>
                    <ChatInput
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target. value)}
                        placeholder='What are you waiting for?...'
                        disabled={isLoading}
                    />
                    <SendButton type="submit" disabled={isLoading || !inputMessage.trim()}>
                        {isLoading ? 'SENDING...' : 'SEND'}
                    </SendButton>
                </InputContainer>
                {showDeleteModal && (
                    <ConfimationModal>
                       <ModalContent>
                            <ModalTitle>
                                Are you ready to die?
                            </ModalTitle>
                            <div style={{color: '#fff', fontFamily: 'Press Start 2P', fontSize: '0.8rem'}}>
                                This action cannot be undone. You will cease to exist.
                            </div>
                            <ModalButtons>
                                <ModalButton 
                                    isCancel 
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    CANCEL
                                </ModalButton>
                                <ModalButton 
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'DYING...' : 'DIE'}
                                </ModalButton>
                            </ModalButtons>
                        </ModalContent> 
                    </ConfimationModal>
                )}
            </ChatBox>
        </ChatContainer>
    )

}

export default Chat;