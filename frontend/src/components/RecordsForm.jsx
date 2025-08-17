import React, { useState } from 'react';
import { Box, Button, Input, Textarea, VStack, Text } from '@chakra-ui/react';
import { toaster } from '../components/ui/toaster';
import axios from 'axios';

const RecordsForm = ({ studentId, token, onUpdate }) => {
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState('');
  const [score, setScore] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityName || !date || !score) {
      toaster.create({
        title: 'Validation error',
        description: 'Please fill all required fields',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/records/${studentId}`,
        { name: activityName, date, score, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toaster.create({
        title: 'Record added',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      setActivityName('');
      setDate('');
      setScore('');
      setRemarks('');
      if (onUpdate) onUpdate();
    } catch (err) {
      toaster.create({
        title: 'Failed to add record',
        description: err.response?.data?.message || 'Server error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mb={6}>
      <Toaster />
      <VStack spacing={4} align="flex-start">
        <Box w="100%">
          <Text fontWeight="semibold" mb={1}>Activity Name*</Text>
          <Input value={activityName} onChange={(e) => setActivityName(e.target.value)} required />
        </Box>
        <Box w="100%">
          <Text fontWeight="semibold" mb={1}>Date*</Text>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Box>
        <Box w="100%">
          <Text fontWeight="semibold" mb={1}>Score*</Text>
          <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} required />
        </Box>
        <Box w="100%">
          <Text fontWeight="semibold" mb={1}>Remarks</Text>
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </Box>
        <Button type="submit" colorScheme="blue" isLoading={loading} width="full">
          Add Record
        </Button>
      </VStack>
    </Box>
  );
};

export default RecordsForm;