import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Select, Spinner, Text, Table } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RecordsForm from '../components/RecordsForm';

const Records = () => {
  const { auth } = useContext(AuthContext);
  const isTeacher = auth?.user?.role === 'teacher';

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
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
    }
  };

  const fetchRecord = async () => {
    if (!studentId) {
      setRecord(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/records/${studentId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setRecord(res.data);
    } catch {
      const msg = 'Failed to load student records.';
      setError(msg);
      toaster.create({ title: 'Error', description: msg, status: 'error', duration: 5000, isClosable: true });
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  React.useEffect(() => {
    fetchRecord();
  }, [studentId]);

  return (
    <Box p={6}>
      <Toaster />
      <Heading mb={6} color="blue.700">Student Activity Records</Heading>
      {isTeacher && (
        <Select mb={6} placeholder="Select student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {students.map((student) => (
            <option key={student._id} value={student._id}>{student.name}</option>
          ))}
        </Select>
      )}
      {isTeacher && studentId && (
        <RecordsForm studentId={studentId} token={auth.token} onUpdate={fetchRecord} />
      )}
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {loading && (
        <Box textAlign="center" py={6}><Spinner size="xl" /></Box>
      )}
      {!loading && !record && <Text>No records found.</Text>}
      {!loading && record && record.activities && record.activities.length > 0 && (
        <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="sm" p={4}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Activity Name</Table.ColumnHeader>
                <Table.ColumnHeader>Score</Table.ColumnHeader>
                <Table.ColumnHeader>Remarks</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {record.activities.map((activity, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{new Date(activity.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{activity.name}</Table.Cell>
                  <Table.Cell>{activity.score}</Table.Cell>
                  <Table.Cell>{activity.remarks || '-'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
      {!loading && record && (!record.activities || record.activities.length === 0) && (
        <Text>No activities recorded for this student.</Text>
      )}
    </Box>
  );
};

export default Records;