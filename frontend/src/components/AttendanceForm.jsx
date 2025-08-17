import React, { useState } from 'react';
import {
  Box, Button, Select, Input
} from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import axios from 'axios';

const AttendanceForm = ({ studentId, token, onUpdate }) => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('present');
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !status) {
      toaster.create({
        title: 'Please fill all fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      // Call POST endpoint to create attendance
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/attendance/${studentId}`,
        { date, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toaster.create({
        title: 'Attendance added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setDate('');
      setStatus('present');
      onUpdate();
    } catch (err) {
      // If attendance exists, suggest editing via PUT (not implemented here)
      toaster.create({
        title: 'Error adding attendance',
        description: err.response?.data?.message || 'Server error',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="sm" mb={6}>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <Field.Root mb={3} isRequired>
          <Field.Label>Date</Field.Label>
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </Field.Root>
        <Field.Root mb={3} isRequired>
          <Field.Label>Status</Field.Label>
          <Select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </Select>
        </Field.Root>
        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Add Attendance
        </Button>
      </form>
    </Box>
  );
};

export default AttendanceForm;
