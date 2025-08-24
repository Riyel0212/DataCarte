import React, { useState } from 'react';
import { 
  Box, 
  Button,
  Input, 
  Text, 
  Heading, 
  VStack, 
  Menu,
  Portal, 
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// RoleMenu component remains unchanged
const RoleMenu = ({ value, onChange, error }) => {
  const options = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent' },
  ];

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || 'Select role';

  return (
    <Box>
      <Text fontWeight="semibold" mb={1}>Role</Text>

      <Box
        mb={2}
        p={2}
        border="1px solid"
        borderColor={error ? 'red.500' : 'gray.300'}   // Red border on error
        borderRadius="md"
        minHeight="32px"
        fontWeight="medium"
        color={value ? 'black' : (error ? 'red.500' : 'gray.500')}
      >
        {value ? selectedLabel : 'No role selected'}
      </Box>

      <Menu.Root>
        <Menu.Trigger asChild>
          <Button width="100%" textAlign="left" rightIcon={<ChevronDownIcon />}>
            {selectedLabel}
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {options.map((opt) => (
                <Menu.Item
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  bg={opt.value === value ? 'teal.100' : 'transparent'}
                >
                  {opt.label}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};


const Register = () => {
  // Holds form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  // Holds validation error messages per field
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  // To track if form is submitting
  const [loading, setLoading] = useState(false);

  // useNavigate hook must be at the top level of the component
  const navigate = useNavigate();

  // Validates email
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handles input changes and clears the error for that field
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate all form fields
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role selection is required';
    }

    setErrors(newErrors);

    // Successful if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const headersObj = {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      };

      await axios.post('/api/register', formData, { headers: headersObj });

      // Show success toast with 3 seconds duration
      toaster.create({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form and errors
      setFormData({ name: '', email: '', password: '', role: '' });
      setErrors({});

      // Delay navigation so the toast can be seen
      setTimeout(() => {
        navigate('/Dashboard');
      }, 3000); // Matches toast duration

    } catch (err) {
      toaster.create({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Registration error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md" bg="white">
      <Toaster />
      <Heading mb={6} color="blue.700" textAlign="center">Register</Heading>
      <form onSubmit={handleSubmit} noValidate>
        <VStack spacing={4} align="flex-start">

          {/* Name Field */}
          <Box w="100%">
            <Text as="label" htmlFor="name" fontWeight="semibold" mb={1}>Name</Text>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Full name"
              borderColor={errors.name ? 'red.500' : undefined}
            />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.name}</Text>
            )}
          </Box>

          {/* Email Field */}
          <Box w="100%">
            <Text as="label" htmlFor="email" fontWeight="semibold" mb={1}>Email</Text>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="your-email@example.com"
              borderColor={errors.email ? 'red.500' : undefined}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
            )}
          </Box>

          {/* Password Field */}
          <Box w="100%">
            <Text as="label" htmlFor="password" fontWeight="semibold" mb={1}>Password</Text>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder="Enter password"
              borderColor={errors.password ? 'red.500' : undefined}
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.password}</Text>
            )}
          </Box>

          {/* Role Field */}
          <Box w="100%">
            <RoleMenu
              value={formData.role}
              onChange={(val) => handleChange('role', val)}
              error={!!errors.role}
            />
            {errors.role && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.role}</Text>
            )}
          </Box>

          <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
