import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const sighUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (sighUpAttempt.status === "complete") {
        await setActive({ session: sighUpAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Sign up failed, please try again.");
        console.error(JSON.stringify(sighUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Sign up failed, please try again."
      );
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        keyboardVerticalOffset={60}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={authStyles.scrollContent}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/chef2.jpg")}
              style={authStyles.image}
            />
          </View>
          {/* title */}
          <Text style={authStyles.title}>Verify your email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a verification code to {email}
          </Text>
          {/* form */}
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.text}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={loading ? 1 : 0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? "..." : "Verify"}</Text>
            </TouchableOpacity>
            {/* go back */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.link}>Go back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
