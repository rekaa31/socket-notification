// src/ModalOtp.js
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const ModalOtp = (props) => {
  // eslint-disable-next-line react/prop-types
  const { isOpen, onClose, email } = props;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const toast = useToast();

  const handleChange = (value, index) => {
    if (isNaN(value)) return; // Prevent non-numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input automatically if not the last input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = () => {
    if (otp.some((digit) => digit === "")) {
      toast({
        title: "Invalid OTP",
        description: "Please fill in all OTP fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const otpCode = otp.join("");

    axios
      .post("http://localhost:3000/users/verify-otp", {
        email: email,
        otp: otpCode,
      })
      .then((response) => {
        // Set Local Storage
		localStorage.setItem("token", response.data.token);

        toast({
          title: "OTP Submitted",
          description: `You entered: ${otpCode}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

		setTimeout(() => {
			window.location.reload();
		});
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

    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter OTP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing={2} justify="center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  maxLength={1}
                  type="text"
                  textAlign="center"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onFocus={(e) => e.target.select()}
                  w="50px"
                  h="50px"
                  fontSize="2xl"
                />
              ))}
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalOtp;
