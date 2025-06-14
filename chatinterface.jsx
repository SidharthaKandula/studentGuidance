import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, FileText, Sparkles, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatInterface = ({ documents, selectedDocument }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' or 'summarize'
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateMockResponse(inputMessage, selectedDocument),
        timestamp: new Date(),
        sources: selectedDocument ? [selectedDocument.name] : ['Multiple documents']
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedDocument) {
      toast({
        title: "No document selected",
        description: "Please select a document to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const summaryMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Here's a summary of "${selectedDocument.name}":\n\nThis document covers key concepts and important information relevant to your studies. The main topics include foundational principles, practical applications, and detailed explanations of core concepts.\n\n**Key Points:**\n• Important concept 1\n• Critical information 2\n• Essential details 3\n\n**Recommendations:**\nFocus on the highlighted sections for exam preparation and consider reviewing the examples provided for better understanding.`,
        timestamp: new Date(),
        sources: [selectedDocument.name],
        isSummary: true
      };

      setMessages(prev => [...prev, summaryMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (question, document) => {
    const responses = [
      `Based on ${document ? `"${document.name}"` : 'your documents'}, here's what I found: ${question.toLowerCase().includes('what') ? 'This concept refers to...' : question.toLowerCase().includes('how') ? 'The process involves...' : 'According to the material...'}`,
      `From the content in ${document ? `"${document.name}"` : 'your uploaded materials'}, I can explain that this topic is important because it provides foundational understanding of the subject matter.`,
      `Looking at ${document ? `"${document.name}"` : 'your documents'}, the answer to your question involves several key components that work together to achieve the desired outcome.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="h-[600px] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              AI Study Assistant
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={mode === 'chat' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('chat')}
              >
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                disabled={!selectedDocument || isLoading}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Summarize
              </Button>
            </div>
          </div>
          {selectedDocument && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chatting with: {selectedDocument.name}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Start by asking a question about your documents
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && <Bot className="w-5 h-5 mt-1 flex-shrink-0" />}
                      {message.type === 'user' && <User className="w-5 h-5 mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.sources && (
                          <div className="mt-2 text-xs opacity-75">
                            <FileText className="w-3 h-3 inline mr-1" />
                            Sources: {message.sources.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ask a question about your documents..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
