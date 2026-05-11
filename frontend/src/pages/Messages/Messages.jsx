import './Messages.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeSidebar from '../../components/home/HomeSidebar';
import { navItems } from '../Home/Home.data';
import searchIcon from '../../assets/search-icon.png';
import infoIcon from '../../assets/info-icon.png';
import phoneIcon from '../../assets/phone-icon.png';
import pictureMessagesIcon from '../../assets/picture-messages-icon.png';
import plusIcon from '../../assets/plus-icon.png';
import sendIcon from '../../assets/send-icon.png';
import smileIcon from '../../assets/smile-icon.png';
import videoPhoneIcon from '../../assets/video-phone-icon.png';
import {
  getConversationMessages,
  getConversationUsers,
  sendMessage,
} from '../../services/messageService';
import { clearAuthSession } from '../../services/authStorage';

const formatTime = (value) => {
  if (!value) {
    return '';
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

const getInitial = (user) =>
  (user?.fullname?.[0] || user?.username?.[0] || user?.email?.[0] || 'U').toUpperCase();

const getDisplayName = (user) => user?.fullname || user?.username || user?.email || 'Unknown user';

const getHandle = (user) => (user?.username ? `@${user.username}` : user?.email || 'member');

const getPreview = (conversation) => {
  if (!conversation.lastMessage) {
    return 'No messages yet. Say hello.';
  }

  return `${conversation.lastMessage.fromMe ? 'You: ' : ''}${conversation.lastMessage.content}`;
};

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [draft, setDraft] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleAuthFailure = useCallback(() => {
    clearAuthSession();
    navigate('/login', { replace: true });
  }, [navigate]);

  const activeConversation = conversations.find((item) => item.user.id === activeUserId);
  const activeUser = activeConversation?.user;

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setError('');

    try {
      const data = await getConversationUsers();
      const nextConversations = data.data || [];
      setConversations(nextConversations);
      setActiveUserId((currentId) => currentId || nextConversations[0]?.user?.id || '');
    } catch (loadError) {
      if (loadError.status === 401) {
        handleAuthFailure();
        return;
      }

      setError(loadError.message || 'Could not load conversations.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [handleAuthFailure]);

  const loadMessages = useCallback(async (userId) => {
    if (!userId) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    setMessageError('');

    try {
      const data = await getConversationMessages(userId);
      setMessages(data.data || []);
      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.user.id === userId ? { ...conversation, unreadCount: 0 } : conversation,
        ),
      );
    } catch (loadError) {
      if (loadError.status === 401) {
        handleAuthFailure();
        return;
      }

      setMessageError(loadError.message || 'Could not load messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [handleAuthFailure]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadMessages(activeUserId);
  }, [activeUserId, loadMessages]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const user = conversation.user;
      const matchesFilter = filter === 'All' || conversation.unreadCount > 0;
      const matchesSearch =
        !normalizedSearch ||
        getDisplayName(user).toLowerCase().includes(normalizedSearch) ||
        getHandle(user).toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [conversations, filter, searchTerm]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || !activeUserId) {
      return;
    }

    setIsSending(true);
    setMessageError('');

    try {
      const createdMessage = await sendMessage(activeUserId, trimmedDraft);
      setMessages((currentMessages) => [...currentMessages, createdMessage]);
      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation.user.id === activeUserId
            ? {
                ...conversation,
                lastMessage: {
                  id: createdMessage.id,
                  content: createdMessage.content,
                  createdAt: createdMessage.createdAt,
                  fromMe: true,
                },
                unreadCount: 0,
              }
            : conversation,
        ),
      );
      setDraft('');
    } catch (sendError) {
      if (sendError.status === 401) {
        handleAuthFailure();
        return;
      }

      setMessageError(sendError.message || 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="home-page messages-page">
      <div className="home-shell">
        <HomeSidebar navItems={navItems} />

        <main className="messages-canvas">
          <header className="messages-search">
            <img src={searchIcon} alt="" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </header>

          <section className="messages-layout">
            <aside className="messages-inbox">
              <div className="messages-panel-heading">
                <h1>Inbox</h1>
                <button type="button" className="messages-compose-button" aria-label="Refresh" onClick={loadUsers}>
                  +
                </button>
              </div>

              <div className="messages-filters" aria-label="Message filters">
                {['All', 'Unread'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={filter === item ? 'is-active' : ''}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="messages-thread-list">
                {isLoadingUsers ? <p className="messages-state">Loading conversations...</p> : null}
                {error ? <p className="messages-state messages-state-error">{error}</p> : null}
                {!isLoadingUsers && !error && !filteredConversations.length ? (
                  <p className="messages-state">No users found.</p>
                ) : null}
                {filteredConversations.map((conversation) => {
                  const user = conversation.user;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      className={`messages-thread${user.id === activeUserId ? ' is-active' : ''}`}
                      onClick={() => setActiveUserId(user.id)}
                    >
                      <div className="messages-thread-avatar">
                        <span>{getInitial(user)}</span>
                      </div>
                      <div className="messages-thread-copy">
                        <strong>{getDisplayName(user)}</strong>
                        <p>{getPreview(conversation)}</p>
                      </div>
                      <span className="messages-thread-time">
                        {conversation.unreadCount ? `${conversation.unreadCount} new` : formatTime(conversation.lastMessage?.createdAt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="messages-chat">
              {activeUser ? (
                <>
                  <header className="messages-chat-header">
                    <div className="messages-chat-person">
                      <div className="messages-thread-avatar">
                        <span>{getInitial(activeUser)}</span>
                      </div>
                      <div>
                        <h2>{getDisplayName(activeUser)}</h2>
                        <p>{getHandle(activeUser)}</p>
                      </div>
                    </div>
                    <div className="messages-chat-tools">
                      <button type="button" aria-label="Video call">
                        <img src={videoPhoneIcon} alt="" />
                      </button>
                      <button type="button" aria-label="Voice call">
                        <img src={phoneIcon} alt="" />
                      </button>
                      <button type="button" aria-label="Conversation info">
                        <img src={infoIcon} alt="" />
                      </button>
                    </div>
                  </header>

                  <div className="messages-day-divider">Messages</div>

                  <div className="messages-chat-body">
                    {isLoadingMessages ? <p className="messages-state">Loading messages...</p> : null}
                    {messageError ? <p className="messages-state messages-state-error">{messageError}</p> : null}
                    {!isLoadingMessages && !messageError && !messages.length ? (
                      <p className="messages-state">No messages yet. Start the conversation.</p>
                    ) : null}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`messages-message-row${message.fromMe ? ' is-me' : ''}`}
                      >
                        {!message.fromMe ? (
                          <div className="messages-message-avatar">
                            <span>{getInitial(activeUser)}</span>
                          </div>
                        ) : null}
                        <div className="messages-bubble">
                          <p>{message.content}</p>
                          <span>{formatTime(message.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form className="messages-composer" onSubmit={handleSendMessage}>
                    <button type="button" aria-label="Add attachment">
                      <img src={plusIcon} alt="" />
                    </button>
                    <button type="button" aria-label="Add image">
                      <img src={pictureMessagesIcon} alt="" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                    />
                    <button type="button" aria-label="Emoji">
                      <img src={smileIcon} alt="" />
                    </button>
                    <button type="submit" className="messages-send-button" aria-label="Send message" disabled={isSending}>
                      {isSending ? '...' : <img src={sendIcon} alt="" />}
                    </button>
                  </form>
                </>
              ) : (
                <div className="messages-empty-chat">
                  <h2>Select a user</h2>
                  <p>Choose someone from the inbox to start messaging with real account data.</p>
                </div>
              )}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
