import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Input, Text, Heading, VStack, Link } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Track errors for each field
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  // Email validation helper
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate inputs before submitting
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific errors when user starts typing
  const handleEmailChange = (val) => {
    setEmail(val);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate first
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/login`,
        { email, password }
      );
      setAuth({
        token: res.data.token,
        user: res.data.user,
      });
      console.log('Auth: ', auth);
      toaster.create({
        title: 'Login successful',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toaster.create({
        title: 'Login failed',
        description: err.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md" bg="white">
      <Toaster />
      <Heading mb={6} color="blue.700" textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit} noValidate>
        <VStack spacing={4} align="flex-start">

          <Box w="100%">
            <Text htmlFor="email" fontWeight="semibold" mb={1} as="label">Email</Text>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="your-email@example.com"
              borderColor={errors.email ? 'red.500' : undefined}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
            )}
          </Box>

          <Box w="100%">
            <Text htmlFor="password" fontWeight="semibold" mb={1} as="label">Password</Text>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="********"
              borderColor={errors.password ? 'red.500' : undefined}
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>{errors.password}</Text>
            )}
          </Box>

          <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
            Login
          </Button>
        </VStack>
      </form>
      <Text mt={4} fontSize="sm" color="gray.600" textAlign="center">
        Forgot password? Contact admin.
      </Text>
      <Text mt={4} fontSize="sm" color="gray.600" textAlign="center">
        Don't have an account yet? Then SYBAU.
      </Text>
      <Text fontSize="sm" color="gray.600" textAlign="center" mb={2}>
        jk, register here. 
        <Link 
          as={RouterLink} 
          fontWeight="semibold" 
          textDecoration="underline" 
          _hover={{ textDecoration:'none', color: 'teal.700' }} 
          to="/register" 
          color="blue.500"
          ml={1}
        >
          Register
        </Link>
      </Text>
    </Box>
  );
};

export default Login;
