import {
  Text,
  ScrollView,
  Flex,
  Box,
  Center,
  View,
  Button,
  Row,
  Column,
} from "native-base";
import React, { useState } from "react";

import HomeMoments from "../moments/HomeMoments";
import HomePets from "../pets/home";

const Home = () => {
  const [tab, setTab] = useState(0);
  const tabs = [
    {
      Component: HomeMoments,
      label: "Bucar Momentos",
    },
    {
      Component: HomePets,
      label: "Mis Mascotas",
    },
  ];
  return (
    <>
      <View >
        {tabs.map(({ Component, label }, index) => (
          <Button
            key={index}
            borderRadius={0}
            width="50%"
            height={20}
            position="absolute"
            left={index * 50 + '%'}
            backgroundColor={index === tab ? "coolGray.700" : "cyan.700"}
            onPress={() => setTab(index)}
          >
            {label}
          </Button>
        ))}
      </View>
      <View position="absolute" top="20">{tab === 0 ? <HomeMoments /> : <HomePets />}</View>
    </>
  );
};

export default Home;
