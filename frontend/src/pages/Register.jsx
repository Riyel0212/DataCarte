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

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
    if (generalError) setGeneralError('');
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const headersObj = {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      };

      const res = await axios.post(
        '/api/login',
        { email, password },
        { headers: headersObj }
      );

      if (!res.data || !res.data.token || !res.data.user) {
        throw new Error('Invalid response from server');
      }

      setAuth({
        token: res.data.token,
        user: res.data.user,
      });

      toaster.create({
        title: 'Login successful',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);

      setGeneralError(err.response?.data?.message || err.message || 'Login failed');

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
