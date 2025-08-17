import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Spinner, Text, Table } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Teachers = () => {
  const { auth } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/teachers`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setTeachers(res.data);
    } catch {
      const msg = 'Failed to load teachers.';
      setError(msg);
      toaster.create({ title: 'Error', description: msg, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <Box p={6}>
      <Toaster />
      <Heading mb={6} color="blue.700">Teachers</Heading>
      {loading && (<Box textAlign="center" py={6}><Spinner size="xl"/></Box>)}
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {!loading && teachers.length === 0 && <Text>No teachers found.</Text>}
      {!loading && teachers.length > 0 && (
        <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="sm" p={4}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teachers.map(({ _id, name, email }) => (
                <Table.Row key={_id}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};

export default Teachers;