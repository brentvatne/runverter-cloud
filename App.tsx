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
import formatDuration from "format-duration";

const Blue = "#4375a7";
const HighlightBlue = "#39f";
const Gray = "#999";
const Colors = { Blue, HighlightBlue, Gray };
const FONT_SIZE = 25;
const MILES_PER_METER = 0.0006213709999999999;
type DistanceUnit = "km" | "mi";

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

// TODO: handle invalid states instead of depending on this. ux is awkward when
// you delete things and then end up with a 0 and have to type to have it
// overwrite the 0
function parseIntOrZero(text) {
  const value = parseInt(text, 10);
  return value ? value : 0;
}

// TODO: implement onChangeUnit via bottom sheet
function DistanceInput({ onChangeDistance, unit, onChangeUnit }) {
  const [integer, setInteger] = useState(42);
  const [decimal, setDecimal] = useState(20);

  React.useEffect(() => {
    onChangeDistance(parseFloat(`${integer}.${decimal}`) * 1000);
  }, [integer, decimal, unit]);

  return (
    <View style={{ flexDirection: "row" }}>
      <TextInput
        value={integer.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        style={styles.inputText}
        onChangeText={(text) => setInteger(parseIntOrZero(text))}
      />
      <Text style={[styles.inputSupportText, { marginHorizontal: 3 }]}>.</Text>
      <TextInput
        value={decimal.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        style={styles.inputText}
        onChangeText={(text) => setDecimal(parseIntOrZero(text))}
      />

      {/* todo: change unit */}
      <Text style={styles.inputText}>{unit}</Text>
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
      <TextInput
        value={hours.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setHours(parseInt(text, 10))}
        style={styles.inputText}
      />
      <Text style={styles.inputSupportText}>h</Text>
      <TextInput
        value={minutes.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setMinutes(parseInt(text, 10))}
        style={styles.inputText}
      />
      <Text style={styles.inputSupportText}>min</Text>
      <TextInput
        value={seconds.toString()}
        keyboardType="number-pad"
        selectTextOnFocus
        onChangeText={(text) => setSeconds(parseInt(text, 10))}
        style={styles.inputText}
      />
      <Text style={styles.inputSupportText}>sec</Text>
    </View>
  );
}

function Pace({ distanceMeters, timeSeconds, unit, onChangeUnit }) {
  const pace = React.useMemo(() => {
    if (distanceMeters === 0 || timeSeconds === 0) {
      return "∞";
    }

    let secondsPerUnit;
    if (unit === "km") {
      const distanceKm = distanceMeters / 1000.0;
      secondsPerUnit = timeSeconds / distanceKm;
    } else if (unit === "mi") {
      secondsPerUnit = timeSeconds / (distanceMeters * MILES_PER_METER);
    }

    return formatDuration(secondsPerUnit * 1000);
  }, [distanceMeters, timeSeconds, unit]);


  // todo: split minutes/seconds out so they can be changed to update the time as well

  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.inputText}>{pace}</Text>
      <View style={{ marginHorizontal: 3 }} />
      <Text style={styles.inputText}>min/{unit}</Text>
    </View>
  );
}

function Calculator() {
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
  });

  const [unit, setUnit] = useState<DistanceUnit>("km");
  const [distanceMeters, setDistanceMeters] = useState<number>();
  const [timeSeconds, setTimeSeconds] = useState<number>();
  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardDismissMode="on-drag"
      contentContainerStyle={{
        paddingTop: insets.top,
        alignItems: "center",
      }}
    >
      <Logo />
      <Introduction />
      <DistanceInput
        unit={unit}
        onChangeUnit={(newUnit) => setUnit(newUnit)}
        onChangeDistance={(distance) => {
          setDistanceMeters(distance);
        }}
      />

      <TimeInput
        onChangeTime={(value) => {
          setTimeSeconds(parseIntOrZero(value));
        }}
      />

      {typeof distanceMeters !== "undefined" &&
      typeof timeSeconds !== "undefined" ? (
        <Pace
          distanceMeters={distanceMeters}
          timeSeconds={timeSeconds}
          unit={unit}
          onChangeUnit={(newUnit) => setUnit(newUnit)}
        />
      ) : null}

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
  inputText: {
    color: Colors.Blue,
    fontSize: FONT_SIZE,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontWeight: "600",
  },
  inputSupportText: {
    fontWeight: "600",
    color: "#000",
    fontSize: FONT_SIZE,
    marginHorizontal: 10,
  },
});
