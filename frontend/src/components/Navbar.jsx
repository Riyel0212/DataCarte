import React, { useContext } from 'react';
import { Box, Flex, Button, Heading, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.50" px={6} py={4} boxShadow="sm" borderRadius="md" mb={6}>
      <Flex maxW="1200px" mx="auto" align="center">
        <Heading size="md" color="blue.700" fontWeight="semibold">
          School Manager
        </Heading>
        <Spacer />
        {auth ? (
          <>
            <Button as={Link} to="/dashboard" variant="ghost" colorScheme="blue" mr={4}>
              Dashboard
            </Button>
            <Button as={Link} to="/attendance" variant="ghost" colorScheme="blue" mr={4}>
              Attendance
            </Button>
            <Button as={Link} to="/records" variant="ghost" colorScheme="blue" mr={4}>
              Records
            </Button>
            <Button as={Link} to="/reportcards" variant="ghost" colorScheme="blue" mr={4}>
              Report Cards
            </Button>
            <Button onClick={handleLogout} colorScheme="red" size="sm" ml={4}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" variant="ghost" colorScheme="blue" mr={4}>
              Login
            </Button>
            <Button as={Link} to="/register" colorScheme="blue">
              Register
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
