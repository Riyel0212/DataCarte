import React, { useState } from 'react';
import {
  Box, Button, Field, Input, Textarea,
  VStack, HStack, IconButton
} from '@chakra-ui/react';
import { toaster, Toaster } from './ui/toaster';
import axios from 'axios';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const ReportCardForm = ({ studentId, token, onUpdate }) => {
  const [term, setTerm] = useState('');
  const [comments, setComments] = useState('');
  const [grades, setGrades] = useState([{ subject: '', grade: '' }]);
  const [isLoading, setLoading] = useState(false);

  const handleGradeChange = (index, field, value) => {
    const newGrades = [...grades];
    newGrades[index][field] = value;
    setGrades(newGrades);
  };

  const addGradeField = () => setGrades([...grades, { subject: '', grade: '' }]);
  const removeGradeField = (index) => {
    const newGrades = grades.filter((_, i) => i !== index);
    setGrades(newGrades);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!term) {
      toaster.create({ title: 'Term is required', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (grades.some(g => !g.subject || !g.grade)) {
      toaster.create({ title: 'Fill all grades fields', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    try {
      // Try POST first (create)
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reportcards/${studentId}`,
        { term, grades, comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toaster.create({ title: 'Report card created', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      if (err.response?.status === 400) {
        // If exists, update instead (PUT)
        try {
          await axios.put(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reportcards/${studentId}`,
            { term, grades, comments },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toaster.create({ title: 'Report card updated', status: 'success', duration: 3000, isClosable: true });
        } catch (putErr) {
          toaster.create({ title: 'Error updating report card', status: 'error', duration: 4000, isClosable: true });
        }
      } else {
        toaster.create({
          title: 'Error creating report card',
          description: err.response?.data?.message || 'Server error',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
      onUpdate();
      setTerm('');
      setComments('');
      setGrades([{ subject: '', grade: '' }]);
    }
  };

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="sm" mb={6}>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="start">
          <Field.Root isRequired>
            <Field.Label>Term</Field.Label>
            <Input
              value={term}
              onChange={e => setTerm(e.target.value)}
              placeholder="e.g. Fall 2025"
            />
          </Field.Root>

          {grades.map((grade, idx) => (
            <HStack key={idx} width="100%">
              <Field.Root isRequired>
                <Field.Label>Subject</Field.Label>
                <Input
                  value={grade.subject}
                  onChange={e => handleGradeChange(idx, 'subject', e.target.value)}
                  placeholder="Subject"
                />
              </Field.Root>

              <Field.Root isRequired>
                <Field.Label>Grade</Field.Label>
                <Input
                  value={grade.grade}
                  onChange={e => handleGradeChange(idx, 'grade', e.target.value)}
                  placeholder="Grade"
                />
              </Field.Root>

              <IconButton
                aria-Label="Remove grade"
                icon={<DeleteIcon />}
                mt={6}
                colorScheme="red"
                onClick={() => removeGradeField(idx)}
                isDisabled={grades.length === 1}
              />
            </HStack>
          ))}

          <Button leftIcon={<AddIcon />} onClick={addGradeField} variant="outline">
            Add Subject
          </Button>

          <Field.Root>
            <Field.Label>Comments</Field.Label>
            <Textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Optional comments"
            />
          </Field.Root>

          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Save Report Card
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ReportCardForm;
