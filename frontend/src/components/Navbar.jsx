// src/Navbar.js
import { BellIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Flex,
	Heading,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spacer
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
// Socket Client

const Navbar = (socket) => {

	const [list_notifications, setListNotifications] = useState([]);

	useEffect(() => {
		if(socket.socket !== null){
			socket.socket.on("new-notification", (data) => {
				setListNotifications((prev) => [...prev, data]);
			});
		}
	}, [socket]);

  return (
    <Box bg="teal.500" px={4} py={3} color="white">
      <Flex alignItems="center">
        <Heading as="h1" size="md">
          My App
        </Heading>

        <Spacer />

        <HStack spacing={4}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={
                <Box position="relative">
                  <BellIcon w={6} h={6} />
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-1"
                    right="-1"
                    fontSize="0.7em"
                  >
                    {list_notifications.length}
                  </Badge>
                </Box>
              }
              colorScheme="whiteAlpha"
            />
            <MenuList color="black">
              {list_notifications.map((notification, index) => (
				<MenuItem key={index}>{notification.message}</MenuItem>
			  ))}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
