import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Spinner, Text, Table } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Students = () => {
  const { auth } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setStudents(res.data);
    } catch {
      const msg = 'Failed to load students.';
      setError(msg);
      toaster.create({ title: 'Error', description: msg, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Box p={6}>
      <Toaster />
      <Heading mb={6} color="blue.700">Students</Heading>
      {loading && (<Box textAlign="center" py={6}><Spinner size="xl" /></Box>)}
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {!loading && students.length === 0 && <Text>No students found.</Text>}
      {!loading && students.length > 0 && (
        <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="sm" p={4}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {students.map(({ _id, name, email, role }) => (
                <Table.Row key={_id}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{email}</Table.Cell>
                  <Table.Cell>{role.charAt(0).toUpperCase() + role.slice(1)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};

export default Students;