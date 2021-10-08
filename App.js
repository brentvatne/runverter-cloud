import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFonts, OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Blue = "#4375a7";
const HighlightBlue = "#39f";
const Gray = "#999";
const Colors = { Blue, HighlightBlue, Gray };

function Logo() {
  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        source={require("./assets/logo-small.png")}
        style={{ height: 50, width: 50, resizeMode: "contain" }}
      />
      <Text
        style={{
          fontFamily: "OpenSans_400Regular",
          color: Colors.Blue,
          fontSize: 35,
        }}
      >
        runverter
      </Text>
    </View>
  );
}

function Introduction() {
  return (
    <>
      <View style={{ marginTop: 15 }} />
      <Text style={{ fontSize: 25 }}>
        Hi! I'm the <Text style={{ color: Colors.Blue }}>Pace Calculator</Text>
      </Text>
      <View style={{ marginTop: 15 }} />
      <Text
        style={{
          color: Colors.Gray,
          fontSize: 16,
          textAlign: "center",
        }}
      >
        See which pace you need to finish a run in your desired time.
      </Text>

      <View style={{ marginTop: 15 }} />
    </>
  );
}

function DistanceInput({ onChangeDistance }) {
  const [integer, setInteger] = useState(42);
  const [decimal, setDecimal] = useState(20);
  const [unit, setUnit] = useState("km");

  React.useEffect(() => {
    onChangeDistance({ value: parseFloat(`${integer}.${decimal}`), unit });
  }, [integer, decimal, unit]);

  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={{
          color: Colors.Gray,
          fontSize: 16,
          textAlign: "center",
        }}
      >
        Running a distance of
      </Text>
      <TextInput
        value={integer.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setInteger(parseInt(text, 10))}
      />
      <Text>.</Text>
      <TextInput
        value={decimal.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setDecimal(parseInt(text, 10))}
      />
      <Text>{unit}</Text>
    </View>
  );
}

function TimeInput({ onChangeTime }) {
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(59);
  const [seconds, setSeconds] = useState(59);

  React.useEffect(() => {
    onChangeTime(seconds + minutes * 60 + hours * 60 * 60);
  }, [hours, minutes, seconds]);

  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={{
          color: Colors.Gray,
          fontSize: 16,
          textAlign: "center",
        }}
      >
        in
      </Text>
      <TextInput
        value={hours.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setHours(parseInt(text, 10))}
        style={{ marginHorizontal: 5, fontSize: 16 }}
      />
      <Text style={{ fontSize: 16, color: Colors.Gray }}>h</Text>
      <TextInput
        value={minutes.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setMinutes(parseInt(text, 10))}
        style={{ marginHorizontal: 5, fontSize: 16 }}
      />
      <Text style={{ fontSize: 16, color: Colors.Gray }}>min</Text>
      <TextInput
        value={seconds.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setSeconds(parseInt(text, 10))}
        style={{ marginHorizontal: 5, fontSize: 16 }}
      />
      <Text style={{ fontSize: 16, color: Colors.Gray }}>sec</Text>
    </View>
  );
}

function Pace({ distance, time }) {
  return null;
}

function Calculator() {
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
  });
  const [distanceMeters, setDistanceMeters] = useState();
  const [timeSeconds, setTimeSeconds] = useState();
  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: insets.top,
        alignItems: "center",
      }}
    >
      <Logo />
      <Introduction />
      <DistanceInput
        onChangeDistance={(value) => {
          setDistanceMeters(JSON.stringify(value));
        }}
      />

      <TimeInput
        onChangeTime={(value) => {
          setTimeSeconds(value);
        }}
      />

      {distanceMeters && timeSeconds ? <Pace distanceMeters={distanceMeters} timeSeconds={timeSeconds} /> : null}

      <Text>{distanceMeters}</Text>
      <Text>{timeSeconds}</Text>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Calculator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
