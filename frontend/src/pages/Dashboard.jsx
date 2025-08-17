import React, { useContext } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const name = auth?.user?.name || 'User';

  return (
    <Box p={6}>
      <Heading color="blue.700" mb={4}>Dashboard</Heading>
      <Text fontSize="xl">Welcome back, <strong>{name}</strong>!</Text>
      {/* Customize with widgets, stats, quick links... */}
    </Box>
  );
};

export default Dashboard;