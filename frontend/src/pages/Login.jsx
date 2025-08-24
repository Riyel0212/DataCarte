import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Input, Text, Heading, VStack, Link } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import useAuth from '../context/AuthContext';

const Login = () => {
  // Extract both `auth` and `setAuth` in case you want to log auth state or use it
  const { setAuth } = useAuth();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Track errors for each field
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // State for general error messages (string only)
  const [generalError, setGeneralError] = useState('');

  // Loading state while submitting
  const [loading, setLoading] = useState(false);

  // Email validation helper using regex
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
    // Return true if no errors exist
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific errors when user starts typing
  const handleEmailChange = (val) => {
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
    // Clear general error too when user changes input
    if (generalError) setGeneralError('');
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    if (generalError) setGeneralError('');
  };

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs first
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const headersObj = {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      };

      // Your API endpoint here
      const res = await axios.post(
        '/api/login',
        { email, password },
        { headers: headersObj }
      );

      // Defensive check for response data
      if (!res.data || !res.data.token || !res.data.user) {
        throw new Error('Invalid response from server');
      }

      // Update auth context with token and user info
      setAuth({
        token: res.data.token,
        user: res.data.user,
      });

      // Inform user of success
      toaster.create({
        title: 'Login successful',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      // Set a string message for rendering error safely
      setGeneralError(err.response?.data?.message || err.message || 'Login failed');

      // Also show the error in toaster
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
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md" bg="black">
      {/* Render general error message safely */}
      {generalError && (
        <Text color="red.500" mb={4} fontWeight="semibold" textAlign="center">
          {generalError}
        </Text>
      )}

      <Toaster />
      <Heading mb={6} color="blue.700" textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit} noValidate>
        <VStack spacing={4} align="flex-start">
          {/* Email input */}
          <Box w="100%">
            <Text htmlFor="email" fontWeight="semibold" mb={1} as="label">
              Email
            </Text>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="your-email@example.com"
              borderColor={errors.email ? 'red.500' : undefined}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </Box>

          {/* Password input */}
          <Box w="100%">
            <Text htmlFor="password" fontWeight="semibold" mb={1} as="label">
              Password
            </Text>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="********"
              borderColor={errors.password ? 'red.500' : undefined}
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.password}
              </Text>
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
          _hover={{ textDecoration: 'none', color: 'teal.700' }}
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
