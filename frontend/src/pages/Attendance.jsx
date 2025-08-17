import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Select, Spinner, Text, Table } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AttendanceForm from '../components/AttendanceForm';

const Attendance = () => {
  const { auth } = useContext(AuthContext);
  const isTeacher = auth?.user?.role === 'teacher';

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
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
      toaster.create({ title: 'Error', description: msg, status: 'error', duration: 5000, isClosable: true});
    }
  };

  const fetchAttendance = async () => {
    if (!studentId) {
      setAttendanceRecords([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/attendance/${studentId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setAttendanceRecords(res.data);
    } catch {
      const msg = 'Failed to load attendance records.';
      setError(msg);
      toaster.create({ title: 'Error', description: msg, status: 'error', duration: 5000, isClosable: true });
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  React.useEffect(() => {
    fetchAttendance();
  }, [studentId]);
  
  return (
    <Box p={6}>
      <Toaster />
      <Heading mb={6} color="blue.700">Attendance</Heading>
      {isTeacher && (
        <Select mb={6} placeholder="Select student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {students.map((student) => (
            <option key={student._id} value={student._id}>{student.name}</option>
          ))}
        </Select>
      )}
      {isTeacher && studentId && (
        <AttendanceForm studentId={studentId} token={auth.token} onUpdate={fetchAttendance} />
      )}
      {loading && (
        <Box textAlign="center" py={6}><Spinner size="xl" /></Box>
      )}
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {!loading && attendanceRecords.length === 0 && <Text>No attendance records found.</Text>}
      {!loading && attendanceRecords.length > 0 && (
        <Box overflowX="auto" bg="white" borderRadius="md" boxShadow="sm" p={4}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {attendanceRecords.map((rec) => (
                <Table.Row key={rec._id}>
                  <Table.Cell>{new Date(rec.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};

export default Attendance;