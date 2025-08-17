import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Heading,
  Select,
  Spinner,
  Text,
  Accordion,
  VStack,
  HStack,
  Tag
} from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReportCardForm from '../components/ReportCardForm';

const ReportCard = () => {
  const { auth } = useContext(AuthContext);
  const isTeacher = auth?.user?.role === 'teacher';

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [reportCards, setReportCards] = useState([]);
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

  const fetchReportCards = async () => {
    if (!studentId) {
      setReportCards([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reportcards/${studentId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setReportCards(res.data);
    } catch {
      const msg = 'Failed to load report cards.';
      setError(msg);
      toaster.create({ title: 'Error', description: msg, status: 'error', duration: 5000, isClosable: true });
      setReportCards([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  React.useEffect(() => {
    fetchReportCards();
  }, [studentId]);
  
  return (
    <Box p={6}>
      <Toaster />
      <Heading mb={6} color="blue.700">Report Cards</Heading>
      {isTeacher && (
        <Select mb={6} placeholder="Select student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {students.map((student) => (
            <option key={student._id} value={student._id}>{student.name}</option>
          ))}
        </Select>
      )}
      {isTeacher && studentId && (
        <ReportCardForm studentId={studentId} token={auth.token} onUpdate={fetchReportCards} />
      )}
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {loading && <Box textAlign="center" py={6}><Spinner size="xl"/></Box>}
      {!loading && reportCards.length === 0 && <Text>No report cards found for this student.</Text>}
      {!loading && reportCards.length > 0 && (
        <Accordion.Root collapsible>
          {reportCards.map((rc) => (
            <Accordion.Item key={rc._id}>
              <Accordion.ItemTrigger>
                <Box flex="1" textAlign="left" fontWeight="bold">{rc.term}</Box>
                <Accordion.ItemIndicator/>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent pb={4}>
                <VStack align="start" spacing={4}>
                  {rc.grades.map((grade, idx) => (
                    <HStack key={idx} spacing={6}>
                      <Tag size="md" colorScheme="blue" minW="120px" textAlign="center">{grade.subject}</Tag>
                      <Text fontWeight="medium">{grade.grade}</Text>
                    </HStack>
                  ))}
                  {rc.comments && (
                    <Box mt={2}>
                      <Text fontWeight="semibold">Comments:</Text>
                      <Text whiteSpace="pre-wrap">{rc.comments}</Text>
                    </Box>
                  )}
                </VStack>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </Box>
  );
};

export default ReportCard;