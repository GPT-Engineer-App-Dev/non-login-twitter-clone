import { Box, VStack, Input, Button, Text, Image, useToast } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getClient } from '../../lib/crud';

const Index = () => {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState('anonymous');
  const [tweetText, setTweetText] = useState('');
  const toast = useToast();
  const client = getClient('twitter-clone');

  useEffect(() => {
    const fetchTweets = async () => {
      const data = await client.getWithPrefix('tweet:');
      if (data) {
        setTweets(data.sort((a, b) => new Date(b.value.date) - new Date(a.value.date)));
      }
    };
    fetchTweets();
  }, []);

  const handleDeleteTweet = async (key) => {
    const success = await client.delete(key);
    if (success) {
      setTweets(tweets.filter(tweet => tweet.key !== key));
      toast({
        title: 'Tweet deleted',
        description: 'The tweet has been successfully deleted.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTweet = async () => {
    if (!tweetText) {
      toast({
        title: 'Error',
        description: 'Tweet cannot be empty.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const key = `tweet:${Date.now()}`;
    const tweet = { key, value: { username: username || 'anonymous', text: tweetText, date: new Date().toISOString() } };
    const success = await client.set(key, tweet);
    if (success) {
      setTweets([tweet, ...tweets]);
      setTweetText('');
      toast({
        title: 'Tweet posted',
        description: 'Your tweet has been posted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} p={5}>
      <Image src="/images/twitter-banner.png" alt="Twitter Clone Banner" />
      <Box>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input placeholder="What's happening?" value={tweetText} onChange={(e) => setTweetText(e.target.value)} />
        <Button colorScheme="twitter" mt={2} onClick={handleTweet}>Tweet</Button>
      </Box>
      <VStack spacing={4} align="stretch">
        {tweets.map((tweet, index) => (
          <Box key={index} p={4} shadow="md" borderWidth="1px">
            <Text fontWeight="bold">{tweet.value.username}</Text>
            <Text>{tweet.value.text}</Text>
            <Text fontSize="sm">{new Date(tweet.value.date).toLocaleString()}</Text>
            <Button onClick={() => handleDeleteTweet(tweet.key)} colorScheme="red" size="sm">
              <FaTrash />
            </Button>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default Index;