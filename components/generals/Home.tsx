import { Text, ScrollView, Flex, Box, Center} from 'native-base'
import React, { useState } from 'react'

import HomeMoments from '../moments/HomeMoments'
import HomePets from '../pets/home'

const Home = () => {
    const [tab,setTab] = useState(0)
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
      <ScrollView>
        <Flex direction="row" mb="2.5" mt="1.5">
          {tabs.map(({ Component, label }, index) => (
            <Box flex={1 / 2} key={index}>
              <Box flex={1} flexDirection="column">
                <Text textAlign="center" onPress={()=>setTab(index)}>
                  {label}
                </Text>
                {tab === index ? (
                  <Box marginTop={15} mx={3}>
                    <Component />
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          ))}
        </Flex>
        <Center></Center>
      </ScrollView>
    );
}

export default Home