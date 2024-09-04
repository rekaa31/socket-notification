// src/LoginForm.js
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import ModalOtp from "./ModalOtp";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNeedOtp, setIsNeedOtp] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios
      .post("http://localhost:3000/users/login", { email, password })
      .then((response) => {
        if(response.data.is_need_otp){
			setIsNeedOtp(true);
		} else {
			localStorage.setItem("token", response.data.token);
			toast({
				title: "Login Success",
				description: "You have successfully logged in.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
      })
      .catch((err) => {
        toast({
          title: "Error",
          position: "top-right",
          description: err.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <ModalOtp isOpen={isNeedOtp} onClose={() => setIsNeedOtp(false)} email={email}/>

      <Box
        maxW="md"
        borderWidth={1}
        borderRadius="lg"
        overflow="hidden"
        p={6}
        m="auto"
        mt={12}
        boxShadow="lg"
      >
        <VStack spacing={4} align="stretch">
          <Heading as="h3" size="lg" textAlign="center">
            Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit" mt={4} width="full">
              Login
            </Button>
          </form>
        </VStack>
      </Box>
    </>
  );
};

export default LoginForm;
